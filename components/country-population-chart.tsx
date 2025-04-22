"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

export function CountryPopulationChart({ country }) {
  const [chartData, setChartData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTopCountries = async () => {
      try {
        // Fetch top countries by population for comparison
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,population,cca3")
        if (!response.ok) throw new Error("Failed to fetch countries for chart")

        const data = await response.json()

        // Sort countries by population (descending)
        const sortedCountries = [...data].sort((a, b) => b.population - a.population)

        // Get top 4 countries and add the current country if not in top 5
        const topCountries = sortedCountries.slice(0, 4)
        const currentCountryIndex = topCountries.findIndex((c) => c.cca3 === country.cca3)

        if (currentCountryIndex === -1) {
          // Current country not in top 4, add it to the chart data
          const currentCountryData = sortedCountries.find((c) => c.cca3 === country.cca3)
          if (currentCountryData) {
            topCountries.push(currentCountryData)
          }
        }

        // Format data for the chart
        const chartData = topCountries.map((c) => ({
          name: c.name.common,
          population: c.population,
          isCurrentCountry: c.cca3 === country.cca3,
        }))

        setChartData(chartData)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching chart data:", err)
        setIsLoading(false)
      }
    }

    fetchTopCountries()
  }, [country.cca3])

  if (isLoading || chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const formatPopulation = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-emerald-500 font-medium">Population: {new Intl.NumberFormat().format(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => (value.length > 10 ? `${value.substring(0, 10)}...` : value)}
          />
          <YAxis tickFormatter={formatPopulation} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="population" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.isCurrentCountry ? "url(#colorGradient)" : "#94a3b8"} />
            ))}
          </Bar>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
