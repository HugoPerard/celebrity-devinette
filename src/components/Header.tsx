import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-3 pb-3 sm:px-6 sm:pt-4 sm:pb-4">
      <div className="topbar-glass mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
        <Link
          to="/"
          className="m-0 inline-flex items-center gap-2.5 no-underline [font-family:var(--font-heading)]"
        >
          <img
            src="/favicon.ico"
            alt=""
            width={32}
            height={32}
            className="block size-8 shrink-0 rounded-xl ring-1 ring-border dark:ring-white/15"
            decoding="async"
            fetchPriority="low"
          />
          <span className="type-brand-wordmark text-primary">Kasistar</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            to="/archives"
            className="text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-primary"
          >
            Archives
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
