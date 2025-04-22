"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { CountryGrid } from "@/components/country-grid"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useFavorites } from "@/hooks/use-favorites"

export default function Favorites() {
  const router = useRouter()
  const { favorites } = useFavorites()
  const [favoriteCountries, setFavoriteCountries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFavoriteCountries = async () => {
      if (favorites.length === 0) {
        setFavoriteCountries([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${favorites.join(",")}`)
        if (!response.ok) throw new Error("Failed to fetch favorite countries")
        const data = await response.json()
        setFavoriteCountries(data)
        setIsLoading(false)
      } catch (err) {
        setError(err.message)
        setIsLoading(false)
      }
    }

    fetchFavoriteCountries()
  }, [favorites])

  const handleCountryClick = (countryCode) => {
    router.push(`/country/${countryCode}`)
  }

  if (isLoading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-red-500 text-xl">Error: {error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 shadow-md rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>
        <h1 className="text-2xl font-bold">Your Favorite Countries</h1>
      </div>

      {favoriteCountries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl mb-4">You haven't added any countries to your favorites yet.</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Explore Countries
          </button>
        </div>
      ) : (
        <CountryGrid countries={favoriteCountries} favorites={favorites} onCountryClick={handleCountryClick} />
      )}
    </div>
  )
}
