"use client"

import { useState, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function useToast() {
  const [toasts, setToasts] = useState([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  const toast = useCallback(({ title, description, variant = "default", duration = 5000 }) => {
    const id = Math.random().toString(36).substring(2, 9)

    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant, duration }])

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  const ToastContainer = useCallback(() => {
    if (!isMounted) return null

    return createPortal(
      <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2 max-w-md w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className={`p-4 rounded-lg shadow-lg flex items-start gap-3 ${
                toast.variant === "destructive"
                  ? "bg-red-500 text-white"
                  : toast.variant === "success"
                    ? "bg-emerald-500 text-white"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex-1">
                <h3 className="font-medium">{toast.title}</h3>
                {toast.description && <p className="text-sm opacity-90 mt-1">{toast.description}</p>}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-current opacity-70 hover:opacity-100 transition-opacity"
              >
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>,
      document.body,
    )
  }, [isMounted, toasts, removeToast])

  return { toast, ToastContainer }
}
