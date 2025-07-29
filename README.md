# Assignment Enumerate - Design System Dashboard

A modern, accessible dashboard built with Next.js 15, featuring a comprehensive design system with indigo/pink theming, responsive design, and motion preferences support.

## 🎨 Design System Overview

This project implements a cohesive design system with carefully crafted color palettes, typography scales, and spacing systems to ensure consistency and accessibility across all components.

### Color Palette

#### Primary Colors (Indigo Scale)

- **Primary 50**: `hsl(225, 100%, 97%)` - Lightest indigo for subtle backgrounds
- **Primary 100**: `hsl(226, 100%, 94%)` - Light indigo for hover states
- **Primary 500**: `hsl(239, 84%, 67%)` - Main primary color for buttons and accents
- **Primary 600**: `hsl(243, 75%, 59%)` - Darker primary for active states
- **Primary 900**: `hsl(244, 58%, 51%)` - Darkest primary for text on light backgrounds

#### Secondary Colors (Pink Scale)

- **Secondary 50**: `hsl(327, 73%, 97%)` - Lightest pink for subtle accents
- **Secondary 100**: `hsl(326, 78%, 95%)` - Light pink for muted backgrounds
- **Secondary 500**: `hsl(330, 81%, 60%)` - Main secondary color for highlights
- **Secondary 600**: `hsl(333, 71%, 51%)` - Darker secondary for emphasis
- **Secondary 900**: `hsl(336, 84%, 17%)` - Darkest secondary for text

#### Semantic Colors

- **Success**: `hsl(142, 76%, 36%)` - Green for positive actions and status
- **Warning**: `hsl(38, 92%, 50%)` - Amber for warnings and cautions
- **Info**: `hsl(200, 100%, 60%)` - Blue for informational content
- **Destructive**: `hsl(0, 84.2%, 60.2%)` - Red for errors and destructive actions

#### Neutral Colors

- **Background**: `hsl(0, 0%, 100%)` - Pure white background
- **Foreground**: `hsl(0, 0%, 3.9%)` - Near-black text
- **Muted**: Uses secondary-100 for subtle backgrounds
- **Border**: `hsl(0, 0%, 89.8%)` - Light gray for borders and dividers

### Typography System

#### Font Families

- **Primary**: DM Sans - Modern, readable sans-serif for body text and headings
- **Monospace**: Geist Mono - Clean monospace font for code and data

#### Typography Scale

```css
h1: 2.25rem (36px) / line-height: 2.5rem / weight: 700
h2: 1.875rem (30px) / line-height: 2.25rem / weight: 600
h3: 1.5rem (24px) / line-height: 2rem / weight: 600
h4: 1.25rem (20px) / line-height: 1.75rem / weight: 600
body-large: 1.125rem (18px) / line-height: 1.75rem / weight: 400
body: 1rem (16px) / line-height: 1.5rem / weight: 400
body-small: 0.875rem (14px) / line-height: 1.25rem / weight: 400
caption: 0.75rem (12px) / line-height: 1rem / weight: 400
label: 0.875rem (14px) / line-height: 1.25rem / weight: 500
label-small: 0.75rem (12px) / line-height: 1rem / weight: 500
```

### Spacing System

The spacing system follows a consistent 4px base unit scale:

```css
0: 0px     1: 4px     2: 8px     3: 12px    4: 16px
5: 20px    6: 24px    7: 28px    8: 32px    10: 40px
12: 48px   16: 64px   20: 80px   24: 96px
```

#### Component Spacing Guidelines

- **Micro spacing**: 2-4px for tight element relationships
- **Small spacing**: 8-12px for related elements
- **Medium spacing**: 16-24px for component sections
- **Large spacing**: 28-32px for major layout sections
- **Extra large**: 40px+ for page-level separation

## 📱 Responsive Breakpoints

### Breakpoint Definitions

```css
sm: 640px   // Small devices (large phones)
md: 768px   // Medium devices (tablets)
lg: 1024px  // Large devices (desktops)
xl: 1280px  // Extra large devices
2xl: 1536px // Extra extra large devices
```

### Mobile-First Approach

All components are designed mobile-first with progressive enhancement:

- **Mobile (< 768px)**: Single column layouts, hidden non-essential elements
- **Tablet (768px+)**: Two-column layouts, revealed secondary information
- **Desktop (1024px+)**: Multi-column layouts, full feature set
- **Large Desktop (1280px+)**: Expanded layouts with additional content

### Responsive Component Behavior

#### Sidebar Navigation

- **Mobile**: Hidden by default, accessible via bottom-sliding mobile menu
- **Desktop**: Collapsible sidebar with expand/collapse functionality

#### Transaction Table

- **Mobile**: 4 columns (hides Account column and avatars)
- **Desktop**: 5 columns with full feature set including hover animations

