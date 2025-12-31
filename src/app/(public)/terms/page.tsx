import InnerBanner from "../components/InnerBanner";
import innerBanner from "../../../../public/assets/refundimg/refundbanner.png";
import TermsConditionsSection from "../components/TermsConditionsSection";



export default function TermsConditionsPage() {
  return (
    <>
      <main>
         <InnerBanner title="Terms & Conditions" image={innerBanner} />
         <TermsConditionsSection />
      
      </main>
    </>
  );
}