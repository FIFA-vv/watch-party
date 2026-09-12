const TRANSLATION_MAP = {
    "The explanation of neural networks in this video is so clear! Thanks for breaking down complex math into intuitive visuals.": {
        en: "The explanation of neural networks in this video is so clear! Thanks for breaking down complex math into intuitive visuals.",
        es: "¡La explicación de las redes neuronales en este video es muy clara! Gracias por desglosar las matemáticas complejas en imágenes intuitivas.",
        fr: "L'explication des réseaux de neurones dans cette vidéo est tellement claire ! Merci de décomposer des mathématiques complexes en visuels intuitifs.",
        hi: "इस वीडियो में न्यूरल नेटवर्क की व्याख्या बहुत स्पष्ट है! जटिल गणित को सहज दृश्यों में तोड़ने के लिए धन्यवाद।",
        ja: "このビデオでのニューラルネットワークの説明は非常に明確です！複雑な数学を直感的なビジュアルに分解してくれてありがとう。",
        de: "Die Erklärung neuronaler Netze in diesem Video ist so klar! Danke, dass Sie komplexe Mathematik in intuitive Bilder zerlegt haben.",
        ar: "شرح شبكات العصبية في هذا الفيديو واضح جداً! شكراً لتبسيط الرياضيات المعقدة إلى مرئيات بديهية.",
        zh: "这视频里的神经网络解释太清晰了！感谢你把复杂的数学拆解成直观的图表。",
        pt: "A explicação das redes neurais neste vídeo é tão clara! Obrigado por dividir matemática complexa em visuais intuitivos.",
        it: "La spiegazione delle reti neurali in questo video è chiarissima! Grazie per aver scomposto la matematica complessa in immagini intuitive."
    },
    "¡Increíble contenido! Me ayudó muchísimo a entender la implementación de la traducción multilingual en tiempo real.": {
        en: "Amazing content! It helped me a lot to understand the implementation of real-time multilingual translation.",
        es: "¡Increíble contenido! Me ayudó muchísimo a entender la implementación de la traducción multilingual en tiempo real.",
        fr: "Contenu incroyable ! Cela m'a beaucoup aidé à comprendre la mise en œuvre de la traduction multilingue en temps réel.",
        hi: "अद्भुत सामग्री! इसने मुझे वास्तविक समय के बहुभाषी अनुवाद के कार्यान्वयन को समझने में बहुत मदद की।",
        ja: "素晴らしいコンテンツ！リアルタイムの多言語翻訳の実装を理解するのにとても役立ちました。",
        de: "Unglaublicher Inhalt! Es hat mir sehr geholfen, die Implementierung der mehrsprachigen Übersetzung in Echtzeit zu verstehen.",
        ar: "محتوى مذهل! لقد ساعدني كثيراً في فهم تطبيق الترجمة متعددة اللغات في الوقت الفعلي.",
        zh: "惊人的内容！它对我理解实时多语言翻译的实现帮助很大。",
        pt: "Conteúdo incrível! Me ajudou muito a entender a implementação da tradução multilíngue em tempo real.",
        it: "Contenuto incredibile! Mi ha aiutato moltissimo a capire l'implementazione della traduzione multilingue in tempo reale."
    },
    "यह ट्यूटोरियल बहुत उपयोगी है! मुझे अनुवाद और स्थान गोपनीयता की सुविधा बहुत पसंद आई।": {
        en: "This tutorial is very useful! I really liked the translation and location privacy features.",
        es: "¡Este tutorial es muy útil! Me gustaron mucho las funciones de traducción y privacidad de ubicación.",
        fr: "Ce tutoriel est très utile ! J'ai vraiment aimé les fonctionnalités de traduction et de confidentialité de la localisation.",
        hi: "यह ट्यूटोरियल बहुत उपयोगी है! मुझे अनुवाद और स्थान गोपनीयता की सुविधा बहुत पसंद आई।",
        ja: "このチュートリアルはとても役立ちます！翻訳と位置情報のプライバシー機能がとても気に入りました。",
        de: "Dieses Tutorial ist sehr nützlich! Die Funktionen für Übersetzung und Standortdatenschutz haben mir sehr gut gefallen.",
        ar: "هذا برنامج تعليمي مفيد للغاية! لقد أعجبتني حقًا ميزات الترجمة وخصوصية الموقع.",
        zh: "这个教程非常有用！我非常喜欢翻译和位置隐私功能。",
        pt: "Este tutorial é muito útil! Gostei muito dos recursos de tradução e privacidade de localização.",
        it: "Questo tutorial é utilissimo! Mi sono piaciute molto le funzionalità di traduzione e privacy della posizione."
    },
    "Une excellente vidéo sur la modération communautaire et la protection de la vie privée ! Bravo à l'équipe.": {
        en: "An excellent video on community moderation and privacy protection! Kudos to the team.",
        es: "¡Un excelente video sobre moderación comunitaria y protección de la privacidad! Felicitaciones al equipo.",
        fr: "Une excellente vidéo sur la modération communautaire et la protection de la vie privée ! Bravo à l'équipe.",
        hi: "सामुदायिक मॉडरेशन और गोपनीयता संरक्षण पर एक उत्कृष्ट वीडियो! टीम को बधाई।",
        ja: "コミュニティモデレーションとプライバシー保護に関する素晴らしいビデオです！チームに拍手。",
        de: "Ein hervorragendes Video über Community-Moderation und Datenschutz! Ein Lob an das Team.",
        ar: "فيديو ممتاز حول الإشراف المجتمعي وحماية الخصوصية! أحسنت للفريق.",
        zh: "关于社区审查和隐私保护的绝佳视频！为团队点赞。",
        pt: "Um excelente vídeo sobre moderação comunitária e proteção de privacidade! Parabéns à equipe.",
        it: "Un eccellente video sulla moderazione della community e la protezione della privacy! Complimenti al team."
    },
    "Appreciate it! More deep dives coming soon 🚀": {
        en: "Appreciate it! More deep dives coming soon 🚀",
        es: "¡Agradecido! Muy pronto más análisis profundos 🚀",
        fr: "Merci ! D'autres analyses approfondies arrivent bientôt 🚀",
        hi: "सराहना के लिए धन्यवाद! जल्द ही और भी गहरा अध्ययन आ रहा है 🚀",
        ja: "ありがとうございます！さらなる深掘り動画も近日公開予定です 🚀",
        de: "Vielen Dank! Weitere tiefe Einblicke folgen Kürze 🚀",
        ar: "شكرا لك! المزيد من التحليلات العميقة قادمة قريباً 🚀",
        zh: "感谢支持！更多深度解析即将来袭 🚀",
        pt: "Muito obrigado! Em breve teremos mais análises aprofundadas 🚀",
        it: "Grazie! In arrivo presto altri approfondimenti 🚀"
    }
};

