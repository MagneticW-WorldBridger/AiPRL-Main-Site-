"use client";
import { SparklesCore } from "../ui/sparkles";
import { Phone, Star, TrendingUp, Clock, Shield } from "lucide-react";

export function SparklesPreview() {
  return (
    <>
      <div className="grid grid-cols-1 mt-8 sm:mt-24 md:mt-[3rem] lg:mt-[4rem]">
        <div className=" w-full col-span-2 flex flex-col items-center justify-center overflow-hidden">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
            Trusted by 500+ retailers
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-center text-white/70 relative z-20 px-4 sm:px-6 md:px-8">
            Turn storefront chaos into loyal customers with the AI Customer Experience Platform.
          </h1>

          <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[85%] mt-4 sm:mt-8 md:mt-6 mb-3 relative px-4 sm:px-6 md:px-8">
            <p className="text-center px-0 sm:px-4 md:px-8 lg:px-16 xl:px-32 mt-4 sm:mt-6 text-xs sm:text-base md:text-lg lg:text-xl font-semibold text-white/70 relative z-20">
              AiPRL unifies chat, SMS, voice, and email into one intelligent system—helping brick-and-mortar retailers convert more leads and retain more customers.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 mt-4 sm:mt-4 mb-4 sm:mb-6 px-4 sm:px-6">
            <div className="flex items-center justify-center gap-2 text-white/70">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="font-semibold text-sm sm:text-base md:text-lg">40% increase in conversions</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/70">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="font-semibold text-sm sm:text-base md:text-lg">2 min response time</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/70">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              <span className="font-semibold text-sm sm:text-base md:text-lg">SOC 2 certified</span>
            </div>
          </div>

          <div className="w-[90%] sm:w-[80%] md:w-[75%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] h-16 sm:h-20 md:h-22 lg:h-32 relative rounded-b-2xl">
            {/* Gradients */}
            <div className="absolute inset-x-4 sm:inset-x-8 md:inset-x-16 lg:inset-x-20 top-0 bg-gradient-to-r from-transparent via-[#fd8a0d] to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-4 sm:inset-x-8 md:inset-x-16 lg:inset-x-20 top-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-16 sm:inset-x-32 md:inset-x-48 lg:inset-x-60 top-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-16 sm:inset-x-32 md:inset-x-48 lg:inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

            {/* Core component */}
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1500}
              className="w-full h-full rounded-b-2xl"
              particleColor="#fd8a0d"
            />

            {/* Radial Gradient to prevent sharp edges */}
            <div className="absolute inset-0 w-full h-full bg-transparent [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,black)]"></div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6 sm:mt-20 w-full sm:w-auto px-4 sm:px-6">
            <div className="relative group">
              {/* Moving border */}
              <div className="absolute -inset-1.5 rounded-full overflow-hidden">
                <div className="absolute inset-0 rounded-full border-2 border-transparent">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#fd8a0d] to-transparent animate-spin-slow"></div>
                </div>
              </div>

              {/* Button */}
              <button
                type="button"
                className="relative w-full py-3 sm:py-4 md:py-4 flex items-center justify-center sm:w-auto bg-black hover:bg-[#fd8a0d] cursor-pointer hover:text-black transition-all duration-300 text-lg sm:text-xl md:text-2xl font-bold rounded-full dark:bg-slate-900 text-white/70 dark:text-white/70 border-neutral-200 dark:border-slate-800 px-6 sm:px-8 md:px-10"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-3 sm:mr-5 md:mr-6" />
                Talk to Aiprl
              </button>
            </div>
            {/* <button className="w-auto sm:w-auto text-center bg-transparent text-white/70 px-4 sm:px-6 md:px-8 lg:px-10 border-2 rounded-full border-gray-300 hover:border-gray-400 py-2 sm:py-3 md:py-4 flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg lg:text-xl font-semibold transition-all duration-300">
              Test on your website
            </button> */}
          </div>

          {/* Trust Indicators */}
          {/* <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">14-day free trial • No credit card required</p>
            <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
              <span>✓ 24/7 Support</span>
              <span>✓ 99.9% Uptime</span>
              <span>✓ GDPR Compliant</span>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}

