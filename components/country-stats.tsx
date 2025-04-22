"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export function CountryStats({ countries }) {
  const [regionData, setRegionData] = useState([])
  const [populationData, setPopulationData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (countries.length > 0) {
      // Process region data
      const regionCounts = {}
      countries.forEach((country) => {
        if (country.region) {
          regionCounts[country.region] = (regionCounts[country.region] || 0) + 1
        }
      })

      const regionChartData = Object.keys(regionCounts).map((region) => ({
        name: region,
        value: regionCounts[region],
      }))

      setRegionData(regionChartData)

      // Process population data
      // Get top 10 countries by population
      const topPopulationCountries = [...countries]
        .sort((a, b) => b.population - a.population)
        .slice(0, 10)
        .map((country) => ({
          name: country.name.common,
          population: country.population,
        }))

      setPopulationData(topPopulationCountries)
      setIsLoading(false)
    }
  }, [countries])

  if (isLoading || countries.length === 0) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Colors for the pie chart
  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#14b8a6"]

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
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-emerald-500 font-medium">
            {payload[0].dataKey === "population"
              ? `Population: ${new Intl.NumberFormat().format(payload[0].value)}`
              : `Countries: ${payload[0].value}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Countries by Region</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Top 10 Countries by Population</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={populationData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
              <XAxis type="number" tickFormatter={formatPopulation} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="population" fill="url(#colorGradient)" radius={[0, 4, 4, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
