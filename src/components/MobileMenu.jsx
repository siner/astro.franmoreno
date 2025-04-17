import { useState, useEffect } from 'react'
import SwitchDark from './elements/switchDark'

const navLinks = [
  { href: '/', text: 'Inicio' },
  { href: '/blog', text: 'Blog' },
  { href: 'https://cv.franmoreno.com', text: 'CV' }
]

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleNavigation = () => {
      setIsOpen(false)
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    document.addEventListener('astro:page-load', handleNavigation)
    return () => {
      document.removeEventListener('astro:page-load', handleNavigation)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        className="flex items-center justify-center w-8 h-8 text-gray-700 dark:text-gray-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[9998] bg-white backdrop-blur-sm dark:bg-gray-900 h-screen" />
          <div className="fixed inset-0 z-[9999] bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 py-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="flex items-center justify-center w-8 h-8 text-gray-700 dark:text-gray-300"
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar menú"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col items-center justify-center h-[80vh]">
                <ul className="flex flex-col items-center space-y-8 text-xl">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="font-semibold hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        target={
                          link.href.startsWith('http') ? '_blank' : undefined
                        }
                        rel={
                          link.href.startsWith('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                  <li className="mt-8">
                    <SwitchDark />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
