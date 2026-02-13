# VisioNiX Redesign - Visual Guide

## Color Palette

### Black & White Theme
```
███████████ 100% Black (#000000) - Primary text, buttons
░░░░░░░░░░ 100% White (#ffffff) - Backgrounds, contrast
▒▒▒▒▒▒▒▒▒▒ Gray shades - Borders, hover states
```

**No gradients. No colors. Just pure black, white, and gray.**

---

## Page 1: Login Page

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║                                                                ║
║                     ┌──────────────────┐                       ║
║                     │ █████████████    │                       ║
║                     │ █ Black Box █    │  Logo                 ║
║                     │ █████████████    │                       ║
║                     └──────────────────┘                       ║
║                                                                ║
║                        VisioNiX                                ║
║              Vision & Image Analysis Platform                  ║
║                                                                ║
║                  ┌─────────────────────┐                       ║
║                  │ Email Address       │                       ║
║                  └─────────────────────┘                       ║
║                                                                ║
║                  ┌─────────────────────┐                       ║
║                  │ Password            │                       ║
║                  └─────────────────────┘                       ║
║                                                                ║
║                  ┌─────────────────────┐                       ║
║                  │ █████████████████   │  Black Button         ║
║                  │ Sign In             │                       ║
║                  │ █████████████████   │                       ║
║                  └─────────────────────┘                       ║
║                                                                ║
║           Don't have an account? Sign Up                       ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

WHITE BACKGROUND
```

### Colors Used:
- Background: White (#ffffff)
- Text: Black (#000000)
- Borders: Light Gray (#e5e7eb)
- Button: Black (#000000)
- Button Hover: Dark Gray (#1a1a1a)

---

## Page 2: Chat Interface (Main Page)

```
╔══════════════╦═══════════════════════════════════════════════════════════╗
║              ║                                                           ║
║   New Chat   ║         Model Dropdown | View Extractions | ...          ║
║              ║                                                           ║
╠══════════════╬═══════════════════════════════════════════════════════════╣
║              ║                                                           ║
║  Search      ║  How can I help you?                                      ║
║  ──────────  ║  (Empty state when no messages)                           ║
║              ║                                                           ║
║  Recent      ║                                                           ║
║  ──────────  ║                                                           ║
║  Chat 1 ✕    ║  ┌────────────────────────────────────┐                  ║
║  Chat 2 ✕    ║  │ User: What can you do?             │ Black bg         ║
║  Chat 3 ✕    ║  │ White text, right-aligned         │ White text       ║
║  Chat 4 ✕    ║  └────────────────────────────────────┘                  ║
║              ║                                                           ║
║              ║  ┌────────────────────────────────────┐                  ║
║              ║  │ I can analyze images with AI...    │ Gray bg          ║
║              ║  │ Black text, left-aligned           │ Black text       ║
║              ║  └────────────────────────────────────┘                  ║
║              ║                                                           ║
║              ║  ┌────────────────────────────────────┐                  ║
║              ║  │ User: Analyze this photo           │ Black bg         ║
║              ║  └────────────────────────────────────┘                  ║
║              ║                                                           ║
║              ║  ┌────────────────────────────────────┐                  ║
║              ║  │ Processing...                      │ Gray bg          ║
║              ║  └────────────────────────────────────┘                  ║
║              ║                                                           ║
║              ║  ┌──────────────────────────────────────────────┐        ║
║              ║  │ [Input: "Ask anything"]             [→ Send] │        ║
║              ║  └──────────────────────────────────────────────┘        ║
║              ║                                                           ║
║              ║ (White background for entire chat area)                  ║
║              ║                                                           ║
╚══════════════╩═══════════════════════════════════════════════════════════╝

