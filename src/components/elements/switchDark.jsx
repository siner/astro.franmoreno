import React, { useState, useEffect } from 'react'
import Moon from './moon'
import Sun from './sun'

const updateTheme = (isDarkEnabled) => {
  // Get CSS variables for background/foreground
  const styles = getComputedStyle(document.body)
  const black = styles.getPropertyValue('--black')
  const white = styles.getPropertyValue('--white')
  const docEl = document.documentElement

  if (isDarkEnabled) {
    docEl.style.setProperty('--background', black)
    docEl.style.setProperty('--foreground', white)
    document.querySelector('html').classList.add('dark')
  } else {
    docEl.style.setProperty('--background', white)
    docEl.style.setProperty('--foreground', black)
    document.querySelector('html').classList.remove('dark')
  }
}

function SwitchDark() {
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    updateTheme(isEnabled)
  }, [isEnabled])

  const toggleState = () => {
    setIsEnabled((prevState) => !prevState)
  }

  return (
    <label className="toggle-wrapper" htmlFor="toggle">
      <div className={`toggle ${isEnabled ? 'enabled' : 'disabled'}`}>
        <span className="hidden">
          {isEnabled ? 'Enable Light Mode' : 'Enable Dark Mode'}
        </span>
        <div className="icons">
          <Sun />
          <Moon />
        </div>
        <label for="toggle" className="hidden"></label>
        <input
          id="toggle"
          name="toggle"
          type="checkbox"
          checked={isEnabled}
          onClick={toggleState}
          readOnly
        />
      </div>
    </label>
  )
}

export default SwitchDark
