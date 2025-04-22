"use client"

import { Heart } from "lucide-react"

export function FavoritesButton({ count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-md"
    >
      <Heart size={20} className="text-red-500" />
      <span>Favorites</span>
      {count > 0 && (
        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full">
          {count}
        </span>
      )}
    </button>
  )
}
