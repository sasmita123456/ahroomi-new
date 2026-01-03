import InnerBanner from "../components/InnerBanner";
import innerBanner from "../../../../public/assets/blogimg/blogbanner.png";
import BlogDetailSection from "../components/BlogDetailSection";
import InstagramFeed from "../components/InstagramFeed";


export default function BlogPage() {
  return (
    <>
      <main>
         <InnerBanner title="Essential Oils: Pure Care for Mind & Body" image={innerBanner} />
         <BlogDetailSection />
         <InstagramFeed />
      
      </main>
    </>
  );
}