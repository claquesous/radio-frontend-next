import Link from 'next/link'
import Image from 'next/image'
import styles from './styles.module.css'

export default function Home() {
  return (<div>
    Welcome to My Claqradio Rocks!

    <div>
      <Link href='/s/1'>Listen Now!</Link>
    </div>

    <section className={styles.hero}>
      <h1>Create Your Own Internet Radio Stream</h1>
      <p>Select songs, rate them, and share your unique stream with the world.</p>
      <a href="#" className="cta-button">Get Started</a>
    </section>

    <section id="features" className={styles.features}>
      <h2>Features</h2>
      <div className="feature">
        <Image src="/path/to/icon1.png" width="40" height="40" alt="Customizable Playlists" />
        <p>Create personalized playlists from our extensive music library. Whether you love rock, alternative rock, or punk rock, tailor your radio stream to match your unique taste. So long as your taste is rock because to be clear, we only have rock music.</p>
      </div>
      <div className="feature">
        <Image src="/path/to/icon2.png" width="40" height="40" alt="Song Rating System" />
        <p>Rate your favorite songs to influence what plays next. Our smart algorithm learns from your ratings to keep your stream fresh and exciting.</p>
      </div>
      <div className="feature">
        <Image src="/path/to/icon3.png" width="40" height="40" alt="Shareable Streams" />
        <p>Easily share your custom radio stream with friends and family. Spread the music you love through social media or direct links.</p>
      </div>
    </section>

    <section id="how-it-works" className={styles['how-it-works']}>
      <h2>How It Works</h2>
      <div className="step">
        <Image src="/path/to/step1.png" width="40" height="40" alt="Sign Up" />
        <p>Create an account is quick and easy. Get started today and dive into a world of music tailored just for you.</p>
      </div>
      <div className="step">
        <Image src="/path/to/step2.png" width="40" height="40" alt="Select Songs" />
        <p>Choose from thousands of tracks across various genres (of rock). Build a playlist that reflects your mood and style.</p>
      </div>
      <div className="step">
        <Image src="/path/to/step3.png" width="40" height="40" alt="Rate Songs" />
        <p>Rate songs as you listen to refine your stream. The more you rate, the better your recommendations will become.</p>
      </div>
      <div className="step">
        <Image src="/path/to/step4.png" width="40" height="40" alt="Stream & Share" />
        <p>Enjoy your custom radio stream anytime, anywhere. Share your unique playlist with friends and let them tune in to your personal radio station.</p>
      </div>
    </section>

    <section id="testimonials" className={styles.testimonials}>
      <h2>Testimonials</h2>
      <div className="testimonial">
        <p>&ldquo;I love how easy it is to create my own radio stream! The song recommendations get better the more I rate, and sharing my stream with friends is so much fun.&rdquo;</p>
        <div className="author">- User 1</div>
      </div>
      <div className="testimonial">
        <p>&ldquo;This platform has revolutionized how I listen to music. I can discover new tracks and enjoy my favorites all in one place. Highly recommend!&rdquo;</p>
        <div className="author">- User 2</div>
      </div>
    </section>
  </div>)
}

