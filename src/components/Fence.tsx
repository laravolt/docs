'use client'

import { useState } from 'react'
import { Highlight, Prism } from 'prism-react-renderer'
;(typeof global !== 'undefined' ? global : window).Prism = Prism
require('prismjs/components/prism-markup-templating')
require('prismjs/components/prism-bash')
require('prismjs/components/prism-php')

function CopyIcon(props: Readonly<React.ComponentPropsWithoutRef<'svg'>>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon(props: Readonly<React.ComponentPropsWithoutRef<'svg'>>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export function Fence({
  children,
  language,
}: Readonly<{
  children: string
  language: string
}>) {
  const [copied, setCopied] = useState(false)

  // Map of language names to display
  const languageNames: Record<string, string> = {
    js: 'JavaScript',
    jsx: 'JSX',
    ts: 'TypeScript',
    tsx: 'TSX',
    html: 'HTML',
    css: 'CSS',
    php: 'PHP',
    bash: 'Bash',
    shell: 'Shell',
    json: 'JSON',
    yaml: 'YAML',
    markdown: 'Markdown',
    md: 'Markdown',
    sql: 'SQL',
    // Add more languages as needed
  }

  // Get the display name for the language, fallback to capitalized language if not in map
  const displayLanguage =
    languageNames[language] ||
    (language
      ? language.charAt(0).toUpperCase() + language.slice(1)
      : 'Plain Text')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children.trimEnd())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative">
      <div className="absolute top-2 left-4 rounded py-1.5 font-mono text-xs text-gray-500">
        {copied ? <span className="text-white">Copied</span> : displayLanguage}
      </div>

      <button
        onClick={handleCopy}
        className="absolute top-2 right-4 rounded-md bg-gray-800/50 p-1.5 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
        aria-label="Copy code to clipboard"
        title="Copy code to clipboard"
      >
        {copied ? (
          <CheckIcon className="h-4 w-4" />
        ) : (
          <CopyIcon className="h-4 w-4" />
        )}
      </button>

      <Highlight
        code={children.trimEnd()}
        language={language}
        // Use empty theme to allow custom CSS to take precedence
        theme={{ plain: {}, styles: [] }}
      >
        {({ className, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} language-${language}`}
            style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              paddingTop: '2.5rem',
            }}
          >
            <code className={`language-${language}`}>
              {tokens.map((line, lineIndex) => {
                const lineProps = getLineProps({ line, key: lineIndex })
                // Remove key from props to avoid duplicate keys warning
                const { key: _, ...linePropsWithoutKey } = lineProps

                return (
                  <div key={`line-${lineIndex + 10}`} {...linePropsWithoutKey}>
                    {line
                      .filter((token) => !token.empty)
                      .map((token, tokenIndex) => {
                        const tokenProps = getTokenProps({
                          token,
                          key: tokenIndex,
                        })
                        // Remove key from props to avoid duplicate keys warning
                        const { key: __, ...tokenPropsWithoutKey } = tokenProps

                        return (
                          <span
                            key={`token-${tokenIndex + 100}`}
                            {...tokenPropsWithoutKey}
                          />
                        )
                      })}
                  </div>
                )
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}
