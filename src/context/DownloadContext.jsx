import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSubscription } from './SubscriptionContext';

const DownloadContext = createContext(undefined);

export const DownloadProvider = ({ children }) => {
    const { recordDownload, canDownloadVideo, setIsPricingModalOpen } = useSubscription();

    const [downloadHistory, setDownloadHistory] = useState(() => {
        try {
            const stored = localStorage.getItem('wetube_download_history');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    });

    const [activeDownloads, setActiveDownloads] = useState([]);
    const [downloadModalVideo, setDownloadModalVideo] = useState(null);

    useEffect(() => {
        try {
            localStorage.setItem('wetube_download_history', JSON.stringify(downloadHistory));
        } catch (e) {
            console.error('Failed to save download history', e);
        }
    }, [downloadHistory]);

    const openDownloadModal = (video) => {
        setDownloadModalVideo(video);
    };

    const closeDownloadModal = () => {
        setDownloadModalVideo(null);
    };

    const startDownload = (video, resolution = '720p') => {
        const check = canDownloadVideo(resolution);
        if (!check.allowed) {
            alert(check.reason);
            setIsPricingModalOpen(true);
            return false;
        }

        const downloadId = `dl_${Date.now()}`;
        const newDownloadItem = {
            id: downloadId,
            videoId: video.id,
            title: video.title,
            thumbnail: video.thumbnail,
            channelName: video.channelName,
            resolution,
            fileSize: getEstimatedFileSize(video.durationSec || 600, resolution),
            progress: 0,
            status: 'downloading',
            downloadedAt: new Date().toISOString(),
        };

        setActiveDownloads((prev) => [...prev, newDownloadItem]);
        recordDownload();
        closeDownloadModal();

        // Simulate progressive download stream
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 15) + 10;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);

                const completedItem = { ...newDownloadItem, progress: 100, status: 'completed' };

                setActiveDownloads((prev) => prev.filter((d) => d.id !== downloadId));
                setDownloadHistory((prev) => [completedItem, ...prev]);

                triggerBrowserFileSave(completedItem);
            } else {
                setActiveDownloads((prev) =>
                    prev.map((d) => (d.id === downloadId ? { ...d, progress: currentProgress } : d))
                );
            }
        }, 400);

        return true;
    };

    const removeDownloadedVideo = (downloadId) => {
        setDownloadHistory((prev) => prev.filter((item) => item.id !== downloadId));
    };

    const clearAllDownloads = () => {
        setDownloadHistory([]);
    };

    const getEstimatedFileSize = (durationSec = 600, resolution = '720p') => {
        const bitrates = {
            '360p': 0.8,
            '480p': 1.5,
            '720p': 3.0,
            '1080p': 6.0,
            '1440p': 12.0,
            '4K': 25.0,
        };
        const mbps = bitrates[resolution] || 3.0;
        const megabytes = (durationSec * mbps) / 8;
        return `${Math.round(megabytes)} MB`;
    };

    const triggerBrowserFileSave = (downloadItem) => {
        const content = `WeTube Controlled Download Artifact\n\nTitle: ${downloadItem.title}\nResolution: ${downloadItem.resolution}\nDownloaded At: ${downloadItem.downloadedAt}\nStatus: Verified Offline Copy`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${downloadItem.title.replace(/[^a-zA-Z0-9]/g, '_')}_${downloadItem.resolution}.wetube`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <DownloadContext.Provider
            value={{
                downloadHistory,
                activeDownloads,
                downloadModalVideo,
                openDownloadModal,
                closeDownloadModal,
                startDownload,
                removeDownloadedVideo,
                clearAllDownloads,
                getEstimatedFileSize,
            }}
        >
            {children}
        </DownloadContext.Provider>
    );
};

export const useDownload = () => {
    const context = useContext(DownloadContext);
    if (!context) {
        throw new Error('useDownload must be used within a DownloadProvider');
    }
    return context;
};
