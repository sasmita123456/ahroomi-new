import InnerBanner from "../components/InnerBanner";
import innerBanner from "../../../../public/assets/refundimg/refundbanner.png";
import PrivacyPolicySection from "../components/PrivacyPolicySection";




export default function PrivacyPolicyPage() {
  return (
    <>
      <main>
         <InnerBanner title="Privacy Policy" image={innerBanner} />
        <PrivacyPolicySection />
      
      </main>
    </>
  );
}