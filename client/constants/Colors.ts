export const Colors = {
    // Unique Signature Telejog Palette: Cyber-Amethyst & Electric Mint Aurora
    primary: "#00F5D4",               // Radiant Hyper-Mint / Aurora Cyan
    primaryHover: "#05E2C4",
    primaryViolet: "#8B5CF6",         // Luminescent Cyber Iris
    primaryPurple: "#7C3AED",
    primaryGradientStart: "#8B5CF6",   // Cyber Iris
    primaryGradientEnd: "#00F5D4",     // Hyper-Mint Cyan
    primaryDark: "#6D28D9",
    telegramBlue: "#8B5CF6",          // Replaced generic blue with Signature Iris
    electricBlue: "#00F5D4",
    neonCyan: "#00F0FF",
    neonMint: "#00F5D4",
    neonGreen: "#00F5A0",
    premiumGold: "#FFD166",
    goldGradientStart: "#FFE259",
    goldGradientEnd: "#FFA751",

    // Backgrounds - Deep Quantum Obsidian & Velvet Void
    background: "#08090E",
    backgroundSecondary: "#0D0F18",
    backgroundLight: "#F5F3FA",
    
    // Glass & Surfaces
    surface: "#121422",
    surfaceCard: "#16192B",
    surfaceElevated: "#1C2036",
    surfaceGlass: "rgba(22, 25, 43, 0.88)",
    surfaceGlassBorder: "rgba(139, 92, 246, 0.22)",
    surfaceLight: "#FFFFFF",
    
    // Message Bubbles - Jewel Iris & Midnight Titanium
    sentBubble: "#5B21B6",             // Majestic Royal Iris
    sentBubbleGradient: "#7C3AED",     // Vibrant Iris Flare
    sentBubbleBorder: "rgba(0, 245, 212, 0.3)",
    receivedBubble: "#16192B",         // Deep Midnight Titanium
    receivedBubbleBorder: "rgba(139, 92, 246, 0.16)",
    sentBubbleLight: "#EDE9FE",
    receivedBubbleLight: "#FFFFFF",
    
    // Text Hierarchy - Ultra High Contrast & Readability
    textPrimary: "#FFFFFF",
    textSecondary: "#CBD5E1",          // High contrast bright slate
    textMuted: "#94A3B8",              // Clearly visible muted text
    textPrimaryLight: "#0F172A",
    textSecondaryLight: "#64748B",
    
    // Status, Badges & Accents
    online: "#00F5D4",                 // Hyper-Mint online dot
    onlineGlow: "rgba(0, 245, 212, 0.4)",
    unreadBadge: "#00F5D4",            // Hyper-Mint badge with dark text for maximum pop
    unreadBadgeText: "#08090E",
    checkIcon: "#00F5D4",
    error: "#FF4757",
    warning: "#FFA502",
    divider: "rgba(139, 92, 246, 0.12)",
    dividerLight: "#E2E8F0",

    // Tab Bar Styling
    tabActive: "#00F5D4",
    tabInactive: "#94A3B8",
    tabBarBg: "#0D0F1A",
    tabBarBorder: "rgba(139, 92, 246, 0.28)",

    // Backward compatibility aliases
    onSurface: "#FFFFFF",
    onSurfaceVariant: "#CBD5E1",
    surfaceLowest: "#08090E",
    surfaceLow: "#0D0F18",
    surfaceHigh: "#16192B",
    surfaceHighest: "#1C2036",
    surfaceDim: "#08090E",
    outline: "#94A3B8",
    outlineVariant: "#252B44",
    onPrimary: "#08090E",              // Dark contrast on neon primary
    primaryDim: "#6D28D9",
    primaryContainer: "#8B5CF6",
    onPrimaryContainer: "#FFFFFF",
    tertiary: "#00F0FF",
};

export const TelegramTheme = {
  dark: {
    bg: "#08090E",
    header: "#121422",
    card: "#16192B",
    cardElevated: "#1C2036",
    text: "#FFFFFF",
    subtext: "#CBD5E1",
    muted: "#94A3B8",
    inputBg: "#1C2036",
    sentMsg: "#5B21B6",
    receivedMsg: "#16192B",
    border: "rgba(139, 92, 246, 0.22)",
    accent: "#00F5D4",
    accentAlt: "#8B5CF6",
    online: "#00F5D4",
  },
  light: {
    bg: "#F5F3FA",
    header: "#7C3AED",
    card: "#FFFFFF",
    cardElevated: "#F8FAFC",
    text: "#0F172A",
    subtext: "#64748B",
    muted: "#94A3B8",
    inputBg: "#EDE9FE",
    sentMsg: "#DDD6FE",
    receivedMsg: "#FFFFFF",
    border: "#E2E8F0",
    accent: "#7C3AED",
    accentAlt: "#05E2C4",
    online: "#10B981",
  }
};
