import { SparklesPreview } from './HeroComponent'
import { MacbookScrollDemo } from './ScrollBehaviour'
import { SideCallAiprl } from './SideCallAiprl'
import { StickyScrollRevealDemo } from './BenefitOfAiprl'
import { ExpandTeam } from './ExpandTeam'
import { InfiniteMovingCardsDemo } from './infiniteScroll'
import { Retails } from './Retails'
import { Testimony } from './Testimony'
import { Pricing } from './Pricing'
import { Newsletter } from '../Newletters/NewsLetter'
function index() {
  return (
    <div className=''>
      <div className='max-w-[95%] sm:max-w-[90%] mx-auto px-2 sm:px-11'>
        <SparklesPreview />
        <MacbookScrollDemo />
        <SideCallAiprl />
      </div>
      <StickyScrollRevealDemo />
      <ExpandTeam />
      <InfiniteMovingCardsDemo />
      <Retails />
      <Pricing />
      <Testimony />
      <Newsletter />
    </div>
  )
}

export default index