"use client"

import { CountryCard } from "@/components/country-card"

export function CountryGrid({ countries, favorites, onCountryClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {countries.map((country) => (
        <CountryCard
          key={country.cca3}
          country={country}
          isFavorite={favorites.includes(country.cca3)}
          onClick={() => onCountryClick(country.cca3)}
        />
      ))}
    </div>
  )
}