export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

/**
 * Translate originalText into toLang
 * @param {string} originalText
 * @param {string} toLang
 * @param {string} [fromLang]
 */
export function translateText(originalText, toLang, fromLang = 'en') {
    if (!originalText) return { translatedText: '', isMockAi: false };

    // Check static exact match map first
    if (TRANSLATION_MAP[originalText] && TRANSLATION_MAP[originalText][toLang]) {
        return {
            translatedText: TRANSLATION_MAP[originalText][toLang],
            isMockAi: true,
        };
    }

    // Dynamic fallback translation with language prefixes & term replacements
    const langPrefixes = {
        en: "[Translated to English]: ",
        es: "[Traducido al español]: ",
        fr: "[Traduit en français]: ",
        hi: "[हिन्दी में अनूदित]: ",
        ja: "[日本語訳]: ",
        de: "[Ins Deutsche übersetzt]: ",
        ar: "[مترجم إلى العربية]: ",
        zh: "[翻译成中文]: ",
        pt: "[Traduzido para o português]: ",
        it: "[Tradotto in italiano]: "
    };

    const prefix = langPrefixes[toLang] || `[Translated to ${toLang.toUpperCase()}]: `;
    let text = originalText;

    if (toLang === 'en') {
        text = text
            .replace(/hola|bonjour|namaste|konnichiwa|guten tag|marhaban/gi, "Hello")
            .replace(/gracias|merci|dhanyavaad|arigatou|danke|shukran/gi, "Thank you")
            .replace(/excelente|superbe|uttamb|subarashii|ausgezeichnet|mumtaz/gi, "Excellent");
    } else if (toLang === 'es') {
        text = text
            .replace(/hello|hi|bonjour|namaste/gi, "Hola")
            .replace(/thank you|thanks|merci|danke/gi, "Gracias")
            .replace(/great|awesome|good|clear/gi, "Excelente");
    } else if (toLang === 'hi') {
        text = text
            .replace(/hello|hi|hola|bonjour/gi, "नमस्ते")
            .replace(/thank you|thanks|gracias/gi, "धन्यवाद")
            .replace(/great|awesome|super|clear/gi, "शानदार");
    } else if (toLang === 'fr') {
        text = text
            .replace(/hello|hi|hola/gi, "Bonjour")
            .replace(/thank you|thanks|gracias/gi, "Merci")
            .replace(/great|awesome|good/gi, "Superbe");
    } else if (toLang === 'ja') {
        text = text
            .replace(/hello|hi|hola/gi, "こんにちは")
            .replace(/thank you|thanks/gi, "ありがとう")
            .replace(/great|awesome/gi, "素晴らしい");
    }

    return {
        translatedText: `${prefix}${text}`,
        isMockAi: true,
    };
}

export function getLanguageName(code) {
    const found = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    return found ? found.name : code.toUpperCase();
}
