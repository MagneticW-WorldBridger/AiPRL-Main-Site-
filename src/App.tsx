import { useEffect, useMemo, useState } from 'react'
import NavbarDemo from './Components/Navbar'
import HeroComponent from './Components/HeroSection'
// import { ChatBot } from './Components/ChatBot/chatBot'
import { Footer } from './Components/Footer'
// import LiquidEther from './Components/ui/LiquidEther'
import { BlogPage } from './pages/blog/BlogPage'
import PrivacyPolicy from './Components/Privacy-Policy/privacyPolicy'
import TermsAndCondition from './Components/TermsAndCondition/TermsAndCondition'
import Career from './Components/Career/Career'
import { DemoModal } from './Components/ui/DemoModal'
import { subscribeToDemoModal } from './lib/demoModal'
import { AdminAuthProvider } from './Admin/context/AdminAuthContext'
import { AdminThemeProvider } from './Admin/context/AdminThemeContext'
import { AdminRouter } from './Admin/components/AdminRouter'
import { validateConfig } from './Admin/utils/config'

function App() {
  const pathname = useMemo(() => {
    if (typeof window === 'undefined') return '/'
    return window.location.pathname || '/'
  }, [])

  const isBlogRoute = pathname.startsWith('/blog')
  const isAdminRoute = pathname.startsWith('/admin')
  const isPrivacyRoute = pathname.startsWith('/privacy-policy')
  const isTermsRoute = pathname.startsWith('/terms-and-conditions')
  const isCareerRoute = pathname.startsWith('/careers')
  const [demoOpen, setDemoOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToDemoModal(({ open }) => {
      setDemoOpen(open)
    })
    return unsubscribe
  }, [])

  // Admin routes
  if (isAdminRoute) {
    try {
      validateConfig();
      return (
        <AdminThemeProvider>
          <AdminAuthProvider>
            <AdminRouter />
          </AdminAuthProvider>
        </AdminThemeProvider>
      )
    } catch (error) {
      console.error('Configuration Error:', error);
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
            <p className="text-red-400 mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
            <p className="text-gray-400 text-sm">Please check your .env file</p>
          </div>
        </div>
      );
    }
  }

  // Main app routes
  return (
    <div className='bg-black'>
      <NavbarDemo />
      {isBlogRoute ? <BlogPage /> : isPrivacyRoute ? <PrivacyPolicy /> : isTermsRoute ? <TermsAndCondition /> : isCareerRoute ? <Career /> : <HeroComponent />}
      {/* <ChatBot /> */}
      <Footer />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  )
}


export default App