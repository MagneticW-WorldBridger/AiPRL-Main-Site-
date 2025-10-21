import { ArrowRight, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { showDemoModal } from '../../lib/demoModal'

export const SideCallAiprl = () => {
    const [hasReachedTestimony, setHasReachedTestimony] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isExiting, setIsExiting] = useState(false)
    const [mobileButtonToggled, setMobileButtonToggled] = useState(false)
    const testimonyRef = useRef<HTMLElement | null>(null)

    // Find testimony section on mount
    useEffect(() => {
        const findTestimonySection = () => {
            const testimonySection = document.querySelector('#customers') as HTMLElement
            if (testimonySection) {
                testimonyRef.current = testimonySection
            }
        }

        // Try to find immediately
        findTestimonySection()

        // If not found, try again after a short delay
        if (!testimonyRef.current) {
            const timer = setTimeout(findTestimonySection, 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    // Intersection Observer to detect when user reaches testimony section
    useEffect(() => {
        if (!testimonyRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // When testimony section comes into view (user reaches it)
                    if (entry.isIntersecting) {
                        if (!hasReachedTestimony) {
                            setHasReachedTestimony(true)
                            setIsExiting(false) // Reset exit state
                            // For desktop: auto-show button
                            // For mobile: only show arrow indicator, don't auto-show button
                            if (window.innerWidth >= 1024) { // Desktop
                                setTimeout(() => {
                                    setIsVisible(true)
                                    setIsAnimating(true)
                                    setTimeout(() => setIsAnimating(false), 500)
                                }, 300)
                            }
                        }
                    } else {
                        // When testimony section goes out of view (user scrolls away)
                        if (hasReachedTestimony) {
                            // Hide button when scrolling up past testimony section
                            if (entry.boundingClientRect.top > 0) {
                                // Add exit animation before hiding
                                setIsExiting(true)
                                setIsAnimating(false)
                                setTimeout(() => {
                                    setIsVisible(false)
                                    setHasReachedTestimony(false)
                                    setIsExiting(false)
                                    setMobileButtonToggled(false) // Reset mobile toggle state
                                }, 300) // Match animation duration
                            }
                        }
                    }
                })
            },
            {
                threshold: 0.3, // Trigger when 30% of the section is visible
                rootMargin: '0px 0px 0px 0px'
            }
        )

        observer.observe(testimonyRef.current)

        return () => {
            if (testimonyRef.current) {
                observer.unobserve(testimonyRef.current)
            }
        }
    }, [hasReachedTestimony])

    // Handle screen size changes
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                // Desktop: reset mobile toggle state
                setMobileButtonToggled(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleClick = () => {
        if (hasReachedTestimony) {
            if (window.innerWidth < 1024) { // Mobile
                setMobileButtonToggled(!mobileButtonToggled)
                if (!mobileButtonToggled) {
                    setIsVisible(true)
                    setIsAnimating(true)
                    setTimeout(() => setIsAnimating(false), 500)
                } else {
                    setIsExiting(true)
                    setTimeout(() => {
                        setIsVisible(false)
                        setIsExiting(false)
                    }, 300)
                }
            } else { // Desktop
                setIsVisible(!isVisible)
            }
        }
    }

    return (
        <>
            {/* Mobile & Tablet: Manual toggle button */}
            <div className='lg:hidden'>
                {/* Arrow indicator - Always show when testimony is reached */}
                {hasReachedTestimony && (
                    <div 
                        className='fixed left-0 z-40 top-[45%] cursor-pointer transition-all duration-300'
                        onClick={handleClick}
                    >
                        <div className={`flex items-center justify-center w-4 h-32 transition-all duration-300 rounded-r-full shadow-lg ${
                            mobileButtonToggled ? 'bg-black' : 'bg-[#fd8a0d] hover:bg-black'
                        }`}>
                            <ChevronRight className={`h-4 w-4 text-white transition-transform duration-300 ${
                                mobileButtonToggled ? 'rotate-180' : ''
                            }`} />
                        </div>
                    </div>
                )}

                {/* Full button - Only show when toggled */}
                {hasReachedTestimony && isVisible && mobileButtonToggled && (
                    <div className={`fixed -rotate-90 left-0 z-40 -ml-10 top-[45%] transform-gpu ${
                        isAnimating ? 'animate-bounce-in-left' : isExiting ? 'animate-slide-out-left' : ''
                    }`}>
                        <div className='flex border-2 border-black/80 shadow-2xl shadow-grey-500 bg-black transition-all duration-300 px-4 py-2 cursor-pointer text-white rounded-full flex-col items-center justify-center gap-1 hover:scale-105 active:scale-95' onClick={showDemoModal}>
                            <h1 className='text-sm flex items-center justify-center gap-2 text-white font-bold'>Book a Demo <span><ArrowRight className='h-3 w-3' /></span></h1>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop: Scroll-triggered button (same behavior as mobile) */}
            <div className='hidden lg:block'>
                {/* Hidden state - Arrow indicator (only show if user has reached testimony) */}
                {hasReachedTestimony && !isVisible && (
                    <div 
                        className='fixed left-0 z-40 top-[45%] cursor-pointer transition-all duration-300'
                        onClick={handleClick}
                    >
                        <div className='flex items-center justify-center w-4 h-32 bg-[#fd8a0d] hover:bg-black transition-all duration-300 rounded-r-full shadow-lg'>
                            <ChevronRight className='h-4 w-4 text-white' />
                        </div>
                    </div>
                )}

                {/* Visible state - Full button with popup animation */}
                {hasReachedTestimony && isVisible && (
                    <div className={`fixed -rotate-90 left-0 z-40 -ml-20 xl:-ml-24 top-[45%] transform-gpu ${
                        isAnimating ? 'animate-bounce-in-left' : isExiting ? 'animate-slide-out-left' : ''
                    }`}>
                        <div className='flex border-2 border-black/80 shadow-2xl shadow-grey-500 bg-black transition-all duration-300 px-10 xl:px-12 2xl:px-16 py-3 xl:py-4 cursor-pointer text-white rounded-full flex-col items-center justify-center gap-1 sm:gap-2 hover:scale-105 active:scale-95' onClick={showDemoModal}>
                            <h1 className='text-lg xl:text-xl 2xl:text-2xl flex items-center justify-center gap-3 xl:gap-4 2xl:gap-5 text-white font-bold'>Book a Demo<span><ArrowRight className='h-4 w-4 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6' /></span></h1>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
