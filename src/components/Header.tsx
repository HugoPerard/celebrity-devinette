import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 px-4 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 py-3 sm:py-4">
        <Link
          to="/"
          className="m-0 text-base font-semibold tracking-tight text-foreground no-underline hover:text-foreground [font-family:var(--font-heading)]"
        >
          Kasistar
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            to="/archives"
            className="text-sm text-muted-foreground no-underline hover:text-foreground"
          >
            Archives
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
