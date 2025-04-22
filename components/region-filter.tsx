"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp, Globe } from "lucide-react"

export function RegionFilter({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania", "Antarctic"]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative w-full md:w-64" ref={ref}>
      <button
        type="button"
        className="flex items-center justify-between w-full p-4 text-sm text-gray-900 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/90 dark:border-gray-700 dark:text-white shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" />
          <span>{value || "Filter by Region"}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl dark:bg-gray-800 dark:border-gray-700">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 max-h-60 overflow-y-auto">
            <li>
              <button
                type="button"
                className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  onChange("")
                  setIsOpen(false)
                }}
              >
                All Regions
              </button>
            </li>
            {regions.map((region) => (
              <li key={region}>
                <button
                  type="button"
                  className={`flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    value === region ? "bg-gray-100 dark:bg-gray-700 font-medium" : ""
                  }`}
                  onClick={() => {
                    onChange(region)
                    setIsOpen(false)
                  }}
                >
                  {region}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