LEFT: White sidebar (w-64)  | RIGHT: White chat area
HEADER: White with gray border
```

### Layout Breakdown:

#### Left Sidebar (256px wide)
```
┌─────────────────────────────────┐
│ ┌──────────────────────────────┐ │
│ │ [+] New chat                 │ │ Button: Border, hover gray
│ └──────────────────────────────┘ │
│                                 │
│ ┌──────────────────────────────┐ │
│ │ 🔍 Search chats...           │ │ Input: Gray border
│ └──────────────────────────────┘ │
│                                 │
│ RECENT                          │ Label: Gray text
│ ─────────────────────────────── │
│                                 │
│ 💬 Chat 1              ✕        │ Message icon + title + delete hover
│ 💬 Chat 2              ✕        │
│ 💬 Chat 3              ✕        │
│                                 │
│ VisioNiX v1.0                   │ Footer: Gray text
└─────────────────────────────────┘

All white background
All black text
Gray borders and accents
```

#### Header (Top)
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│    ┌────────────────────────┐  🖼  ...                  │
│    │ Normal ▼               │  Icon Icon               │
│    │ [Model dropdown]       │                          │
│    └────────────────────────┘                          │
│                                                          │
└──────────────────────────────────────────────────────────┘

White background, gray border bottom
Model button: Border style, hover gray
```

#### Chat Area (Main)
```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                How can I help you?                      │
│                                                          │
│  ┌──────────────────────────────────────────┐           │
│  │ U │ User message text right-aligned      │ Black bg  │
│  │   │ White text, right-floated           │ White txt │
│  └──────────────────────────────────────────┘           │
│                                                          │
│  ┌──────────────────────────────────────────┐           │
│  │ A │ Bot response text left-aligned       │ Gray bg   │
│  │   │ Black text, left-floated             │ Black txt │
│  └──────────────────────────────────────────┘           │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Ask anything                              [→ Send]  │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘

White background
Gray border (top and bottom)
```

