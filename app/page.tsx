import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Destinations from '@/components/Destinations'
import Testimonials from '@/components/Testimonials'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import ChatBot from '@/components/ChatBot'
import MobileStickyCTA from '@/components/MobileStickyCTA'

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      {/* Skip to main content for screen readers */}
      <a
        href="#destinations"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-black focus:text-gold-400 focus:border focus:border-gold-500/50 focus:text-sm focus:font-body"
      >
        Skip to content
      </a>
      <Navbar />
      <Hero />
      <Destinations />
      <Testimonials />
      <CTA />
      <Footer />
      <ChatBot />
      <MobileStickyCTA />
    </main>
  )
}
