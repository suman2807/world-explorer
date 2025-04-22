"use client"

import { useState, useEffect } from "react"

export function useTheme() {
  const [theme, setTheme] = useState("light")

  // Load theme from localStorage on initial render
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (storedTheme) {
      setTheme(storedTheme)
    } else if (prefersDark) {
      setTheme("dark")
    }
  }, [])

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  return { theme, toggleTheme }
}
