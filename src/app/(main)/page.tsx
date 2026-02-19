import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Featured from "@/components/home/Featured";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import GetUpdates from "@/components/home/GetUpdates";
import Faq from "@/components/home/Faq";

export const dynamic = "force-dynamic";


async function HomePage() {
  return (
    <div>
      <Hero/>
      <Categories />
      <Featured />
      <WhyChooseUs />
      <Faq />
      <GetUpdates />
    </div>
  )
}

export default HomePage
