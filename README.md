# Site Referral Platform

A Next.js application for managing site referrals with a beautiful glassmorphic UI design.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 with custom glassmorphic design system
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) with custom glassmorphic styling
- **Charts**: Recharts with shadcn chart wrappers
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## shadcn/ui Components

This project uses shadcn/ui components with custom glassmorphic styling. Available components:

### Core Components
- **Button** - Extended with `isLoading`, `leftIcon`, `rightIcon` props
- **Sidebar** - Collapsible sidebar with icon-only mode
- **Dialog** - Modal dialogs with backdrop blur
- **Select** - Dropdown select with glassmorphic styling
- **DropdownMenu** - Context menus and dropdowns

### Chart Components
- **AreaChart** - Line charts with gradient fills
- **BarChart** - Horizontal/vertical bar charts
- **DonutChart** - Pie charts with center labels
- **FunnelChart** - Custom funnel visualization

### Utility Components
- **Sheet** - Slide-out panels
- **Skeleton** - Loading placeholders
- **Separator** - Visual dividers

## Adding New shadcn Components

```bash
npx shadcn@latest add [component-name]
```

After adding, apply glassmorphic styling by updating:
- Background: `bg-bg-secondary/95 backdrop-blur-lg`
- Border: `border border-glass-border`
- Text: `text-text-primary` / `text-text-muted`
- Focus: `focus:ring-mint/50`

## Project Structure

```
components/
  ui/           # shadcn/ui and custom UI components
  layout/       # Layout components (AppSidebar, Header)
  charts/       # Chart components
  dashboard/    # Dashboard-specific components
app/
  (authenticated)/  # Protected routes
  page.tsx          # Login page
lib/
  utils.ts      # cn() utility for class merging
  chart-theme.ts # Chart color configuration
```

## Build

```bash
npm run build
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
