function LogomarkPaths() {
  return (
    <text x="6" y="28" fontSize="24" fontWeight="bold" fill="#38BDF8">
      ⚡
    </text>
  )
}

export function Logomark(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 36 36" fill="none" {...props}>
      <LogomarkPaths />
    </svg>
  )
}

export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 250 36" fill="none" {...props}>
      <LogomarkPaths />
      <text
        x="44"
        y="25"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="16"
        fontWeight="bold"
        fill="#38BDF8"
      >
        LARAVOLT
      </text>
    </svg>
  )
}
