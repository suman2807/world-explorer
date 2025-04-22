"use client"

import { Search, X } from "lucide-react"

export function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full md:max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800/90 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white shadow-lg"
        placeholder="Search for a country..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => onChange("")}
        >
          <span className="sr-only">Clear search</span>
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
        </button>
      )}
    </div>
  )
}
