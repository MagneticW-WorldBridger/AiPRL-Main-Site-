import React, { useState } from 'react'
import { Check, Star, Globe } from 'lucide-react'
import { useCounterAnimation } from '../../hooks/useCounterAnimation'
import { ROICalculator } from './ROICalculator'
import { useChatContext } from '../../contexts/ChatContext'

interface PricingPlan {
    id: string
    name: string
    description: string
    monthlyPrice: number | string
    yearlyPrice: number | string
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
        description: 'Perfect for small teams and single storefronts getting started with the AiPRL AI Assistant.',
        monthlyPrice: 250,
        yearlyPrice: 2500, // 10% off
        features: [
            'Live chat with customers',
            'SMS powered by AI Assistant',
            'Voice support with AI Assistant',
            'AI-driven email replies',
        ],
        buttonText: 'Get Started',
        buttonVariant: 'outline'
    },
    {
        id: 'growth',
        name: 'Growth',
        description: 'Ideal for growing retailers managing multiple channels or locations.',
        monthlyPrice: 3000,
        yearlyPrice: 30000, // 10% off
        features: [
            'Everythng in Starter',
            'Advanced reporting and filters',
            'Priority customer support',
            'Multi-location support',
            'Integration with 3rd-party platforms'
        ],
        buttonText: 'Get Started',
        buttonVariant: 'primary',
        recommended: true,
        icon: <Star className="w-6 h-6 text-yellow-400" />
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Designed for large retail operations that need full customization and orchestration with the AiPRL AI Assistant.',
        monthlyPrice: "Custom Pricing",
        yearlyPrice: "Custom Pricing", // 10% off
        features: [
            'Everything in Growth',
            'Custom workflows and automation',
            'Advanced integrations',
            'End-to-end orchestration',
            'Dedicated onboarding and training'
        ],
        buttonText: 'Get Started',
        buttonVariant: 'outline',
        icon: <Globe className="w-6 h-6 text-blue-400" />
    }
]

