import React, { useState, useRef } from 'react';
import { UploadCloud, Crown, Film, Sparkles, Check, X, FileVideo, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { CATEGORIES } from '../data/videoData';

export default function UploadModal({ isOpen, onClose, onAddVideo }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Coding');
    const [tier, setTier] = useState('Free');

    // File upload state
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'url'

    const videoInputRef = useRef(null);
    const thumbInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    if (!isOpen) return null;

    const handleVideoFileSelect = (file) => {
        if (!file) return;
        setVideoFile(file);
        const objectUrl = URL.createObjectURL(file);
        setVideoUrl(objectUrl);
        if (!title) {
            // Auto-populate title from file name
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
            setTitle(nameWithoutExt);
        }
    };

    const handleThumbnailFileSelect = (file) => {
        if (!file) return;
        setThumbnailFile(file);
        const objectUrl = URL.createObjectURL(file);
        setThumbnailUrl(objectUrl);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('video/')) {
                handleVideoFileSelect(file);
            } else {
                alert('Please drop a valid video file (.mp4, .webm, .mov)');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('Please enter a video title');
            return;
        }

        const finalVideoUrl = videoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
        const finalThumbnail = thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';

        const newVideo = {
            id: `v_upload_${Date.now()}`,
            title: title.trim(),
            description: description.trim() || 'Uploaded video on WeTube platform.',
            thumbnail: finalThumbnail,
            videoUrl: finalVideoUrl,
            channelName: 'Alex Rivera (Creator)',
            channelHandle: '@alexrivera',
            channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            views: '1 view',
            uploadedAt: 'Just now',
            tierExclusive: tier,
            category,
            duration: '10:00',
            durationSec: 600,
            tags: ['#custom', '#creator', '#upload'],
            chapters: [],
        };

        onAddVideo(newVideo);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategory('Coding');
        setTier('Free');
        setVideoFile(null);
        setVideoUrl('');
        setThumbnailFile(null);
        setThumbnailUrl('');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content upload-modal-box glass-panel">
                <div className="upload-header">
                    <div className="title-group">
                        <UploadCloud size={24} className="text-cyan animate-pulse" />
                        <div>
                            <h3>Publish Creator Video</h3>
                            <p className="subtitle">Upload high quality MP4/WebM videos to your channel catalog.</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                {/* Upload Mode Selector */}
                <div className="upload-tabs">
                    <button
                        type="button"
                        className={`tab-btn ${uploadMode === 'file' ? 'active' : ''}`}
                        onClick={() => setUploadMode('file')}
                    >
                        <FileVideo size={16} /> Select Video File
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${uploadMode === 'url' ? 'active' : ''}`}
                        onClick={() => setUploadMode('url')}
                    >
                        <LinkIcon size={16} /> Direct MP4 / Web URL
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="upload-form">
                    {/* Video Dropzone area */}
                    {uploadMode === 'file' ? (
                        <div
                            className={`dropzone-container ${isDragging ? 'dragging' : ''} ${videoFile ? 'has-file' : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => !videoFile && videoInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={videoInputRef}
                                accept="video/*"
                                className="hidden-file-input"
                                onChange={(e) => handleVideoFileSelect(e.target.files[0])}
                            />

                            {videoFile ? (
                                <div className="file-preview-card">
                                    <FileVideo size={36} className="text-cyan" />
                                    <div className="file-info">
                                        <span className="file-name">{videoFile.name}</span>
                                        <span className="file-size">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to publish</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="remove-file-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVideoFile(null);
                                            setVideoUrl('');
                                        }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="dropzone-content">
                                    <UploadCloud size={44} className="dropzone-icon text-cyan" />
                                    <h4>Drag and drop your video file here</h4>
                                    <p>Supports MP4, WebM, MOV, MKV up to 4K resolution</p>
                                    <button type="button" className="btn btn-cyan btn-sm select-file-btn">
                                        Select File from Device
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="input-group">
                            <label>Video Stream / File URL</label>
                            <input
                                type="url"
                                className="input-field"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                                required
                            />
                        </div>
                    )}

                    {/* Video Metadata Form */}
                    <div className="input-group">
                        <label>Video Title *</label>
                        <input
                            type="text"
                            className="input-field"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Next.js 16 Realtime Masterclass & AI Workflows"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Description</label>
                        <textarea
                            className="input-field"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide a detailed description, timestamps, and social links..."
                            rows={3}
                        />
                    </div>

                    <div className="grid-2-col">
                        <div className="input-group">
                            <label>Category</label>
                            <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                                {CATEGORIES.filter(c => c !== 'All').map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label><Crown size={14} className="text-amber-400" /> Subscription Gating Tier</label>
                            <select className="input-field" value={tier} onChange={(e) => setTier(e.target.value)}>
                                <option value="Free">Free (All Viewers)</option>
                                <option value="Bronze">Bronze Tier Exclusive</option>
                                <option value="Silver">Silver Tier Exclusive</option>
                                <option value="Gold">Gold VIP Exclusive</option>
                            </select>
                        </div>
                    </div>

                    {/* Custom Thumbnail Upload */}
                    <div className="input-group">
                        <label>Thumbnail Image (Optional)</label>
                        <div className="thumb-picker-row">
                            <input
                                type="file"
                                ref={thumbInputRef}
                                accept="image/*"
                                className="hidden-file-input"
                                onChange={(e) => handleThumbnailFileSelect(e.target.files[0])}
                            />
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => thumbInputRef.current?.click()}
                            >
                                <ImageIcon size={14} /> Upload Custom Thumbnail
                            </button>
                            {thumbnailFile && <span className="thumb-file-badge"><Check size={12} /> {thumbnailFile.name}</span>}
                        </div>
                    </div>

                    <div className="upload-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-cyan">
                            <Sparkles size={16} /> Publish Video Now
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
        .upload-modal-box {
          max-width: 580px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .upload-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 14px;
          margin-bottom: 16px;
        }
        .title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .title-group h3 {
          font-size: 1.2rem;
          font-weight: 800;
        }
        .subtitle {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .upload-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          background: rgba(15, 23, 42, 0.6);
          padding: 4px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-glass);
        }
        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: var(--radius-sm);
        }
        .tab-btn.active {
          background: rgba(6, 182, 212, 0.2);
          color: var(--cyan);
          border: 1px solid var(--cyan);
        }
        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .dropzone-container {
          border: 2px dashed var(--border-glass);
          border-radius: var(--radius-lg);
          padding: 24px 16px;
          text-align: center;
          background: rgba(30, 41, 59, 0.4);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .dropzone-container:hover, .dropzone-container.dragging {
          border-color: var(--cyan);
          background: rgba(6, 182, 212, 0.08);
        }
        .dropzone-container.has-file {
          border-style: solid;
          border-color: var(--cyan);
          padding: 14px;
        }
        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .dropzone-content h4 {
          font-size: 0.95rem;
          font-weight: 700;
          margin-top: 4px;
        }
        .dropzone-content p {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-bottom: 6px;
        }
        .hidden-file-input {
          display: none;
        }
        .file-preview-card {
          display: flex;
          align-items: center;
          gap: 14px;
          text-align: left;
        }
        .file-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .file-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-main);
          word-break: break-all;
        }
        .file-size {
          font-size: 0.75rem;
          color: var(--emerald);
        }
        .remove-file-btn {
          background: rgba(244, 63, 94, 0.2);
          border: 1px solid var(--rose);
          color: var(--rose);
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .thumb-picker-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .thumb-file-badge {
          font-size: 0.75rem;
          color: var(--emerald);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .upload-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
          padding-top: 12px;
          border-top: 1px solid var(--border-glass);
        }
      `}</style>
        </div>
    );
}
