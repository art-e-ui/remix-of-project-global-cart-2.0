/**
 * standardLoginModal-1
 * ─────────────────────
 * Extracted from: /admin/auth/sign-in (AdminSignIn.tsx)
 *
 * Reusable design token reference for the glassmorphism login modal.
 * Import this config when building login/auth modals across the project
 * to ensure visual consistency.
 */

export const standardLoginModal1 = {
  /** ── Page overlay (behind modal) ── */
  overlay: {
    background: 'bg-black/50',       // 50% black overlay
    blur: 'backdrop-blur-sm',         // ~4px blur on page backdrop
  },

  /** ── Modal container ── */
  modal: {
    background: 'bg-background/25',   // 25% opacity of --background (hsl 0 0% 100%)
    blur: 'backdrop-blur-xl',         // ~24px blur (heavy glassmorphism)
    border: 'border border-border/20', // 20% opacity border
    borderRadius: 'rounded-2xl',      // 16px radius
    padding: 'p-8',                   // 32px padding
    shadow: 'shadow-2xl',             // deep elevation shadow
    maxWidth: 'max-w-md',             // 448px max width
  },

  /** ── Input boxes ── */
  inputContainer: {
    background: 'bg-background/50',           // 50% opacity of --background
    border: 'border border-border',            // solid border using --border token
    borderRadius: 'rounded-lg',               // 8px radius
    padding: 'px-3 py-2.5',                   // 12px horizontal, 10px vertical
    focusRing: 'focus-within:ring-2 focus-within:ring-ring', // 2px ring using --ring token
    transition: 'transition-all',
  },
  inputText: {
    color: 'text-foreground',                 // --foreground (brand-dark: hsl 240 27.3% 14.1%)
    placeholder: 'placeholder:text-muted-foreground', // uses --muted-foreground
    base: 'bg-transparent border-none outline-none text-sm w-full',
  },
  inputIcon: {
    color: 'text-muted-foreground',           // --muted-foreground (hsl 240 5% 46%)
    size: 'h-4 w-4',
  },

  /** ── Labels ── */
  label: {
    color: 'text-foreground',
    style: 'text-sm font-medium mb-1.5 block',
  },

  /** ── Action button (primary CTA) ── */
  actionButton: {
    background: 'bg-primary',                 // --primary (brand-green: hsl 120 100% 28.2%)
    foreground: 'text-primary-foreground',     // --primary-foreground (hsl 0 0% 100% → white)
    hover: 'hover:bg-primary/90',             // 90% opacity on hover
    base: 'w-full rounded-lg py-2.5 text-sm font-medium transition-colors',
  },

  /** ── Secondary text & links ── */
  secondaryText: {
    color: 'text-muted-foreground',           // --muted-foreground
  },
  link: {
    color: 'text-primary',                    // brand-green
    hover: 'hover:underline',
    style: 'text-sm font-medium',
  },

  /** ── Heading ── */
  heading: {
    color: 'text-primary',                    // brand-green
    style: 'text-2xl font-bold',
  },

  /** ── Raw HSL values (from index.css :root) ── */
  rawTokens: {
    '--background':           '0 0% 100%',
    '--foreground':           '240 27.3% 14.1%',
    '--primary':              '120 100% 28.2%',
    '--primary-foreground':   '0 0% 100%',
    '--border':               '214.3 31.8% 91.4%',
    '--ring':                 '120 100% 28.2%',
    '--muted-foreground':     '240 5% 46%',
  },
} as const;

export type StandardLoginModal = typeof standardLoginModal1;
