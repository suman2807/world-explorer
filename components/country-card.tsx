"use client"

import Image from "next/image"
import { Heart } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"

export function CountryCard({ country, isFavorite, onClick }) {
  const { toggleFavorite } = useFavorites()
  const { name, flags, capital, population, region } = country

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num)
  }

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    toggleFavorite(country)
  }

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all"
      onClick={onClick}
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <Image
          src={flags.svg || flags.png}
          alt={`Flag of ${name.common}`}
          fill
          className="object-cover transform hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full ${
            isFavorite ? "bg-red-500 text-white" : "bg-black/30 text-white hover:bg-black/50"
          } backdrop-blur-sm transition-colors`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="p-5">
        <h2 className="text-lg font-bold mb-3 line-clamp-1">{name.common}</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Population:</span>
            <span className="font-medium">{formatNumber(population)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Region:</span>
            <span className="font-medium">{region}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Capital:</span>
            <span className="font-medium">{capital ? capital.join(", ") : "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
