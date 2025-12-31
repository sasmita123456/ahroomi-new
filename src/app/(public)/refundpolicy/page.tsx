import InnerBanner from "../components/InnerBanner";
import innerBanner from "../../../../public/assets/refundimg/refundbanner.png";
import RefundSection from "../components/RefundSection";


export default function RefundPolicyPage() {
  return (
    <>
      <main>
         <InnerBanner title="Refund Policy" image={innerBanner} />
         <RefundSection />
      
      </main>
    </>
  );
}