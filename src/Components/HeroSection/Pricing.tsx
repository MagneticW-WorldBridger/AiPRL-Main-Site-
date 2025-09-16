import React, { useState } from 'react'
import { Check, Star, Globe } from 'lucide-react'

interface PricingPlan {
    id: string
    name: string
    description: string
    monthlyPrice: number
    yearlyPrice: number
    features: string[]
    buttonText: string
    buttonVariant: 'primary' | 'secondary' | 'outline'
    recommended?: boolean
    icon?: React.ReactNode
}

const pricingPlans: PricingPlan[] = [
    {
        id: 'starter',
        name: 'Starter',
        description: 'Perfect for single storefronts.',
        monthlyPrice: 250,
        yearlyPrice: 2500, // 10% off
        features: [
            'Chat with customers',
            'SMS with AI',
            'SMS with AI',
            'Voice with AI',
            'Email with AI'
        ],
        buttonText: 'Start with Starter',
        buttonVariant: 'outline'
    },
    {
        id: 'growth',
        name: 'Growth',
        description: 'Multi-location, more integrations.',
        monthlyPrice: 3000,
        yearlyPrice: 30000, // 10% off
        features: [
            'Everythng in Starter',
            'Advanced reporting & filters',
            'Priority support',
            'Multi-location support',
            'More integrations'
        ],
        buttonText: 'Start with Growth',
        buttonVariant: 'primary',
        recommended: true,
        icon: <Star className="w-6 h-6 text-yellow-400" />
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Custom, full orchestration.',
        monthlyPrice: 5000,
        yearlyPrice: 100000, // 10% off
        features: [
            'Everything in Growth',
            'Custom integrations & automation',
            'More integrations',
            'Custom orchestration',
            'Onboarding support'
        ],
        buttonText: 'Start with Enterprise',
        buttonVariant: 'outline',
        icon: <Globe className="w-6 h-6 text-blue-400" />
    }
]