#### Cards and Layout

- **Mobile**: Single column with reduced padding (16px)
- **Desktop**: Grid layouts with expanded padding (28px)

## 🎭 Animation System

### Motion Preferences Support

The design system respects user accessibility preferences with comprehensive `prefers-reduced-motion` support:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Animation Implementation

This project uses the **tailwindcss-animate** plugin to provide a comprehensive set of CSS animations and keyframes. The plugin extends Tailwind CSS with additional animation utilities that integrate seamlessly with our design system.

#### Benefits of tailwindcss-animate

- **Pre-built Animations**: Includes common animations like fade-in, slide-in, scale, and bounce effects
- **CSS Variables**: Utilizes CSS custom properties for smooth, performant animations
- **Customizable**: Animation durations and easing functions can be customized through Tailwind config
- **Accessibility**: Works seamlessly with `prefers-reduced-motion` media queries
- **Performance**: Pure CSS animations with no JavaScript overhead

#### Custom Animations

The following animations are available through the tailwindcss-animate plugin:

```css
fadeIn: 0.2s ease-in-out
slideIn: 0.2s ease-in-out
scaleIn: 0.2s ease-in-out
```

Additional animations provided by tailwindcss-animate:

- `animate-fade-in` - Smooth opacity transition
- `animate-slide-in-from-bottom` - Slide up from bottom
- `animate-slide-in-from-top` - Slide down from top
- `animate-scale-in` - Scale from center point
- `animate-accordion-down` - Smooth accordion expansion
- `animate-accordion-up` - Smooth accordion collapse

### Component Animation Guidelines

#### Hover Effects

- **KPI Cards**: 300ms scale transform with shadow elevation
- **Table Rows**: 200ms background color transition
- **Buttons**: 150ms color and background transitions

#### Interactive Elements

- **View Button**: Smooth slide-in animation on row hover (200ms)
- **Mobile Menu**: Bottom-slide animation with backdrop blur (300ms)
- **Filter Dropdowns**: Fade and scale animation with smooth transitions

### Accessibility Features

#### Motion Safety Classes

- `motion-safe:transition-*` - Only apply transitions when motion is enabled
- `motion-reduce:*` - Alternative styles for reduced motion users

#### Focus Management

- Clear focus indicators with 2px primary color outline
- Keyboard navigation support for all interactive elements
- Screen reader compatible with proper ARIA labels

## 🚀 Performance Optimizations

### CSS-Only Animations

Where possible, animations use pure CSS instead of JavaScript for better performance:

- Table hover effects use CSS group-hover utilities
- Transition animations leverage Tailwind's motion-safe classes
- No JavaScript state management for simple hover interactions

### Optimized Asset Loading

- Next.js Image optimization for brand logos
- Font loading optimization with variable font files
- Lazy loading for non-critical UI components

## 🛠 Development Guidelines

### Component Structure

1. **Mobile-first responsive design**
2. **Accessibility-first implementation**
3. **Motion preferences consideration**
4. **Consistent spacing and typography**

### Color Usage

- Use semantic color names (primary, secondary, success, etc.)
- Maintain contrast ratios above WCAG AA standards (4.5:1)
- Test in both light and dark mode contexts

### Animation Implementation

- Always include motion-safe prefixes for transitions
- Keep animations subtle and purposeful
- Respect user motion preferences
- Use consistent timing and easing across components

---

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: tailwindcss-animate plugin for smooth CSS animations
- **Components**: shadcn/ui component library
- **State Management**: Zustand for global state
- **Data Visualization**: Highcharts for analytics
- **Tables**: TanStack React Table
- **Icons**: Lucide React
- **Fonts**: DM Sans & Geist Mono (Google Fonts)

## 🏗 Project Structure

```
├── app/
│   ├── (protected)/          # Protected routes
│   ├── globals.css          # Global styles and design tokens
│   └── layout.js            # Root layout
├── components/
│   ├── ui/                  # shadcn/ui base components
│   ├── common/              # Shared components (Header, Sidebar, Mobile Menu)
│   └── dashboard/           # Dashboard-specific components
├── store/                   # Zustand state management
├── assets/                  # Static assets (logos, images)
└── lib/                     # Utilities and configurations
```

## 🎯 Features

- **Responsive Dashboard**: Mobile-first design with adaptive layouts
- **Advanced Filtering**: Multi-dimensional data filtering with persistent state
- **Real-time Charts**: Interactive analytics with Highcharts integration
- **Accessibility**: WCAG AA compliant with motion preferences support
- **Mobile Navigation**: Bottom-sliding mobile menu for optimal UX
- **Data Visualization**: KPI cards with micro-animations and trend indicators
- **Table Interactions**: Hover effects and inline actions with smooth transitions

Built with ❤️ using Next.js 15, Tailwind CSS, and shadcn/ui components.
