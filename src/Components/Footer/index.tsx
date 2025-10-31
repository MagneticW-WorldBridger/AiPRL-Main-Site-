import { TextHoverEffect } from '../ui/text-hover-effect'
import { X, Linkedin, Youtube } from "lucide-react";
import { SocialIcon } from "../Navbar/SocialIcon";


// Declare DelveCookieConsent for TypeScript
declare global {
    interface Window {
        DelveCookieConsent: {
            show: () => void;
        };
    }
}

export const Footer = () => {
    return (
        <footer className="bg-black text-white py-12 sm:py-14 md:py-16 px-2 sm:px-4">
            <div className="max-w-7xl mx-auto">
                {/* Trust Badges */}
                {/* <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-8">Trusted & Secure</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-8 h-8" />
              </div>
              <div className="text-sm font-medium">SOC 2 Certified</div>
              <div className="text-xs text-gray-400">Enterprise Security</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-3">
                <Lock className="w-8 h-8" />
              </div>
              <div className="text-sm font-medium">GDPR Compliant</div>
              <div className="text-xs text-gray-400">Data Protection</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-sm font-medium">99.9% Uptime</div>
              <div className="text-xs text-gray-400">Reliability</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="text-sm font-medium">24/7 Support</div>
              <div className="text-xs text-gray-400">Always Available</div>
            </div>
          </div>
        </div> */}
                <div className="h-24 sm:h-32 md:h-48 lg:h-[20rem] flex items-center justify-center">
                    <TextHoverEffect text="AiPRL Assist" />
                </div>

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
                    <div>
                        <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">AiPRL Assist</h4>
                        <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                            The AI Customer Experience Platform that transforms storefront chaos into loyal customers.
                        </p>
                        <div className="text-xs sm:text-sm text-gray-400">
                            <div>Trusted by Leading Retailers</div>
                            <div>40% Avg. Conversion Increase</div>
                            <div>Instant Response</div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Product</h4>
                        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                            <li><a href="/#Features" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="/#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                            {/* <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li> */}
                            {/* <li><a href="#" className="hover:text-white transition-colors">API</a></li> */}
                            {/* <li><a href="#" className="hover:text-white transition-colors">Security</a></li> */}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Resources</h4>
                        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                            {/* <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li> */}
                            {/* <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li> */}
                            {/* <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li> */}
                            <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                            {/* <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li> */}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Company</h4>
                        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                            <li><a href="/#solutions" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="/careers" className="hover:text-white transition-colors">Work with us</a></li>
                            {/* <li><a href="#" className="hover:text-white transition-colors">Contact</a></li> */}
                            <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="/terms-and-conditions" className="hover:text-white transition-colors">Terms and Condition</a></li>
                        </ul>
                    </div>
                </div>
                {/* <div className="bigAiprlText text-center">
                    <h1 className='text-9xl text-center font-bold'>AiprlAssist</h1>
                </div> */}

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-6 sm:pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 md:mb-0">
                            © {new Date().getFullYear()} AiPRL Assist. All rights reserved.
                        </div>
                        <div className="flex text-white w-14 shrink-0 flex-col items-center justify-end gap-3 pb-4">
                            {/* <SocialIcon label="Twitter" href="#">
                                    <Twitter className="h-4 w-4 text-white" />
                                </SocialIcon>
                                <SocialIcon label="Instagram" href="#">
                                    <Instagram className="h-4 w-4 text-white" />
                                </SocialIcon> */}
                            <div className="flex items-center gap-2">
                                <SocialIcon label="LinkedIn" href="https://www.linkedin.com/company/aiprl-assist">
                                    <Linkedin className="h-4 w-4 text-white" />
                                </SocialIcon>
                                <SocialIcon label="YouTube" href="https://www.youtube.com/channel/UCSf5jpcJxL3AAxlak6l9Png">
                                    <Youtube className="h-4 w-4 text-white" />
                                </SocialIcon>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
                            <button
                                onClick={() => {
                                    if (typeof window !== 'undefined' && window.DelveCookieConsent) {
                                        window.DelveCookieConsent.show();
                                    }
                                }}
                                className="hover:text-white transition-colors duration-200 hover:underline"
                            >
                                Cookie Preferences
                            </button>
                            <span>Made for retailers</span>
                            {/* <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>All systems operational</span>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
