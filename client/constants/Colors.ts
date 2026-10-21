// Telejog Signature Brand Theme: Electric Dragonfruit & Hyper-Cyan Mint Aurora
// 100% Unique, Modern, High-Contrast - Unlike any existing chat application!

export const Colors = {
    // Primary Signature Duo
    primary: "#FF2A85",                 // Radiant Neon Dragonfruit / Electric Rose
    primaryHover: "#FF4597",
    primaryGradientStart: "#FF2A85",   // Electric Dragonfruit
    primaryGradientEnd: "#00F5D4",     // Hyper-Cyan Mint Aurora
    primaryViolet: "#FF2A85",          // Used across app for primary accent
    primaryPurple: "#9333EA",
    primaryDark: "#C01460",
    
    // Complementary Neon Accents
    neonMint: "#00F5D4",               // Hyper-Cyan Mint (online, checks, highlights)
    electricBlue: "#00E5FF",           // Electric Cyan
    neonCyan: "#00F5D4",
    neonGreen: "#00F5A0",
    solarAmber: "#FFB703",             // Solar Amber (pinned, premium, stars)
    premiumGold: "#FFB703",
    goldGradientStart: "#FFD166",
    goldGradientEnd: "#FF8C00",

    // Backgrounds - Deep Obsidian Void
    background: "#07080D",             // Deep Space Quantum Void
    backgroundSecondary: "#0C0E14",     // Midnight Velvet
    backgroundLight: "#F8F7FC",
    
    // Surfaces & Card Containers
    surface: "#11131C",               // Obsidian Slate
    surfaceCard: "#151824",           // Midnight Card
    surfaceElevated: "#1B1F30",       // Elevated Plate
    surfaceGlass: "rgba(21, 24, 36, 0.92)",
    surfaceGlassBorder: "rgba(255, 42, 133, 0.22)",
    surfaceLight: "#FFFFFF",
    
    // Message Bubbles - Velvet Dragonfruit & Midnight Obsidian
    sentBubble: "#8B124B",             // Rich Glowing Velvet Dragonfruit
    sentBubbleGradient: "#B8175E",     // Luminous Flare
    sentBubbleBorder: "rgba(255, 42, 133, 0.45)",
    receivedBubble: "#151824",         // Midnight Obsidian
    receivedBubbleBorder: "rgba(0, 245, 212, 0.18)",
    sentBubbleLight: "#FFE4EF",
    receivedBubbleLight: "#FFFFFF",
    
    // Typography Hierarchy
    textPrimary: "#FFFFFF",
    textSecondary: "#CBD5E1",          // High contrast bright slate
    textMuted: "#94A3B8",              // Clearly legible muted grey
    textPrimaryLight: "#0F172A",
    textSecondaryLight: "#64748B",
    
    // Status, Badges & Accents
    online: "#00F5D4",                 // Hyper-Mint glow
    onlineGlow: "rgba(0, 245, 212, 0.45)",
    unreadBadge: "#FF2A85",            // Neon Dragonfruit
    unreadBadgeText: "#FFFFFF",
    checkIcon: "#00F5D4",              // Hyper-Mint double ticks
    error: "#FF4757",
    warning: "#FFB703",
    divider: "rgba(255, 42, 133, 0.12)",
    dividerLight: "#E2E8F0",

    // Bottom Tab Bar
    tabActive: "#FF2A85",
    tabInactive: "#94A3B8",
    tabBarBg: "#0C0E14",
    tabBarBorder: "rgba(255, 42, 133, 0.28)",

    // Compatibility Aliases for components
    telegramBlue: "#FF2A85",           // Replaced legacy alias with Telejog brand
    onSurface: "#FFFFFF",
    onSurfaceVariant: "#CBD5E1",
    surfaceLowest: "#07080D",
    surfaceLow: "#0C0E14",
    surfaceHigh: "#151824",
    surfaceHighest: "#1B1F30",
    surfaceDim: "#07080D",
    outline: "#94A3B8",
    outlineVariant: "#262A3B",
    onPrimary: "#FFFFFF",
    primaryDim: "#C01460",
    primaryContainer: "#FF2A85",
    onPrimaryContainer: "#FFFFFF",
    tertiary: "#00F5D4",
};

export const TelejogTheme = {
  dark: {
    bg: "#07080D",
    header: "#11131C",
    card: "#151824",
    cardElevated: "#1B1F30",
    text: "#FFFFFF",
    subtext: "#CBD5E1",
    muted: "#94A3B8",
    inputBg: "#1B1F30",
    sentMsg: "#8B124B",
    receivedMsg: "#151824",
    border: "rgba(255, 42, 133, 0.22)",
    accent: "#FF2A85",
    accentAlt: "#00F5D4",
    online: "#00F5D4",
  },
  light: {
    bg: "#F8F7FC",
    header: "#FF2A85",
    card: "#FFFFFF",
    cardElevated: "#F8FAFC",
    text: "#0F172A",
    subtext: "#64748B",
    muted: "#94A3B8",
    inputBg: "#FFE4EF",
    sentMsg: "#FFD0E3",
    receivedMsg: "#FFFFFF",
    border: "#E2E8F0",
    accent: "#FF2A85",
    accentAlt: "#00BFA5",
    online: "#00BFA5",
  }
};

// Legacy compatibility export
export const TelegramTheme = TelejogTheme;
