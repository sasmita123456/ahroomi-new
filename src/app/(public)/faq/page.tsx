import InnerBanner from "../components/InnerBanner";
import innerBanner from "../../../../public/assets/images/innerBanner.webp";
import FaqDetails from "../components/FaqDetails";
import WhyChoose from "../components/WhyChoose";



export default function FaqPage() {
  return (
    <>
      <main>
         <InnerBanner title="FAQs" image={innerBanner} />
        <FaqDetails />
        <WhyChoose />
      </main>
    </>
  );
}