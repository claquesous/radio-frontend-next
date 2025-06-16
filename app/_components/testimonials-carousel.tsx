'use client'

import { useState, useEffect } from 'react'
import styles from './testimonials-carousel.module.css'

interface Testimonial {
  quote: string
  author: string
}

const testimonials: Testimonial[] = [
  {
    quote: "I love how easy it is to create my own radio stream! The song recommendations get better the more I rate, and sharing my stream with friends is so much fun.",
    author: "User 1"
  },
  {
    quote: "This platform has revolutionized how I listen to music. I can discover new tracks and enjoy my favorites all in one place. Highly recommend!",
    author: "User 2"
  }
]

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  return (
    <section className={styles.testimonials}>
      <h2>What Users Say</h2>
      
      <div className={styles.carouselContainer}>
        <button 
          className={styles.navButton}
          onClick={goToPrevious}
          aria-label="Previous testimonial"
        >
          ‹
        </button>

        <div className={styles.speechBubble}>
          <div className={styles.bubbleContent}>
            <p className={styles.quote}>
              &ldquo;{testimonials[currentIndex].quote}&rdquo;
            </p>
            <div className={styles.author}>
              — {testimonials[currentIndex].author}
            </div>
          </div>
          <div className={styles.bubbleTail}></div>
        </div>

        <button 
          className={styles.navButton}
          onClick={goToNext}
          aria-label="Next testimonial"
        >
          ›
        </button>
      </div>

      <div className={styles.dots}>
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
