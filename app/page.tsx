"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SearchBar } from "@/components/search-bar"
import { RegionFilter } from "@/components/region-filter"
import { CountryGrid } from "@/components/country-grid"
import { ThemeToggle } from "@/components/theme-toggle"
import { FavoritesButton } from "@/components/favorites-button"
import { SkeletonGrid } from "@/components/skeleton-grid"
import { useDebounce } from "@/hooks/use-debounce"
import { useFavorites } from "@/hooks/use-favorites"

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get("region") || "")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { favorites } = useFavorites()
  const itemsPerPage = 24

  // Fetch all countries on initial load
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("https://restcountries.com/v3.1/all")
        if (!response.ok) throw new Error("Failed to fetch countries")
        const data = await response.json()

        // Sort countries alphabetically by name
        const sortedData = data.sort((a, b) => a.name.common.localeCompare(b.name.common))
        setCountries(sortedData)
        setIsLoading(false)
      } catch (err) {
        setError(err.message)
        setIsLoading(false)
      }
    }

    fetchCountries()
  }, [])

  // Filter countries based on search term and region
  useEffect(() => {
    if (countries.length > 0) {
      let filtered = [...countries]

      if (debouncedSearchTerm) {
        filtered = filtered.filter(
          (country) =>
            country.name.common.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            (country.name.official &&
              country.name.official.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
            (country.capital &&
              country.capital.some((cap) => cap.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))),
        )
      }

      if (selectedRegion) {
        filtered = filtered.filter((country) => country.region === selectedRegion)
      }

      setFilteredCountries(filtered)
      setPage(1)
      setHasMore(filtered.length > itemsPerPage)
    }
  }, [countries, debouncedSearchTerm, selectedRegion])

  // Update URL with search params
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (selectedRegion) params.set("region", selectedRegion)

    const url = params.toString() ? `?${params.toString()}` : ""
    window.history.replaceState(null, "", url)
  }, [searchTerm, selectedRegion])

  const handleSearchChange = (value) => {
    setSearchTerm(value)
  }

  const handleRegionChange = (value) => {
    setSelectedRegion(value)
  }

  const handleCountryClick = (countryCode) => {
    router.push(`/country/${countryCode}`)
  }

  const loadMore = () => {
    if (page * itemsPerPage < filteredCountries.length) {
      setPage(page + 1)
      setHasMore((page + 1) * itemsPerPage < filteredCountries.length)
    } else {
      setHasMore(false)
    }
  }

  const paginatedCountries = filteredCountries.slice(0, page * itemsPerPage)

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">World Explorer</h1>
          <div className="flex items-center gap-4">
            <FavoritesButton count={favorites.length} onClick={() => router.push("/favorites")} />
            <ThemeToggle />
          </div>
        </div>
        <div className="text-center py-16">
          <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-xl shadow-lg max-w-lg mx-auto">
            <p className="text-red-500 dark:text-red-400 text-xl mb-4">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 dark:from-emerald-700 dark:to-blue-700">
        <div className="container mx-auto px-4 py-16 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Our World</h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Discover detailed information about countries, their cultures, and statistics in one place
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
              <SearchBar value={searchTerm} onChange={handleSearchChange} />
              <RegionFilter value={selectedRegion} onChange={handleRegionChange} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">
              {searchTerm || selectedRegion ? "Search Results" : "All Countries"}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">({filteredCountries.length} countries)</span>
          </div>
          <div className="flex items-center gap-4">
            <FavoritesButton count={favorites.length} onClick={() => router.push("/favorites")} />
            <ThemeToggle />
          </div>
        </div>

        {isLoading ? (
          <SkeletonGrid count={12} />
        ) : (
          <>
            <CountryGrid countries={paginatedCountries} favorites={favorites} onCountryClick={handleCountryClick} />

            {filteredCountries.length === 0 && (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
                  No countries found. Try adjusting your search or filter.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedRegion("")
                  }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {hasMore && filteredCountries.length > 0 && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Load More Countries
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
