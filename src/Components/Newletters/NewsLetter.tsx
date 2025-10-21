import React, { useState } from 'react'
import { Mail, Send, CheckCircle, ArrowRight } from 'lucide-react'
import { BackgroundGradient } from '../ui/background-gradient'

interface NewsletterFormData {
  email: string
  name?: string
}

export const Newsletter = () => {
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: '',
    name: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showNameField, setShowNameField] = useState(false)
  const [error, setError] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing again
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('') // Clear any previous errors

    try {
      // N8N Webhook URL from environment variable
      const webhookUrl = import.meta.env.VITE_NEWSLETTER_WEBHOOK_URL

      if (!webhookUrl) {
        throw new Error('Newsletter webhook URL is not configured')
      }

      // Prepare data to send
      const payload = {
        email: formData.email.trim(),
        name: formData.name?.trim() || '' // Send empty string if name not provided
      }

      // Send POST request to N8N webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      // Parse response
      const data = await response.json()

      // Check if request was successful
      if (response.ok && data.success !== false) {
        // Success!
        setIsSubmitted(true)
        setIsSubmitting(false)

        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({ email: '', name: '' })
          setShowNameField(false)
        }, 3000)
      } else {
        // Handle error from N8N
        const errorMessage = data.error || data.message || 'Failed to subscribe. Please try again.'
        setError(errorMessage)
        setIsSubmitting(false)
      }
    } catch (err) {
      // Handle network or other errors
      console.error('Newsletter subscription error:', err)
      setError('Network error. Please check your connection and try again.')
      setIsSubmitting(false)
    }
  }

  const benefits = [
    'Weekly AI retail insights and best practices',
    'Sneak peeks at upcoming features',
    'Early access to product updates',
    'Exclusive discounts and partner offers',
    'No spam. Unsubscribe anytime'
  ]

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
                <Mail className="w-4 h-4" />
                Newsletter
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Stay ahead with 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {' '}AI-powered
                </span>
                {' '}retail insights
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
              Join 10,000+ retail professionals who subscribe for expert tips, early product access, and exclusive offers from the team behind AiPRL’s AI Assistant.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Subscribers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="relative">
            <BackgroundGradient className="rounded-[22px] p-6 sm:p-8 bg-gray-900 dark:bg-zinc-900">
              <div className="bg-gray-900 rounded-2xl shadow-lg p-2 sm:p-8">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white/80 mb-2">
                      Join our retail AI community
                      </h3>
                      <p className="text-gray-600">
                      Get smarter with every issue. Enter your email to start receiving updates from the AiPRL team.
                      </p>
                    </div>

                    {/* Error Message Display */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                        <p className="text-sm font-medium">{error}</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border-b border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Subscribe for Insights"
                        />
                      </div>

                      {showNameField && (
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name (Optional)
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder="Enter your full name"
                          />
                        </div>
                      )}

                      {!showNameField && (
                        <button
                          type="button"
                          onClick={() => setShowNameField(true)}
                          className="text-sm cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Optional: Add your name for personalized updates
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Subscribe Now
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      By subscribing, you agree to our <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">privacy policy</a>. We respect your inbox.
                    </p>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Welcome aboard! 🎉
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Thank you for subscribing! Check your email for a confirmation message.
                    </p>
                    <div className="text-sm text-gray-500">
                      You'll receive your first update within 24 hours.
                    </div>
                  </div>
                )}
              </div>
            </BackgroundGradient>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full mb-8">
            <Send className="w-4 h-4" />
            Weekly updates every Tuesday
          </div>
        </div>
      </div>
    </section>
  )
}
