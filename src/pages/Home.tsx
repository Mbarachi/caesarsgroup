import ServicesSection from "../components/ServicesSection"
import Hero from "../components/Hero"
import ShopSection from "../components/ShopSection"
import PartnersSection from "../components/PartnersSection"
import PricingSection from "../components/PricingSection"
import PayAsYouGoPromo from "../components/PayAsYouGoPromo"
import OpportunitySection from "../components/OpportunitySection"

const Home = () => {
  return (
    <div>
      <Hero />
      <OpportunitySection />
      <ServicesSection />
      <ShopSection />
      <PricingSection />
      <PartnersSection />
      <PayAsYouGoPromo />
    </div>
  )
}

export default Home