interface MetricCardProps {
    value: number;
    prefix?: string;
    suffix?: string;
    color: string;
    label: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, prefix = '', suffix = '', color, label }) => {
    const { count, elementRef } = useCounterAnimation({
        end: value,
        prefix,
        suffix,
        duration: 2000
    });

    return (
        <div className="text-center" ref={elementRef}>
            <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${color} mb-2 sm:mb-3`}>
                {count}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">{label}</div>
        </div>
    );
};

export const Pricing = () => {
    const { openChatWithContext } = useChatContext();
    // const [isYearly, setIsYearly] = useState(true)
    const [isROICalculatorOpen, setIsROICalculatorOpen] = useState(false)

    const handleGetStarted = (planId: string, planName: string) => {
        console.log(`[Pricing] Get Started clicked for ${planName}`);
        openChatWithContext(
            `get_started_${planId}`,
            `I want to get started with the ${planName} plan!`
        );
    }

    // const formatPrice = (price: number) => {
    //     return new Intl.NumberFormat('en-US', {
    //         style: 'currency',
    //         currency: 'USD',
    //         minimumFractionDigits: 0
    //     }).format(price)
    // }

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

    return (<section id="pricing" className="scroll-mt-28 py-12 sm:py-14 md:py-16 lg:py-20 px-2 sm:px-4 bg-gradient-to-tr from-black via-black/10 to-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
        </div>

        <div className="max-w-7xl mx-auto relative">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-2 sm:px-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-600 mb-3 sm:mb-4">
                    Choose Your Plan
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                    Affordable and adaptable pricing to suit your goals.
                </p>

                {/* Toggle Switch */}
                {/* Billing toggle (segmented control) */}
                {/* <div className="flex items-center justify-center mb-8 sm:mb-10 md:mb-12"> */}
                    {/* <div className="relative inline-grid grid-cols-2 items-center cursor-pointer rounded-full bg-gray-900 px-1 h-12 sm:h-14 md:h-16 w-64 sm:w-80 md:w-96 lg:w-[400px] select-none"> */}
                        {/* Sliding pill (hidden toggle effect) */}
                        {/* <div
                            aria-hidden
                            className={`absolute inset-y-1 left-1 w-1/2 rounded-full bg-gray-700 transition-transform duration-300
                                ${isYearly ? 'translate-x-full' : 'translate-x-0'}`}
                        /> */}

                        {/* Monthly */}
                        {/* <button
                            type="button"
                            onClick={() => setIsYearly(false)}
                            className="relative cursor-pointer z-10 text-center font-medium text-xs sm:text-sm md:text-base rounded-full focus:outline-none w-full"
                            aria-pressed={!isYearly}
                        >
                            <span className={`${isYearly ? 'text-gray-400' : 'text-white/50'}`}>Bill monthly</span>
                        </button> */}

                        {/* Annually */}
                        {/* <button
                            type="button"
                            onClick={() => setIsYearly(true)}
                            className="relative cursor-pointer z-10 text-center font-medium text-xs sm:text-sm md:text-base rounded-full focus:outline-none w-full"
                            aria-pressed={isYearly}
                        >
                            <span className={`${isYearly ? 'text-gray-400' : 'text-white/50'}`}>Bill yearly</span>
                        </button> */}
                    {/* </div> */}

                    {/* Badge */}
                    {/* {isYearly && (
                        <span className="ml-3 bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
                            10% OFF
                        </span>
                    )} */}
                {/* </div> */}

            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto px-4 sm:px-6">
                {pricingPlans.map((plan) => {
                    if (plan.recommended) {
                        return (
                            <div key={plan.id} className="relative">
                                {/* Recommended Badge - Positioned outside BackgroundGradient */}

                                {/* <BackgroundGradient 
                                        className="rounded-[22px] p-4 sm:p-10 bg-white dark:bg-zinc-900"
                                    > */}
                                <div className="relative w-full bg-gray-900/40 h-full rounded-2xl shadow-lg border-2 border-gray-900 hover:shadow-blue-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 lg:scale-105">
                                    {/* Icon */}
                                    {plan.icon && (
                                        <div className="absolute top-6 right-6 opacity-20">
                                            {plan.icon}
                                        </div>
                                    )}
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30">
                                        <div className="bg-blue-600 whitespace-nowrap text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 sm:py-3 rounded-full flex items-center gap-2 shadow-lg">
                                            Recommended for you
                                        </div>
                                    </div>

                                    <div className="p-6 sm:p-8 lg:p-10 my-8 sm:my-10">
                                        {/* Plan Name */}
                                        <div className="mb-6 sm:mb-8">
                                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white/80 mb-3 sm:mb-4">
                                                {plan.name}
                                            </h3>
                                            <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">{plan.description}</p>
                                        </div>

                                        {/* Price */}
                                        {/* <div className="mb-8 sm:mb-10">
                                            <div className="flex items-baseline">
                                                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white/80">
                                                    {typeof (isYearly ? plan.yearlyPrice : plan.monthlyPrice) === 'string' 
                                                        ? (isYearly ? plan.yearlyPrice : plan.monthlyPrice)
                                                        : formatPrice((isYearly ? plan.yearlyPrice : plan.monthlyPrice) as number)
                                                    }
                                                </span>
                                                {typeof (isYearly ? plan.yearlyPrice : plan.monthlyPrice) === 'number' && (
                                                    <span className="text-gray-500 ml-2 text-xs sm:text-sm lg:text-base">
                                                        /{isYearly ? 'year' : 'month'}
                                                    </span>
                                                )}
                                            </div>
                                            {isYearly && typeof plan.monthlyPrice === 'number' && (
                                                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                                    Billed at {formatPrice(plan.monthlyPrice)}/ monthly
                                                </p>
                                            )}
                                        </div> */}

                                        {/* Features */}
                                        <ul className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start">
                                                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                                    <span className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Button */}
                                        <button
                                            onClick={() => handleGetStarted(plan.id, plan.name)}
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
                            <div className="relative bg-gray-900/40 rounded-2xl shadow-lg border-2 border-gray-900 shadow-gray-900/90 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                {/* Icon */}
                                {plan.icon && (
                                    <div className="absolute top-6 right-6 opacity-20">
                                        {plan.icon}
                                    </div>
                                )}

                                <div className="p-6 sm:p-8 lg:p-10">
                                    {/* Plan Name */}
                                    <div className="mb-6 sm:mb-8">
                                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white/80 mb-3 sm:mb-4">
                                            {plan.name}
                                        </h3>
                                        <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">{plan.description}</p>
                                    </div>

                                    {/* Price */}
                                    {/* <div className="mb-8 sm:mb-10">
                                        <div className="flex items-baseline">
                                            <span className="text-3xl sm:text-4xl lg:text-4xl font-bold text-white/80">
                                                {typeof (isYearly ? plan.yearlyPrice : plan.monthlyPrice) === 'string' 
                                                    ? (isYearly ? plan.yearlyPrice : plan.monthlyPrice)
                                                    : formatPrice((isYearly ? plan.yearlyPrice : plan.monthlyPrice) as number)
                                                }
                                            </span>
                                            {typeof (isYearly ? plan.yearlyPrice : plan.monthlyPrice) === 'number' && (
                                                <span className="text-gray-500 ml-2 text-xs sm:text-sm lg:text-base">
                                                    /{isYearly ? 'year' : 'month'}
                                                </span>
                                            )}
                                        </div>
                                        {isYearly && typeof plan.monthlyPrice === 'number' && (
                                            <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                                Billed at {formatPrice(plan.monthlyPrice)}/ monthly
                                            </p>
                                        )}
                                    </div> */}

                                    {/* Features */}
                                    <ul className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start">
                                                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                                <span className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Button */}
                                    <button
                                        onClick={() => handleGetStarted(plan.id, plan.name)}
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
                    {/* <span>✓ Cancel anytime</span> */}
                    <span>✓ 24/7 support</span>
                    <span>✓ 99.9% uptime</span>
                    <span>✓ SOC 2 certified</span>
                </div>
            </div>

            {/* ROI Calculator CTA */}
            {/* <div className="text-center mt-12">
                <div className="bg-gradient-to-r from-gray-900/40 to-gray-900/40 rounded-2xl p-8 max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-white/80 mb-4">
                        Not sure which plan is right for you?
                    </h3>
                    <p className="text-gray-600 mb-6">
                    Discover how much time and money the AiPRL AI Assistant could save your business. Get a custom ROI projection in seconds.
                    </p>
                    <button 
                        onClick={() => setIsROICalculatorOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
                    >
                        Calculate My ROI
                    </button>
                </div>
            </div> */}

            {/* Customer Success Metrics */}
            <div className="mt-16 sm:mt-20">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700 text-center mb-8 sm:mb-12 px-4">
                    Join 500+ retailers transforming customer experiences with AiPRL
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-4 sm:px-6">
                    <MetricCard 
                        value={40} 
                        suffix="%" 
                        prefix="+" 
                        color="text-blue-600" 
                        label="Average increase in conversions" 
                    />
                    <div className="text-center">
                        <div className="text-xl sm:text-2xl lg:text-2xl font-bold text-green-600 mb-2 sm:mb-3">
                            Instant Response
                        </div>
                        <div className="text-sm sm:text-base lg:text-base mt-2 sm:mt-4 text-gray-600 leading-relaxed">Average response time using the AI Assistant</div>
                    </div>
                    <MetricCard 
                        value={98} 
                        suffix="%" 
                        color="text-purple-600" 
                        label="Customer satisfaction score" 
                    />
                    <MetricCard 
                        value={50} 
                        prefix="$" 
                        suffix="K" 
                        color="text-orange-600" 
                        label="Average annual cost savings per client" 
                    />
                </div>
            </div>
        </div>

        {/* ROI Calculator Modal */}
        <ROICalculator 
            isOpen={isROICalculatorOpen} 
            onClose={() => setIsROICalculatorOpen(false)} 
        />
    </section>
    )
}