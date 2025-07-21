import Image from 'next/image'

// Corporate sponsor configuration
const SPONSOR_CONFIG = {
  enabled: true,
  sponsors: [
    {
      name: 'Javan',
      logo: '/images/javan.png',
      url: 'https://javan.co.id',
      alt: 'Sponsored by Javan',
    },
  ],
}

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

export function SponsorLogo({ className }: { className?: string }) {
  if (!SPONSOR_CONFIG.enabled || SPONSOR_CONFIG.sponsors.length === 0)
    return null

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <span className="hidden text-xs text-slate-500 sm:inline dark:text-slate-400">
        Sponsored by
      </span>
      {SPONSOR_CONFIG.sponsors.map((sponsor, index) => (
        <a
          key={sponsor.name}
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-xs text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          title={sponsor.alt}
        >
          <Image
            src={sponsor.logo}
            alt={sponsor.alt}
            width={80}
            height={26}
            className="h-6 w-auto opacity-75 transition-opacity hover:opacity-100"
          />
        </a>
      ))}
    </div>
  )
}

export function HeroSponsorLogo({ className }: { className?: string }) {
  if (!SPONSOR_CONFIG.enabled || SPONSOR_CONFIG.sponsors.length === 0)
    return null

  return (
    <div
      className={`flex flex-col space-y-4 md:items-center lg:items-start ${className}`}
    >
      <span className="text-sm font-medium text-slate-400 md:justify-center lg:justify-start">
        Proudly sponsored by
      </span>
      <div className="flex items-center space-x-6">
        {SPONSOR_CONFIG.sponsors.map((sponsor, index) => (
          <a
            key={sponsor.name}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center text-sm text-slate-400 transition-colors hover:text-slate-300"
            title={sponsor.alt}
          >
            <Image
              src={sponsor.logo}
              alt={sponsor.alt}
              width={120}
              height={38}
              className="h-10 w-auto opacity-80 transition-all duration-200 group-hover:scale-105 group-hover:opacity-100"
            />
          </a>
        ))}
      </div>
    </div>
  )
}

export function LogoWithSponsor(props: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className="flex items-center space-x-3 sm:space-x-4" {...props}>
      <SponsorLogo className="xs:block hidden" />
      <div className="flex items-center">
        <Logomark className="h-9 w-9 lg:hidden" />
        <Logo className="hidden h-9 w-auto fill-slate-700 lg:block dark:fill-sky-100" />
      </div>
    </div>
  )
}
