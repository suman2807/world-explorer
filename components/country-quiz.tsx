"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

export function CountryQuiz({ country }) {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)

  useEffect(() => {
    if (country) {
      generateQuestions()
    }
  }, [country])

  const generateQuestions = () => {
    const quizQuestions = []

    // Capital question
    if (country.capital && country.capital.length > 0) {
      quizQuestions.push({
        question: `What is the capital of ${country.name.common}?`,
        options: generateCapitalOptions(),
        correctAnswer: country.capital[0],
      })
    }

    // Continent question
    if (country.continents && country.continents.length > 0) {
      quizQuestions.push({
        question: `Which continent is ${country.name.common} located in?`,
        options: generateContinentOptions(),
        correctAnswer: country.continents[0],
      })
    }

    // Population question
    quizQuestions.push({
      question: `What is the population of ${country.name.common}?`,
      options: generatePopulationOptions(),
      correctAnswer: formatPopulation(country.population),
    })

    // Border question
    if (country.borders && country.borders.length > 0) {
      quizQuestions.push({
        question: `Which of these countries does NOT border ${country.name.common}?`,
        options: generateBorderOptions(),
        correctAnswer: "Non-bordering country", // Placeholder
      })
    } else {
      quizQuestions.push({
        question: `${country.name.common} is an island nation with no land borders.`,
        options: ["True", "False"],
        correctAnswer: "True",
      })
    }

    // Language question
    if (country.languages && Object.keys(country.languages).length > 0) {
      quizQuestions.push({
        question: `What is the official language of ${country.name.common}?`,
        options: generateLanguageOptions(),
        correctAnswer: Object.values(country.languages)[0],
      })
    }

    setQuestions(quizQuestions)
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setIsAnswered(false)
  }

  const generateCapitalOptions = () => {
    const correctCapital = country.capital ? country.capital[0] : "Unknown"
    const options = [correctCapital]

    // Add some fake capitals
    const fakeCapitals = ["Paris", "London", "Tokyo", "Berlin", "Madrid", "Rome", "Moscow", "Beijing", "Cairo", "Delhi"]

    while (options.length < 4) {
      const randomCapital = fakeCapitals[Math.floor(Math.random() * fakeCapitals.length)]
      if (!options.includes(randomCapital)) {
        options.push(randomCapital)
      }
    }

    return shuffleArray(options)
  }

  const generateContinentOptions = () => {
    const correctContinent = country.continents ? country.continents[0] : "Unknown"
    const allContinents = ["Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"]
    const options = [correctContinent]

    const otherContinents = allContinents.filter((c) => c !== correctContinent)

    while (options.length < 4) {
      const randomContinent = otherContinents[Math.floor(Math.random() * otherContinents.length)]
      if (!options.includes(randomContinent)) {
        options.push(randomContinent)
      }
    }

    return shuffleArray(options)
  }

  const formatPopulation = (population) => {
    return new Intl.NumberFormat().format(population)
  }

  const generatePopulationOptions = () => {
    const correctPopulation = formatPopulation(country.population)
    const options = [correctPopulation]

    // Generate fake population numbers that are somewhat close to the real one
    while (options.length < 4) {
      const factor = Math.random() * 3 + 0.5 // Between 0.5x and 3.5x
      const fakePopulation = Math.round(country.population * factor)
      const formattedFakePopulation = formatPopulation(fakePopulation)

      if (!options.includes(formattedFakePopulation)) {
        options.push(formattedFakePopulation)
      }
    }

    return shuffleArray(options)
  }

  const generateBorderOptions = () => {
    // For simplicity, we'll use placeholder text
    const options = ["Non-bordering country"]

    // Add some real bordering countries or placeholders
    options.push("Bordering country 1")
    options.push("Bordering country 2")
    options.push("Bordering country 3")

    return shuffleArray(options)
  }

  const generateLanguageOptions = () => {
    const correctLanguage = country.languages ? Object.values(country.languages)[0] : "Unknown"
    const options = [correctLanguage]

    // Add some fake languages
    const fakeLanguages = [
      "English",
      "Spanish",
      "French",
      "German",
      "Chinese",
      "Arabic",
      "Russian",
      "Portuguese",
      "Japanese",
      "Hindi",
    ]

    while (options.length < 4) {
      const randomLanguage = fakeLanguages[Math.floor(Math.random() * fakeLanguages.length)]
      if (!options.includes(randomLanguage)) {
        options.push(randomLanguage)
      }
    }

    return shuffleArray(options)
  }

  const shuffleArray = (array) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  const handleAnswerClick = (answer) => {
    if (isAnswered) return

    setSelectedAnswer(answer)
    setIsAnswered(true)

    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setIsAnswered(false)
      } else {
        setShowResult(true)
      }
    }, 1500)
  }

  const resetQuiz = () => {
    generateQuestions()
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-8"
      >
        <h3 className="text-2xl font-bold mb-4">Quiz Results</h3>
        <div className="text-5xl font-bold mb-6">
          {score}/{questions.length}
        </div>
        <p className="text-lg mb-8">
          {score === questions.length
            ? "Perfect! You're an expert on this country!"
            : score >= questions.length / 2
              ? "Good job! You know quite a bit about this country."
              : "Keep learning! There's more to discover about this country."}
        </p>
        <button
          onClick={resetQuiz}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all shadow-md"
        >
          Try Again
        </button>
      </motion.div>
    )
  }

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-medium">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="text-sm font-medium">
          Score: {score}/{currentQuestion}
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-6">{questions[currentQuestion].question}</h3>

      <div className="space-y-3">
        {questions[currentQuestion].options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswerClick(option)}
            className={`w-full text-left p-4 rounded-lg transition-colors ${
              isAnswered
                ? option === questions[currentQuestion].correctAnswer
                  ? "bg-green-100 dark:bg-green-900/30 border-green-500 border"
                  : option === selectedAnswer
                    ? "bg-red-100 dark:bg-red-900/30 border-red-500 border"
                    : "bg-gray-100 dark:bg-gray-700"
                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            disabled={isAnswered}
          >
            <div className="flex justify-between items-center">
              <span>{option}</span>
              {isAnswered && option === questions[currentQuestion].correctAnswer && (
                <Check className="text-green-500" size={20} />
              )}
              {isAnswered && option === selectedAnswer && option !== questions[currentQuestion].correctAnswer && (
                <X className="text-red-500" size={20} />
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
