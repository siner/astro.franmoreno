import React, { useState, useEffect } from 'react'
import Moon from './moon'
import Sun from './sun'

function SwitchDark() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'light')

  const handleClick = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <label className="toggle-wrapper" htmlFor="toggle">
      <div className={`toggle ${theme === 'dark' ? 'enabled' : 'disabled'}`}>
        <span className="hidden">
          {theme === 'dark' ? 'Enable Light Mode' : 'Enable Dark Mode'}
        </span>
        <div className="icons">
          <Sun />
          <Moon />
        </div>
        <label htmlFor="toggle" className="hidden"></label>
        <input
          id="toggle"
          name="toggle"
          type="checkbox"
          checked={theme === 'dark'}
          onClick={handleClick}
          readOnly
        />
      </div>
    </label>
  )
}

export default SwitchDark
