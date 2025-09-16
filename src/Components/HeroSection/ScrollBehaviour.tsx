import { MacbookScroll } from "../ui/mackbook-scroll";
import AiprlLogo from '../../assets/AiprlLogo.svg'

export function MacbookScrollDemo() {
  return (
    <div className="w-full top-2 sm:top-3 md:top-4 overflow-hidden bg-white dark:bg-[#0B0B0F] px-2 sm:px-3 md:px-4">
      <MacbookScroll
        badge={
          <div className="relative z-40">
            <img 
              src={AiprlLogo} 
              alt="AiprlLogo" 
              className="h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-6 lg:w-6 xl:h-8 xl:w-8 rounded-full bg-white p-0.5 sm:p-1 md:p-1.5 shadow-md ring-1 sm:ring-2 ring-gray-300 transition-transform duration-300 hover:scale-110" 
            />
            <div className="absolute -inset-0.5 sm:-inset-1 md:-inset-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-50 sm:opacity-65 md:opacity-75 blur-sm" />
          </div>
        }
        src={`/linear.webp`}
        showGradient={false}
      />
    </div>
  );
}
