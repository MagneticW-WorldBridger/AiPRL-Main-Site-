import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import NavbarDemo from './Components/Navbar'
import HeroComponent from './Components/HeroSection'
import { Footer } from './Components/Footer'
import { BlogPage } from './pages/blog/BlogPage'
import PrivacyPolicy from './Components/Privacy-Policy/privacyPolicy'
import TermsAndCondition from './Components/TermsAndCondition/TermsAndCondition'
import Career from './Components/Career/Career'
import { DemoModal } from './Components/ui/DemoModal'
import { ScrollToTop } from './Components/ui/ScrollToTop'
import { subscribeToDemoModal } from './lib/demoModal'
import { AdminAuthProvider } from './Admin/context/AdminAuthContext'
import { AdminThemeProvider } from './Admin/context/AdminThemeContext'
import { AdminRouter } from './Admin/components/AdminRouter'
import { validateConfig } from './Admin/utils/config'
import { ChatProvider } from './contexts/ChatContext'

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
  const openChatRef = useRef<((context: string, message: string) => void) | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToDemoModal(({ open }) => {
      setDemoOpen(open)
    })
    return unsubscribe
  }, [])

  // Handle chat opening from buttons
  const handleOpenChat = useCallback((context: string, message: string) => {
    if (openChatRef.current) {
      openChatRef.current(context, message);
    } else {
      console.warn('[App] Chat not ready yet, retrying...');
      setTimeout(() => {
        if (openChatRef.current) {
          openChatRef.current(context, message);
        }
      }, 500);
    }
  }, [])

  // Scroll to top on page refresh and route change
  useEffect(() => {
    // Scroll to top immediately when component mounts (page refresh)
    window.scrollTo(0, 0)
    
    // Also scroll to top when pathname changes (route navigation)
    const handleRouteChange = () => {
      window.scrollTo(0, 0)
    }
    
    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange)
    
    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [pathname])

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
    <ChatProvider onOpenChat={handleOpenChat}>
      <div className='bg-black'>
        <NavbarDemo onChatReady={(openChat) => { openChatRef.current = openChat; }} />
        {isBlogRoute ? <BlogPage /> : isPrivacyRoute ? <PrivacyPolicy /> : isTermsRoute ? <TermsAndCondition /> : isCareerRoute ? <Career /> : <HeroComponent />}
        <Footer />
        <ScrollToTop />
        <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      </div>
    </ChatProvider>
  )
}


export default App