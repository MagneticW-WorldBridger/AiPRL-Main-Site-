import React, { useEffect, useMemo, useState } from 'react'
import NavbarDemo from './Components/Navbar'
import HeroComponent from './Components/HeroSection'
// import { ChatBot } from './Components/ChatBot/chatBot'
import { Footer } from './Components/Footer'
// import LiquidEther from './Components/ui/LiquidEther'
import { BlogPage } from './pages/blog/BlogPage'
import { DemoModal } from './Components/ui/DemoModal'
import { subscribeToDemoModal } from './lib/demoModal'

function App() {
  const pathname = useMemo(() => {
    if (typeof window === 'undefined') return '/'
    return window.location.pathname || '/'
  }, [])

  const isBlogRoute = pathname.startsWith('/blog')
  const [demoOpen, setDemoOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToDemoModal(({ open }) => {
      setDemoOpen(open)
    })
    return unsubscribe
  }, [])

  return (
    <div className='bg-black'>
      <NavbarDemo />
      {isBlogRoute ? <BlogPage /> : <HeroComponent />}
      {/* <ChatBot /> */}
      <Footer />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  )
}

export default App