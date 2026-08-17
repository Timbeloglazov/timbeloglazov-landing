import { useState, useEffect } from 'react'

interface UseTypewriterOptions {
  text: string
  speed?: number
  startDelay?: number
}

interface UseTypewriterResult {
  displayed: string
  done: boolean
}

export function useTypewriter({
  text,
  speed = 38,
  startDelay = 600,
}: UseTypewriterOptions): UseTypewriterResult {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let index = 0
    let intervalId: ReturnType<typeof setInterval>

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        index++
        setDisplayed(text.slice(0, index))
        if (index >= text.length) {
          clearInterval(intervalId)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [text, speed, startDelay])

  return { displayed, done }
}
