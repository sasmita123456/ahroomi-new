import InnerBanner from "../components/InnerBanner";
import innerBanner from "../../../../public/assets/blogimg/blogbanner.png";
import BlogSection from "../components/BlogSection";

export default function BlogPage() {
  return (
    <>
      <main>
         <InnerBanner title="Blog" image={innerBanner} />
         <BlogSection />
      
      </main>
    </>
  );
}