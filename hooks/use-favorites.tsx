"use client"

import { useState, useEffect } from "react"

export function useFavorites() {
  const [favorites, setFavorites] = useState([])

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (error) {
        console.error("Error parsing favorites from localStorage:", error)
        localStorage.removeItem("favorites")
      }
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (country) => {
    setFavorites((prevFavorites) => {
      const countryCode = country.cca3
      if (prevFavorites.includes(countryCode)) {
        return prevFavorites.filter((code) => code !== countryCode)
      } else {
        return [...prevFavorites, countryCode]
      }
    })
  }

  const isFavorite = (countryCode) => {
    return favorites.includes(countryCode)
  }

  return { favorites, toggleFavorite, isFavorite }
}
