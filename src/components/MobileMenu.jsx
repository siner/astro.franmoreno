import { useState, useEffect } from 'react'
import SwitchDark from './elements/switchDark'

const navLinks = [
  { href: '/', text: 'Inicio' },
  { href: '/blog', text: 'Blog' },
  { href: '/servicios', text: 'Servicios' },
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
        <div className="fixed inset-0 z-50 bg-gray-900/20 backdrop-blur-sm dark:bg-gray-900/80">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-800 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Menú
              </h2>
              <button
                type="button"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setIsOpen(false)}
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

            <nav className="space-y-6">
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="block text-base font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Tema
                  </span>
                  <SwitchDark />
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
