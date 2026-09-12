// List of abusive/toxic terms (multilingual & common slurs/profanity)
const ABUSIVE_PATTERNS = [
    'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'crap', 'bullshit', 'idiot',
    'stupid', 'dumb', 'loser', 'retard', 'scam', 'scammer', 'hate', 'kill',
    'dick', 'pussy', 'slut', 'whore', 'nigger', 'faggot', 'chink', 'spic',
    'mierda', 'pendejo', 'puta', 'cabron', 'estupido', 'coño',
    'merde', 'connard', 'salope', 'batard',
    'scheisse', 'arschloch',
    'kutta', 'kamina', 'harami', 'saala', 'chutia', 'bakwas',
    'baka', 'kuso', 'yarou', 'yaro'
];

const LEET_REPLACEMENTS = {
    '@': 'a',
    '!': 'i',
    '1': 'i',
    '$': 's',
    '5': 's',
    '0': 'o',
    '3': 'e',
    '*': '',
};

const SPAM_PATTERNS = [
    /https?:\/\/[^\s]+/i,
    /www\.[^\s]+/i,
    /bit\.ly\/[^\s]+/i,
    /t\.me\/[^\s]+/i,
    /whatsapp\.com\/[^\s]+/i,
    /\b(sub4sub|sub\s+for\s+sub|subscribe\s+to\s+my\s+channel)\b/i,
    /\b(free\s+crypto|make\s+money\s+fast|earn\s+\$\d+|whatsapp\s+me|telegram\s+me)\b/i,
    /\b(buy\s+followers|cheap\s+views|click\s+here\s+to\s+win|claim\s+your\s+prize)\b/i,
    /\b(whatsapp\s*:\s*\+?\d{8,})\b/i
];

function normalizeText(text) {
    let normalized = text.toLowerCase();
    for (const [leet, real] of Object.entries(LEET_REPLACEMENTS)) {
        normalized = normalized.replaceAll(leet, real);
    }
    return normalized;
}

/**
 * Perform comprehensive moderation check on input comment
 */
export function checkCommentSafety(content) {
    const trimmed = content.trim();

    if (!trimmed) {
        return {
            isValid: true,
            score: 100,
            issues: {
                hasAbusiveWords: false,
                abusiveMatches: [],
                hasSpam: false,
                hasExcessiveSymbols: false,
            },
        };
    }

    const normalized = normalizeText(trimmed);
    const abusiveMatches = [];

    // 1. Check Abusive Words
    for (const pattern of ABUSIVE_PATTERNS) {
        const regex = new RegExp(`\\b${pattern}\\b`, 'i');
        if (regex.test(normalized) || (pattern.length > 3 && normalized.includes(pattern))) {
            abusiveMatches.push(pattern);
        }
    }

    const hasAbusiveWords = abusiveMatches.length > 0;

    // 2. Check Spam
    let hasSpam = false;
    let spamReason = '';

    for (const pattern of SPAM_PATTERNS) {
        if (pattern.test(trimmed)) {
            hasSpam = true;
            spamReason = 'Contains prohibited link or promotional spam keywords.';
            break;
        }
    }

    if (!hasSpam && trimmed.length >= 12) {
        const letters = trimmed.replace(/[^a-zA-Z]/g, '');
        if (letters.length > 8) {
            const upperCount = trimmed.replace(/[^A-Z]/g, '').length;
            if (upperCount / letters.length > 0.8) {
                hasSpam = true;
                spamReason = 'Excessive ALL CAPS text detected (resembles shout-spam).';
            }
        }
    }

    // 3. Check Repeated Special Characters
    let hasExcessiveSymbols = false;
    let symbolReason = '';

    const consecutiveSpecialRegex = /([^\w\s\u0600-\u06FF\u0900-\u097F\u3040-\u30FF\u4E00-\u9FFF])\1{3,}/u;
    if (consecutiveSpecialRegex.test(trimmed)) {
        hasExcessiveSymbols = true;
        symbolReason = 'Contains repeated identical special characters (e.g. "!!!!", "????", "%%%%").';
    }

    if (!hasExcessiveSymbols && trimmed.length >= 5) {
        const symbolCount = (trimmed.match(/[^\w\s\u0600-\u06FF\u0900-\u097F\u3040-\u30FF\u4E00-\u9FFF.,'!?\-\u00C0-\u024F]/g) || []).length;
        const ratio = symbolCount / trimmed.length;

        if (ratio > 0.4) {
            hasExcessiveSymbols = true;
            symbolReason = `High density of special symbols (${Math.round(ratio * 100)}% of content).`;
        }
    }

    if (!hasExcessiveSymbols && trimmed.length >= 8) {
        const nonAlpha = trimmed.replace(/[\w\s]/g, '');
        if (nonAlpha.length >= 6 && /^([^\w\s]{2,4})\1+$/.test(nonAlpha)) {
            hasExcessiveSymbols = true;
            symbolReason = 'Repetitive non-alphanumeric character sequences detected.';
        }
    }

    let score = 100;
    if (hasAbusiveWords) score -= 60;
    if (hasSpam) score -= 50;
    if (hasExcessiveSymbols) score -= 40;
    score = Math.max(0, score);

    const isValid = !hasAbusiveWords && !hasSpam && !hasExcessiveSymbols;

    let blockedReasonText;
    if (!isValid) {
        const reasons = [];
        if (hasAbusiveWords) reasons.push(`prohibited abusive/offensive words ("${abusiveMatches.join(', ')}")`);
        if (hasSpam) reasons.push(spamReason || 'spam pattern');
        if (hasExcessiveSymbols) reasons.push(symbolReason || 'excessive repeated special characters');
        blockedReasonText = `Comment Blocked: Your post contains ${reasons.join(' and ')}. Please edit before submitting.`;
    }

    return {
        isValid,
        score,
        issues: {
            hasAbusiveWords,
            abusiveMatches,
            hasSpam,
            spamReason,
            hasExcessiveSymbols,
            symbolReason,
        },
        blockedReasonText,
    };
}