export const Pricing = () => {
    const [isYearly, setIsYearly] = useState(true)

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price)
    }

    const getButtonStyles = (variant: string) => {
        switch (variant) {
            case 'primary':
                return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
            case 'secondary':
                return 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-200'
            default:
                return 'bg-transparent hover:bg-blue-50 text-blue-600 border-blue-200'
        }
    }

    return (
        <section className="py-12 sm:py-14 md:py-16 lg:py-20 px-2 sm:px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="max-w-7xl mx-auto relative">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-2 sm:px-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                        Choose Your Plan
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                        Affordable and adaptable pricing to suit your goals.
                    </p>

                    {/* Toggle Switch */}
                    {/* Billing toggle (segmented control) */}
                    <div className="flex items-center justify-center mb-8 sm:mb-10 md:mb-12">
                        <div className="relative inline-grid grid-cols-2 items-center cursor-pointer rounded-full bg-gray-100 px-1 h-12 sm:h-14 md:h-16 w-64 sm:w-80 md:w-96 lg:w-[400px] select-none">
                            {/* Sliding pill (hidden toggle effect) */}
                            <div
                                aria-hidden
                                className={`absolute inset-y-1 left-1 w-1/2 rounded-full bg-white transition-transform duration-300
        ${isYearly ? 'translate-x-full' : 'translate-x-0'}`}
                            />

                            {/* Monthly */}
                            <button
                                type="button"
                                onClick={() => setIsYearly(false)}
                                className="relative cursor-pointer z-10 text-center font-medium text-xs sm:text-sm md:text-base rounded-full focus:outline-none w-full"
                                aria-pressed={!isYearly}
                            >
                                <span className={`${isYearly ? 'text-gray-800' : 'text-black'}`}>Bill monthly</span>
                            </button>

                            {/* Annually */}
                            <button
                                type="button"
                                onClick={() => setIsYearly(true)}
                                className="relative cursor-pointer z-10 text-center font-medium text-xs sm:text-sm md:text-base rounded-full focus:outline-none w-full"
                                aria-pressed={isYearly}
                            >
                                <span className={`${isYearly ? 'text-black' : 'text-gray-800'}`}>Bill yearly</span>
                            </button>
                        </div>

                        {/* Badge */}
                        {isYearly && (
                            <span className="ml-3 bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
                                10% OFF
                            </span>
                        )}
                    </div>

                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
                    {pricingPlans.map((plan) => {
                        if (plan.recommended) {
                            return (
                                <div key={plan.id} className="relative">
                                    {/* Recommended Badge - Positioned outside BackgroundGradient */}

                                    {/* <BackgroundGradient 
                                        className="rounded-[22px] p-4 sm:p-10 bg-white dark:bg-zinc-900"
                                    > */}
                                    <div className="relative w-full h-full rounded-2xl shadow-lg border-2 border-blue-200 hover:shadow-blue-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 lg:scale-105">
                                        {/* Icon */}
                                        {plan.icon && (
                                            <div className="absolute top-6 right-6 opacity-20">
                                                {plan.icon}
                                            </div>
                                        )}
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30">
                                            <div className="bg-blue-600 whitespace-nowrap text-white text-sm font-medium px-4 py-4 rounded-full flex items-center gap-2 shadow-lg">
                                                Recommended for you
                                            </div>
                                        </div>

                                        <div className="p-6 my-10 sm:p-7 md:p-8">
                                            {/* Plan Name */}
                                            <div className="mb-4">
                                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                                    {plan.name}
                                                </h3>
                                                <p className="text-sm sm:text-base text-gray-600">{plan.description}</p>
                                            </div>

                                            {/* Price */}
                                            <div className="mb-6 sm:mb-8">
                                                <div className="flex items-baseline">
                                                    <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                                                        {formatPrice(isYearly ? plan.yearlyPrice : plan.monthlyPrice)}
                                                    </span>
                                                    <span className="text-gray-500 ml-2 text-sm sm:text-base">
                                                        /{isYearly ? 'year' : 'month'}
                                                    </span>
                                                </div>
                                                {isYearly && (
                                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                                        {formatPrice(plan.monthlyPrice)}/month billed annually
                                                    </p>
                                                )}
                                            </div>

                                            {/* Features */}
                                            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                                {plan.features.map((feature, featureIndex) => (
                                                    <li key={featureIndex} className="flex items-start">
                                                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* Button */}
                                            <button
                                                className={`w-full cursor-pointer py-3 px-4 sm:px-6 rounded-lg font-medium transition-all duration-200 border-2 text-sm sm:text-base ${getButtonStyles(
                                                    plan.buttonVariant
                                                )} hover:scale-105 active:scale-95`}
                                            >
                                                {plan.buttonText}
                                            </button>
                                        </div>
                                    </div>
                                    {/* </BackgroundGradient> */}
                                </div>
                            )
                        }

                        // Regular cards (Basic and Enterprise)
    return (
                            <div key={plan.id} className="relative">
                                <div className="relative bg-white rounded-2xl shadow-lg border-2 border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                    {/* Icon */}
                                    {plan.icon && (
                                        <div className="absolute top-6 right-6 opacity-20">
                                            {plan.icon}
                                        </div>
                                    )}

                                    <div className="p-6 sm:p-8">
                                        {/* Plan Name */}
                                        <div className="mb-4">
                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                                {plan.name}
                                            </h3>
                                            <p className="text-sm sm:text-base text-gray-600">{plan.description}</p>
                                        </div>

                                        {/* Price */}
                                        <div className="mb-6 sm:mb-8">
                                            <div className="flex items-baseline">
                                                <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                                                    {formatPrice(isYearly ? plan.yearlyPrice : plan.monthlyPrice)}
                                                </span>
                                                <span className="text-gray-500 ml-2 text-sm sm:text-base">
                                                    /{isYearly ? 'year' : 'month'}
                                                </span>
                                            </div>
                                            {isYearly && (
                                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                                    {formatPrice(plan.monthlyPrice)}/month billed annually
                                                </p>
                                            )}
                                        </div>

                                        {/* Features */}
                                        <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start">
                                                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Button */}
                                        <button
                                            className={`w-full cursor-pointer py-3 px-4 sm:px-6 rounded-lg font-medium transition-all duration-200 border-2 text-sm sm:text-base ${getButtonStyles(
                                                plan.buttonVariant
                                            )} hover:scale-105 active:scale-95`}
                                        >
                                            {plan.buttonText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

        {/* Additional Info */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
            All plans include 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 px-4">
            <span>✓ Cancel anytime</span>
            <span>✓ 24/7 support</span>
            <span>✓ 99.9% uptime</span>
            <span>✓ SSL encryption</span>
          </div>
        </div>

        {/* ROI Calculator CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Not sure which plan is right for you?
            </h3>
            <p className="text-gray-600 mb-6">
              Calculate your potential ROI and see how much AIPRL could save your business.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
              Calculate My ROI
            </button>
          </div>
        </div>

        {/* Customer Success Metrics */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Join 500+ retailers who've transformed their customer experience
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">40%</div>
              <div className="text-sm text-gray-600">Avg. Conversion Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">2 min</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">$50K</div>
              <div className="text-sm text-gray-600">Avg. Annual Savings</div>
            </div>
          </div>
        </div>
            </div>
        </section>
    )
}