### Colors Used:
- Background: White (#ffffff)
- Text: Black (#000000)
- Borders: Light Gray (#e5e7eb, #d1d5db)
- Hover: Light Gray (#f7f7f7)
- User Message: Black bg (#000000), White text (#ffffff)
- Bot Message: Light Gray bg (#e5e7eb), Black text (#000000)
- Button: Black (#000000)
- Button Hover: Dark Gray (#1a1a1a)

---

## Page 3: Extractions Page

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║  ← Back to Chat | Extraction Results                           ║
║                                                                ║
║  ┌──────────────────┐   ┌───────────────────────────────────┐ ║
║  │ Analyzed Images  │   │  Image Analysis Results            │ ║
║  │ 3 extractions    │   │                                   │ ║
║  │                  │   │ Image Name: photo.jpg             │ ║
║  │ ┌──────────────┐ │   │                                   │ ║
║  │ │ image1.jpg   │ │   │ Caption:                          │ ║
║  │ │ 2 hours ago  │ │   │ "A scenic mountain landscape      │ ║
║  │ └──────────────┘ │   │  with blue sky and green trees"   │ ║
║  │                  │   │                                   │ ║
║  │ ┌──────────────┐ │   │ Objects Detected:                 │ ║
║  │ │ image2.jpg   │ │   │ [mountain] [sky] [tree]           │ ║
║  │ │ 1 hour ago   │ │   │ [cloud] [grass]                   │ ║
║  │ └──────────────┘ │   │                                   │ ║
║  │                  │   │ OCR Text:                         │ ║
║  │ ┌──────────────┐ │   │ "Welcome to Nature 2024"          │ ║
║  │ │ image3.jpg   │ │   │                                   │ ║
║  │ │ 30 min ago   │ │   │ Scene Labels:                     │ ║
║  │ └──────────────┘ │   │ [landscape] [outdoor] [natural]   │ ║
║  │                  │   │                                   │ ║
║  └──────────────────┘   │ Color Features (RGB):             │ ║
║                         │ [■ #4a9e6f] Green dominant        │ ║
║                         │                                   │ ║
║                         │ Texture Features:                 │ ║
║                         │ [████████░░] Smooth (80%)         │ ║
║                         │                                   │ ║
║                         │ CLIP Embedding:                   │ ║
║                         │ embedding_1.npy (2.4 MB)          │ ║
║                         │ /path/to/embeddings/...           │ ║
║                         │                                   │ ║
║  ┌──────────────────┐   │ [Copy JSON] [Download] [Delete]   │ ║
║  │ No Extractions   │   └───────────────────────────────────┘ ║
║  │ Yet              │                                         ║
║  │                  │                                         ║
║  │ [Go to Chat]     │                                         ║
║  └──────────────────┘                                         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

Grid Layout: 3 columns (1 for list, 2 for details)
```

### Colors Used:
- Background: White (#ffffff)
- Text: Black (#000000)
- Borders: Light Gray (#d1d5db)
- Empty State: Light Gray bg (#f7f7f7)
- Badges: Gray backgrounds
- Button: Black (#000000)
- Button Hover: Dark Gray (#1a1a1a)

---

## Component Style Guide

### Buttons

#### Black Button (Primary Action)
```
┌─────────────────────┐
│ █████████████████   │
│ Sign In / Send      │
│ █████████████████   │
└─────────────────────┘
Background: #000000 (black)
Text: #ffffff (white)
Hover: #1a1a1a (dark gray)
```

#### Border Button (Secondary)
```
┌─────────────────────┐
│ New Chat            │
└─────────────────────┘
Background: #ffffff (white)
Border: #d1d5db (gray)
Text: #000000 (black)
Hover: #f7f7f7 (light gray bg)
```

### Input Fields
```
┌─────────────────────┐
│ Email input...      │
└─────────────────────┘
Background: #ffffff (white)
Border: #e5e7eb (light gray)
Text: #000000 (black)
Focus Ring: #000000 (black)
Placeholder: #9ca3af (medium gray)
```

### Message Bubbles

#### User Message (Black)
```
┌──────────────────────────┐
│ This is user's message   │
│ Black background         │
│ White text, right side   │
└──────────────────────────┘
```

#### Bot Message (Gray)
```
┌──────────────────────────┐
│ This is bot's response   │
│ Gray background          │
│ Black text, left side    │
└──────────────────────────┘
```

### Hover Effects
```
Normal:  Card with white background, gray border
Hover:   Light gray background (#f7f7f7), same border
Active:  Lighter gray background or darker border
```

---

## Typography

### Headings
- Logo: 20px bold black
- Page title: 24px bold black
- Section title: 16px bold black
- Card title: 14px bold black

### Body Text
- Normal: 14px black
- Small: 12px gray
- Label: 13px bold black

### Input Placeholder
- 14px gray (#9ca3af)

---

## Spacing

### Padding
- Large sections: 24px (p-6)
- Cards/containers: 16px (p-4)
- Inputs: 8px (py-2) + 16px (px-4)
- Buttons: 8px (py-2) + 16px (px-4)

### Gaps
- Between elements: 12-16px
- Between sections: 24px
- Message spacing: 16px

---

## Borders & Shadows

### Borders
- All borders: 1px light gray (#d1d5db or #e5e7eb)
- Radius: 8px (rounded-lg)

### Shadows
- Card hover: None (use background color change)
- Drop shadow: None (clean design)

### No Gradients
- **0 gradients used**
- Pure solid colors only

---

## Theme Consistency

```
Primary Color:  #000000 (Black)
Secondary:      #ffffff (White)
Accent:         #e5e7eb (Gray)

Hover:          #f7f7f7 (Light Gray)
Focus:          #000000 (Black ring)
Error:          #ef4444 (Red)
Success:        #10b981 (Green)

Total Colors:   15
```

---

## Design Rules

1. ✓ **Black & White Only** - No colors except black, white, gray, + red/green for errors/success
2. ✓ **No Gradients** - Pure solid colors
3. ✓ **Clean Typography** - 2 fonts max (already set)
4. ✓ **Consistent Spacing** - Multiples of 4px
5. ✓ **Simple Borders** - 1px light gray, 8px radius
6. ✓ **Hover Effects** - Gray backgrounds, not color changes
7. ✓ **Focus States** - Black rings around interactive elements
8. ✓ **ChatGPT Inspired** - Left sidebar, center chat, top header

---

## Done!

This is the complete visual design of the new VisioNiX interface. All pages follow this design system.
