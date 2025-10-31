import { SparklesPreview } from "./HeroComponent"
import { MacbookScrollDemo } from "./ScrollBehaviour"
import { SideCallAiprl } from "./SideCallAiprl"
import { StickyScrollRevealDemo } from "./BenefitOfAiprl"
import { ExpandTeam } from "./ExpandTeam"
import { InfiniteMovingCardsDemo } from "./infiniteScroll"
import { Retails } from "./Retails"
// import { Testimony } from "./Testimony"
import { Pricing } from "./Pricing"
// import { Newsletter } from "../Newletters/NewsLetter"
// import ChatbotWidget from "../ChatBotChatRace/chatBot"
// import ChatbotDock from "../ChatbotComponents"
import { BlogPreview } from "./BlogPreview"

function index() {
  return (
    <div className="bg-black">
      <div className="max-w-full sm:max-w-full md:max-w-full lg:max-w-full xl:max-w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <section id="home" className="scroll-mt-28">
          <SparklesPreview />
          <SideCallAiprl />
        </section>
        <section id="products" className="scroll-mt-28">
          <MacbookScrollDemo />
        </section>
      </div>

      <section id="solutions" className="scroll-mt-28">
        <StickyScrollRevealDemo />
      </section>

      <section id="team" className="scroll-mt-28">
        <ExpandTeam />
      </section>

      <section id="company" className="scroll-mt-28">
        <InfiniteMovingCardsDemo />
      </section>

      <section id="Features" className="scroll-mt-28">
        <Retails />
      </section>

      <section id="pricing" className="scroll-mt-16">
        <Pricing />
      </section>
      {/* <Testimony /> */}
      <BlogPreview />

      {/* <section id="resources" className="scroll-mt-28">
        <Newsletter />
      </section> */}

      {/* <section id="contact" className="scroll-mt-28"> */}
        {/* <ChatbotWidget />  */}
        {/* <ChatbotDock /> */}
      {/* </section> */}
    </div>
  )
}

export default index