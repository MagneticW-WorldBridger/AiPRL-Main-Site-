import { ArrowRight, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { showDemoModal } from '../../lib/demoModal'

export const SideCallAiprl = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop
            // Hide when scrolled more than 100px on mobile and tablet only
            if (window.innerWidth < 1024) {
                if (scrollTop > 100) {
                    setIsScrolled(true)
                    setIsVisible(false)
                } else {
                    setIsScrolled(false)
                    setIsVisible(true)
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleClick = () => {
        if (isScrolled) {
            setIsVisible(!isVisible)
        }
    }

    return (
        <>
            {/* Mobile & Tablet: Interactive button that hides on scroll */}
            <div className='lg:hidden'>
                {/* Hidden state - Arrow indicator */}
                {isScrolled && !isVisible && (
                    <div 
                        className='fixed left-0 z-40 top-[45%] cursor-pointer transition-all duration-300'
                        onClick={handleClick}
                    >
                        <div className='flex items-center justify-center w-4 h-32 bg-[#fd8a0d] hover:bg-black transition-all duration-300 rounded-r-full shadow-lg'>
                            <ChevronRight className='h-4 w-4 text-white' />
                        </div>
                    </div>
                )}

                {/* Visible state - Full button */}
                {!isScrolled || isVisible ? (
                    <div className='fixed -rotate-90 left-0 z-40 -ml-10 top-[45%] transition-all duration-300'>
                        <div className='flex border-2 border-black/80 shadow-2xl shadow-grey-500 bg-[#fd8a0d] hover:bg-black transition-all duration-300 px-4 py-2 cursor-pointer text-white rounded-full flex-col items-center justify-center gap-1' onClick={showDemoModal}>
                            <h1 className='text-sm flex items-center justify-center gap-2 text-white font-bold'>Book a Demo <span><ArrowRight className='h-3 w-3' /></span></h1>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Desktop: Original behavior - always visible */}
            <div className='hidden lg:block fixed -rotate-90 left-0 z-40 -ml-20 xl:-ml-24 top-[45%]'>
                <div className='flex border-2 border-black/80 shadow-2xl shadow-grey-500 bg-[#fd8a0d] hover:bg-black transition-all duration-300 px-10 xl:px-12 2xl:px-16 py-3 xl:py-4 cursor-pointer text-white rounded-full flex-col items-center justify-center gap-1 sm:gap-2' onClick={showDemoModal}>
                    <h1 className='text-lg xl:text-xl 2xl:text-2xl flex items-center justify-center gap-3 xl:gap-4 2xl:gap-5 text-white font-bold'>Book a Demo<span><ArrowRight className='h-4 w-4 xl:h-5 xl:w-5 2xl:h-6 2xl:w-6' /></span></h1>
                </div>
            </div>
        </>
    )
}
