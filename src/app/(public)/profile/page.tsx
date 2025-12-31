import ProfileTab from "../components/ProfileTab";
import profileBg from "../../../../public/assets/images/profileBg.png";
import InnerBanner from "../components/InnerBanner";
import WhyChoose from "../components/WhyChoose";

export default function ProfilePage() {
  return (
    <>
      <main>
         <InnerBanner title="My Account" image={profileBg} />
         <ProfileTab />
         <WhyChoose />
      </main>
    </>
  );
}
