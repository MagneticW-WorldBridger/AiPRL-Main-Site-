"use client";
import { motion } from "framer-motion";
import { Users, Mail, ArrowRight, ThumbsUp, MapPin, Search, Star, CheckCircle, Building2, TrendingUp, Heart } from "lucide-react";

export default function Career() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#fd8a0d]/20 text-[#fd8a0d] text-sm font-medium px-4 py-2 rounded-full border border-[#fd8a0d]/30">
                <ThumbsUp className="w-4 h-4" />
                Work With The Best AI Platform
              </div>

              {/* Main Headline */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Find your dream job at{" "}
                  <span className="text-[#fd8a0d] underline decoration-4 decoration-[#fd8a0d]/50">
                    AiPRL Assist
                  </span>
                </h1>
                <p className="text-xl text-white/70 leading-relaxed">
                  Join our mission to revolutionize retail with AI-powered solutions. 
                  Make your career journey exciting with cutting-edge technology and 
                  meaningful impact. All in one place!
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#fd8a0d] hover:bg-[#fd8a0d]/90 text-black font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  Work With us 
                  {/* <ArrowRight className="w-5 h-5" /> */}
                </button>
                {/* <button 
                  onClick={() => {
                    const solutionsSection = document.getElementById('solutions');
                    if (solutionsSection) {
                      solutionsSection.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = '/#solutions';
                    }
                  }}
                  className="border border-white/20 hover:border-white/40 text-white font-semibold py-4 px-8 rounded-lg transition-colors cursor-pointer"
                >
                  Learn About Our Culture
                </button> */}
              </div>

              {/* Login Link */}
              <p className="text-sm text-white/60">
                Already have an account?{" "}
                <a href="mailto:careers@aiprlassist.com" className="text-[#fd8a0d] hover:text-[#fd8a0d]/80 font-medium cursor-pointer">
                  Contact us
                </a>
              </p>
            </motion.div>

            {/* Right Visual */}
            {/* <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-800 to-black border border-white/10 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-[#fd8a0d]/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium border border-[#fd8a0d]/30">
                  500+ Team Members
                </div>
                
                <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg p-4 shadow-lg max-w-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#fd8a0d] rounded-full"></div>
                    <div>
                      <p className="font-semibold text-sm">Sarah Johnson</p>
                      <p className="text-xs text-white/60">Senior AI Engineer</p>
                    </div>
                  </div>
                  <p className="text-sm italic">
                    "Amazing platform that gives you better career opportunities easily."
                  </p>
                </div>

                <div className="absolute top-4 left-4 bg-[#fd8a0d]/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium border border-[#fd8a0d]/30">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  0 Open Positions
                </div>
              </div>
            </motion.div> */}
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-900/40 border border-white/10 rounded-xl p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by role or department"
                  className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#fd8a0d] focus:border-transparent"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Location (Remote, Charlotte, NC)"
                  className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#fd8a0d] focus:border-transparent"
                />
              </div>
              <button className="bg-[#fd8a0d] hover:bg-[#fd8a0d]/90 text-black font-semibold py-3 px-8 rounded-lg transition-colors cursor-pointer">
                Search
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-white/60">
                Popular: <span className="text-[#fd8a0d]">Engineering</span>, <span className="text-[#fd8a0d]">Design</span>, <span className="text-[#fd8a0d]">Marketing</span>, <span className="text-[#fd8a0d]">Sales</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* No Available Positions Section */}
      <div className="bg-gray-900/40 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Current Openings</h2>
            <p className="text-lg text-white/70">Find the perfect role that matches your skills and passion</p>
          </motion.div>

          {/* No Jobs Available Card */}
          <div className="bg-gray-900/40 border border-white/10 rounded-2xl shadow-2xl p-12 text-center">
            {/* <div className="w-20 h-20 bg-[#fd8a0d]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#fd8a0d]/30">
              <Briefcase className="w-10 h-10 text-[#fd8a0d]" />
            </div> */}
            <h3 className="text-2xl font-bold text-white mb-4">No Open Positions Available</h3>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              We're not currently hiring, but we're always interested in connecting with talented individuals 
              who share our vision for the future of retail technology.
            </p>
            
            {/* Department Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { name: "Engineering", count: 0, icon: "💻" },
                { name: "Design", count: 0, icon: "🎨" },
                { name: "Marketing", count: 0, icon: "📈" },
                { name: "Sales", count: 0, icon: "💼" }
              ].map((dept, index) => (
                <div key={index} className="bg-black/50 rounded-lg p-4 border-2 border-dashed border-white/20">
                  <div className="text-2xl mb-2">{dept.icon}</div>
                  <p className="font-semibold text-white/80">{dept.name}</p>
                  <p className="text-sm text-white/60">{dept.count} positions</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="bg-black py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Why Join AiPRL Assist?</h2>
            <p className="text-lg text-white/70">Discover what makes us a great place to work</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <TrendingUp className="w-8 h-8" />, title: "Cutting-edge AI Technology", desc: "Work with the latest AI innovations" },
              { icon: <Heart className="w-8 h-8" />, title: "Impact Thousands", desc: "Help retailers worldwide succeed" },
              { icon: <Users className="w-8 h-8" />, title: "Collaborative Culture", desc: "Join a supportive, innovative team" },
              { icon: <Building2 className="w-8 h-8" />, title: "Remote-First", desc: "Work from anywhere in the world" },
              { icon: <Star className="w-8 h-8" />, title: "Great Benefits", desc: "Competitive compensation & perks" },
              { icon: <CheckCircle className="w-8 h-8" />, title: "Growth Opportunities", desc: "Advance your career with us" }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-gray-900/40 border border-white/10 rounded-xl p-6 text-center hover:shadow-2xl hover:border-[#fd8a0d]/30 transition-all"
              >
                <div className="text-[#fd8a0d] mb-4 flex justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-white/70">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Join Talent Network Section */}
      <div className="bg-[#fd8a0d] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-black"
          >
            <h2 className="text-3xl font-bold mb-4">Join Our Talent Network</h2>
            <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
              Be the first to know about new opportunities. Send us your information and we'll reach out when positions become available.
            </p>
            
            {/* Contact Form */}
            <div className="max-w-md mx-auto">
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/30"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/30"
                  />
                </div>
                <select className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/30">
                  <option value="">Select Area of Interest</option>
                  <option value="engineering">Engineering</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="operations">Operations</option>
                </select>
                <textarea
                  placeholder="Tell us about yourself and your interests"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/30 resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Join Talent Network
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-8 border-t border-black/20">
              <p className="text-black/80 mb-4">Questions about future opportunities?</p>
              <div className="flex items-center justify-center gap-2 text-black">
                <Mail className="w-5 h-5" />
                <a 
                  href="mailto:careers@aiprlassist.com" 
                  className="text-lg font-medium hover:text-black/80 transition-colors cursor-pointer"
                >
                  careers@aiprlassist.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
