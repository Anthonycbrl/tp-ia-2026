import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Destinations from '@/components/Destinations'
import Testimonials from '@/components/Testimonials'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import ChatBot from '@/components/ChatBot'

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <Hero />
      <Destinations />
      <Testimonials />
      <CTA />
      <Footer />
      <ChatBot />
    </main>
  )
}
