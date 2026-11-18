/** Fine grid that fades out from the top-left, behind the page title. */
export function HeroPattern() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] overflow-hidden">
      <div
        className="absolute inset-0 [mask-image:radial-gradient(70%_70%_at_30%_25%,#000,transparent_75%)]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgb(var(--bb-head) / 0.05) 0 1px, transparent 1px 48px), repeating-linear-gradient(0deg, rgb(var(--bb-head) / 0.05) 0 1px, transparent 1px 48px)',
        }}
      />
    </div>
  )
}
