"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Heart, MapPin } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"

export default function CountryDetail() {
  const router = useRouter()
  const params = useParams()
  const { code } = params
  const [country, setCountry] = useState(null)
  const [borderCountries, setBorderCountries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { favorites, toggleFavorite, isFavorite } = useFavorites()

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
        if (!response.ok) throw new Error("Failed to fetch country details")
        const data = await response.json()
        setCountry(data[0])

        // Fetch border countries if any
        if (data[0].borders && data[0].borders.length > 0) {
          const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${data[0].borders.join(",")}`)
          if (!borderResponse.ok) throw new Error("Failed to fetch border countries")
          const borderData = await borderResponse.json()
          setBorderCountries(borderData)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching country details:", err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    if (code) {
      fetchCountryDetails()
    }
  }, [code])

  const handleFavoriteToggle = () => {
    if (country) {
      toggleFavorite(country)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-xl shadow-lg max-w-lg mx-auto">
            <p className="text-red-500 dark:text-red-400 text-xl mb-4">Error: {error}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!country) return null

  const {
    name,
    flags,
    capital,
    population,
    region,
    subregion,
    languages,
    currencies,
    timezones,
    maps,
    area,
    continents,
  } = country

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num)
  }

  const getLanguages = () => {
    return languages ? Object.values(languages).join(", ") : "N/A"
  }

  const getCurrencies = () => {
    if (!currencies) return "N/A"
    return Object.values(currencies)
      .map((currency) => `${currency.name} (${currency.symbol || ""})`)
      .join(", ")
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 dark:from-emerald-700 dark:to-blue-700">
        <div className="container mx-auto px-4 py-12 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-md hover:bg-white/30 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            <h1 className="text-3xl md:text-4xl font-bold">{name.common}</h1>

            <button
              onClick={handleFavoriteToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                isFavorite(country.cca3)
                  ? "bg-red-500/90 hover:bg-red-600/90 text-white"
                  : "bg-white/20 backdrop-blur-sm hover:bg-white/30"
              }`}
            >
              <Heart size={20} fill={isFavorite(country.cca3) ? "white" : "none"} />
              <span>{isFavorite(country.cca3) ? "Remove from Favorites" : "Add to Favorites"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl shadow-2xl">
            <Image src={flags.svg || flags.png} alt={`Flag of ${name.common}`} fill className="object-cover" priority />
          </div>

          <div>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold">{name.common}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Official Name</h3>
                  <p>{name.official}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Capital</h3>
                  <p>{capital ? capital.join(", ") : "N/A"}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Population</h3>
                  <p>{formatNumber(population)}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Region</h3>
                  <p>
                    {region} {subregion ? `(${subregion})` : ""}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Languages</h3>
                  <p>{getLanguages()}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Currencies</h3>
                  <p>{getCurrencies()}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Timezones</h3>
                  <p className="max-h-20 overflow-y-auto">{timezones ? timezones.join(", ") : "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Area</p>
                <p className="text-lg font-semibold">{formatNumber(area)} km²</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Continent</p>
                <p className="text-lg font-semibold">{continents ? continents.join(", ") : "N/A"}</p>
              </div>
            </div>

            {borderCountries.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Border Countries:</h2>
                <div className="flex flex-wrap gap-2">
                  {borderCountries.map((border) => (
                    <button
                      key={border.cca3}
                      onClick={() => router.push(`/country/${border.cca3}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 shadow-md rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="relative w-6 h-4 overflow-hidden rounded-sm">
                        <Image
                          src={border.flags.svg || border.flags.png}
                          alt={`Flag of ${border.name.common}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span>{border.name.common}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {maps && maps.googleMaps && (
              <div className="mt-8">
                <a
                  href={maps.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  <MapPin size={16} />
                  <span>View on Google Maps</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
