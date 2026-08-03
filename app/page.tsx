import Link from 'next/link'
import styles from './styles.module.css'
import TestimonialsCarousel from './_components/testimonials-carousel'
import StreamPlayButton from './_components/stream-play-button'

export default function Home() {
  return (
    <div className={styles.page}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Rock Radio, Reimagined</p>
          <h1 className={styles.headline}>
            <span>Your music.</span>
            <span className={styles.accentLine}>Your station.</span>
            <span className={styles.mutedLine}>Your rules.</span>
          </h1>
          <p className={styles.subtitle}>
            Configure your own curated rock stream, rate songs as they play,
            and share it with anyone — one link, no app required.
          </p>
          <div className={styles.ctas}>
            <Link href="/signup" className={styles.ctaPrimary}>
              Start Your Station
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <StreamPlayButton streamId={1} className={styles.ctaGhost}>
              Listen Live
            </StreamPlayButton>
          </div>
        </div>

        <div className={styles.heroArt} aria-hidden="true">
          <div className={styles.vinyl}>
            <div className={styles.vinylGrooves} />
            <div className={styles.vinylLabel}>
              <span>CLAQ</span>
              <span>RADIO</span>
            </div>
          </div>
          <div className={styles.waveform}>
            {Array.from({ length: 28 }, (_, i) => (
              <div key={i} className={styles.bar} style={{ '--i': i } as React.CSSProperties} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section className={styles.features}>
        <div className={styles.inner}>
          <header className={styles.sectionHead}>
            <span className={styles.label}>What you get</span>
            <h2 className={styles.sectionTitle}>Built for serious listeners</h2>
          </header>
          <div className={styles.featureGrid}>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Curated Rock Library</h3>
              <p className={styles.featureDesc}>
                Alternative, punk, hard rock — zero filler. No pop, no playlists
                you didn&apos;t ask for.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Ratings That Learn</h3>
              <p className={styles.featureDesc}>
                Love it or hate it — your input shapes the algorithm. The more
                you rate, the sharper your stream becomes.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Share the Signal</h3>
              <p className={styles.featureDesc}>
                One link. Your friends tune in to your exact stream in real time —
                no app, no signup needed on their end.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className={styles.howItWorks}>
        <div className={styles.inner}>
          <header className={styles.sectionHead}>
            <span className={styles.label}>Get started</span>
            <h2 className={styles.sectionTitle}>Up and running in minutes</h2>
          </header>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNum}>01</div>
              <h3 className={styles.stepTitle}>Create an Account</h3>
              <p className={styles.stepDesc}>Sign up in seconds. No credit card, no nonsense.</p>
            </div>
            <div className={styles.stepConnector} aria-hidden="true" />
            <div className={styles.step}>
              <div className={styles.stepNum}>02</div>
              <h3 className={styles.stepTitle}>Build Your Playlist</h3>
              <p className={styles.stepDesc}>Browse the library and add songs to your stream. Rock only.</p>
            </div>
            <div className={styles.stepConnector} aria-hidden="true" />
            <div className={styles.step}>
              <div className={styles.stepNum}>03</div>
              <h3 className={styles.stepTitle}>Rate &amp; Refine</h3>
              <p className={styles.stepDesc}>Rate songs as they play. Watch your stream get smarter.</p>
            </div>
            <div className={styles.stepConnector} aria-hidden="true" />
            <div className={styles.step}>
              <div className={styles.stepNum}>04</div>
              <h3 className={styles.stepTitle}>Share the Signal</h3>
              <p className={styles.stepDesc}>Send your stream link. Your crew listens in real time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className={styles.testimonials}>
        <div className={styles.inner}>
          <header className={styles.sectionHead}>
            <span className={styles.label}>From the listeners</span>
            <h2 className={styles.sectionTitle}>The word on the street</h2>
          </header>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaInner}>
          <h2 className={styles.finalCtaTitle}>Ready to tune in?</h2>
          <p className={styles.finalCtaDesc}>
            Join Claq Radio and start broadcasting your taste in rock to the world.
          </p>
          <div className={styles.ctas}>
            <Link href="/signup" className={styles.ctaPrimary}>
              Start for Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/s/1" className={styles.ctaGhostLink}>
              Explore a Stream
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
