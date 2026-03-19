import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <div className="page-wrap flex items-center justify-between gap-3 py-3 sm:py-4">
        <h1 className="m-0 text-base font-semibold tracking-tight text-[var(--sea-ink)]">
          Devinette célébrités
        </h1>
        <ThemeToggle />
      </div>
    </header>
  )
}
