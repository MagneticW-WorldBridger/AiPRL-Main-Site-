import BlurText from "../ui/BlurText";
import Users from '../../assets/GraphicContent/User.png'
import { CheckCheck } from 'lucide-react';
import TextType from "../ui/TextTyping";

const handleAnimationComplete = () => {
  console.log('Animation completed!');
};

const handleButtonClick = () => {
  console.log('Button clicked!');
  // Add your button functionality here
};

export function ExpandTeam() {
  return (
    <>
      <div className="w-full bg-[#000000] py-4 sm:py-6 md:py-8 lg:py-16 flex flex-col items-center justify-center">
        <BlurText
          text="More SUPPORT. Less OVERHEAD. CONSISTENT results."
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-lg text-white/40 sm:text-xl md:text-2xl font-bold text-center mb-2 sm:mb-4 md:mb-6 px-4 sm:px-6"
        />

        <div className="bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent h-[2px] w-3/4 blur-sm mb-4 sm:mb-6 md:mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-8xl px-4 sm:px-6">
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[70dvh] mb-3 sm:mb-4 md:mb-6">
            {/* Background circle with gradient overlay */}
            {/* <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-white/80 via-gray-500/80 to-transparent rounded-full blur-xl" />
              <div className="absolute w-72 h-72 bg-gradient-to-tr from-gray-200/40 via-white/10 to-transparent rounded-full" />
            </div> */}

            {/* Main background shape */}
            {/* <div className="absolute top-1/2 right-1/2 transform -translate-y-1/2 w-[23dvw] h-full bg-gradient-to-br from-white/20 via-white/30 to-white/40 backdrop-blur" /> */}

            {/* Overlapping gradient effects */}
            {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-orange-200/30 via-transparent to-blue-100/20 rounded-full mix-blend-soft-light" /> */}

            {/* User image with blending */}
            {/* <div className="absolute top-0 right-1 h-full"> */}
              <img
                src={Users}
                alt="AiprlAssist"
                className="w-full rounded-2xl h-full object-contain opacity-[0.7]"
              />

              {/* Subtle overlay for better integration */}
              {/* <div className="absolute inset-0 bg-gradient-to-l rounded-2xl from-transparent via-white/5 to-gray-100/20 rounded-r-full" /> */}
            {/* </div> */}

            {/* Additional depth layers */}
            <div className="absolute bottom-4 left-8 w-32 h-32 bg-gradient-to-tr from-orange-300/20 to-transparent rounded-full blur-lg" />
            <div className="absolute top-8 right-16 w-24 h-24 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full blur-md" />
          </div>

          <div className="TextContent max-w-2xl items-center justify-center my-6 sm:my-8 md:my-12 lg:my-32 px-4 sm:px-6">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 mb-3 sm:mb-4">
              Expand your <TextType
                text={["Retail ", "Service ", "Admin "]}
                typingSpeed={50}
                pauseDuration={1500}
                showCursor={true}
                cursorClassName="text-green-500"
                cursorCharacter="|"
              /> <br />
              team instantly.
            </h3>
            <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg lg:text-xl">
              AiPRL Assist is like hiring a full sales, service, and admin team that never sleeps—so your rock stars can move faster, sell more, and actually focus on what grows the business.
            </p>
            <div className="ml-0 sm:ml-2 md:ml-4 lg:ml-10">
              <p className="text-gray-600 mt-3 sm:mt-4 md:mt-6 text-xs sm:text-sm md:text-base lg:text-lg">
                <CheckCheck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-green-500 inline-block mr-2" />AiPRL qualifies leads, schedules appointments, answers FAQs, and handles service requests—automatically—so your sales team stays focused on closing, not chasing.
              </p>
              <p className="text-gray-600 mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg">
                <CheckCheck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-green-500 inline-block mr-2" />AiPRL unifies chat, SMS, email, and phone into one smart inbox, cutting response times from hours to minutes—and delivering consistent, high-quality customer experiences every time.
              </p>
              <button 
                onClick={handleButtonClick}
                className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 lg:px-10 lg:py-3 mt-3 sm:mt-4 border border-black bg-transparent text-black dark:border-white dark:text-white relative group transition duration-200 hover:scale-105 active:scale-95 cursor-pointer text-xs sm:text-sm md:text-base lg:text-lg font-medium"
              >
                <div className="absolute -bottom-2 -right-2 bg-[#fd8a0d] h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200" />
                <span className="relative">
                  Unapologetic
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}