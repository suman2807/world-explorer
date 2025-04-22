"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export function CountryLanguageChart({ country }) {
  if (!country.languages || Object.keys(country.languages).length === 0) {
    return <div className="text-center py-4">No language data available</div>
  }

  const languages = Object.values(country.languages)

  // Generate chart data
  const data = languages.map((language, index) => ({
    name: language,
    value: 1, // Equal weight for visualization
  }))

  // Colors for the pie chart
  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name }) => name}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
