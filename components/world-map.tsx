"use client"

import { useState, useEffect } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { Tooltip } from "react-tooltip"

export function WorldMap({ countries, onCountryClick, favorites }) {
  const [tooltipContent, setTooltipContent] = useState("")
  const [geoData, setGeoData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Use a reliable GeoJSON source
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then((data) => {
        setGeoData(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching the map data:", error)
        setError(error.message)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[70vh] flex items-center justify-center flex-col gap-4">
        <p className="text-red-500">Failed to load map data: {error}</p>
        <p className="text-sm text-gray-500">Please check your internet connection and try again.</p>
      </div>
    )
  }

  if (!geoData) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <p className="text-red-500">No map data available</p>
      </div>
    )
  }

  // Create a map of country codes to make lookup faster
  const countryMap = {}
  countries.forEach((country) => {
    if (country.cca3) {
      countryMap[country.cca3] = country
    }
  })

  return (
    <div className="h-[70vh] bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
      <ComposableMap
        projectionConfig={{
          scale: 147,
        }}
        data-tooltip-id="country-tooltip"
      >
        <ZoomableGroup>
          {geoData && (
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // Use ISO_A3 or ISO_A2 depending on the GeoJSON structure
                  const countryCode = geo.properties.ISO_A3 || geo.properties.iso_a3
                  const isCountryInList = countryMap[countryCode]
                  const isFavorite = favorites.includes(countryCode)

                  return (
                    <Geography
                      key={geo.rsmKey || geo.properties.name}
                      geography={geo}
                      onMouseEnter={() => {
                        const name = geo.properties.NAME || geo.properties.name
                        setTooltipContent(name || "Unknown")
                      }}
                      onMouseLeave={() => {
                        setTooltipContent("")
                      }}
                      onClick={() => {
                        if (isCountryInList) {
                          onCountryClick(countryCode)
                        }
                      }}
                      style={{
                        default: {
                          fill: isFavorite ? "#ef4444" : isCountryInList ? "#3b82f6" : "#D6D6DA",
                          outline: "none",
                          stroke: "#FFFFFF",
                          strokeWidth: 0.5,
                        },
                        hover: {
                          fill: isFavorite ? "#b91c1c" : isCountryInList ? "#1d4ed8" : "#D6D6DA",
                          outline: "none",
                          stroke: "#FFFFFF",
                          strokeWidth: 0.5,
                          cursor: isCountryInList ? "pointer" : "default",
                        },
                        pressed: {
                          fill: "#3b82f6",
                          outline: "none",
                        },
                      }}
                    />
                  )
                })
              }
            </Geographies>
          )}
        </ZoomableGroup>
      </ComposableMap>
      <Tooltip id="country-tooltip">{tooltipContent}</Tooltip>

      <div className="flex justify-center mt-4 gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
          <span className="text-sm">Available Countries</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
          <span className="text-sm">Favorites</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-sm"></div>
          <span className="text-sm">Not Available</span>
        </div>
      </div>
    </div>
  )
}
