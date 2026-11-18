export function TopBar() {
  return (
    <a
      href="https://builderbot.cloud"
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-10 flex-wrap items-center justify-center gap-2 bg-[linear-gradient(90deg,#fce7f3,#ede9fe_50%,#dbeafe)] px-4 text-xs text-bb-ink dark:bg-[linear-gradient(90deg,#3b1530,#2a1a3d_50%,#1e2a4d)]"
    >
      <span className="rounded-md bg-bb-btn px-2 py-0.5 text-bb-btnfg">builderbot cloud</span>
      <span className="hidden sm:inline">Build your bot without code</span>
      <span className="rounded-md bg-[#0b0b0c] px-2 py-0.5 font-medium text-white">Free trial ↗</span>
    </a>
  )
}
