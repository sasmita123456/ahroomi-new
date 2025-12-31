import InnerBanner from "../components/InnerBanner";
import profileBg from "../../../../public/assets/images/profileBg.png";
import OrderStatus from "../components/OrderStatus";



export default function TrackerPage() {
  return (
    <>
      <main>
        <InnerBanner title="Track Your Order" image={profileBg} />
        <OrderStatus />
      </main>
    </>
  );
}