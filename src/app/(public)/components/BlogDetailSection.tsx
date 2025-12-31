"use client";
import React from "react";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";

import heroImg from "../../../../public/assets/blogimg/bloginner1.jpg";
import img1 from "../../../../public/assets/blogimg/bloginner2.jpg";
import img2 from "../../../../public/assets/blogimg/bloginner3.jpg";
import img3 from "../../../../public/assets/blogimg/bloginner4.jpg";

import blog1 from "../../../../public/assets/blogimg/bloginner1.jpg";
import blog2 from "../../../../public/assets/blogimg/bloginner2.jpg";
import blog3 from "../../../../public/assets/blogimg/bloginner3.jpg";

const blogData = [
  {
    img: blog1,
    date: "15 April 2024",
    title: "Essential Oils:\nPure Care for Mind & Body",
    desc: "Experience the goodness of natural essential oils that help relax the mind, improve mood, and support daily wellness.",
  },
  {
    img: blog2,
    date: "14 April 2024",
    title: "Body Mists:\nStay Fresh, Feel Confident",
    desc: "Light and refreshing body mists designed to keep you feeling fresh, confident, and beautifully scented all day long.",
  },
  {
    img: blog3,
    date: "12 April 2024",
    title: "Air Fresheners:\nRefresh Your Living Space",
    desc: "Create a pleasant and welcoming atmosphere with long-lasting air fresheners that eliminate unwanted odors.",
  },
];

const BlogDetailSection = () => {
  return (
    <>
      
      <section className="w-full bg-white py-10">
        <div className="max-w-[1100px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">

         
          <div className="lg:col-span-8">

           
            <div className="relative flex mb-6">

          
              <div className="hidden lg:flex flex-col items-center gap-3 mr-4 mt-24">
                <span className="text-xs font-semibold text-gray-600 mb-2">
                  SHARE
                </span>

                <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-[#22a6dd] hover:bg-[#22a6dd] hover:text-white transition">
                  <FaFacebookF className="text-sm" />
                </button>

                <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-[#22a6dd] hover:bg-[#22a6dd] hover:text-white transition">
                  <FaTwitter className="text-sm" />
                </button>

                <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-[#22a6dd] hover:bg-[#22a6dd] hover:text-white transition">
                  <FaLinkedinIn className="text-sm" />
                </button>
              </div>

             
              <div className="relative w-full h-[520px] rounded-3xl overflow-hidden">
                <Image
                  src={heroImg}
                  alt="Beauty Product"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs rounded-full border border-[#22a6dd] text-[#22a6dd]">
                Beauty
              </span>
              <span className="px-3 py-1 text-xs rounded-full border border-[#22a6dd] text-[#22a6dd]">
                Skincare
              </span>
            </div>

           
            <h1 className="text-[30px] md:text-[38px] font-semibold text-black leading-tight">
              The Ultimate Guide to Choosing the Right Skincare Routine
            </h1>

            <div className="text-sm text-gray-500 mt-2 mb-4">
              By Glow Beauty • 14 April 2024
            </div>

          
            <div className="space-y-4 text-[16px] leading-[30px] text-gray-700">

              <p>
                Building the right skincare routine is essential for maintaining
                healthy, radiant skin. With so many products available, choosing
                what truly works for your skin type can feel overwhelming.
              </p>

              <h3 className="text-[21px] font-semibold text-black">
                Understanding Your Skin Type
              </h3>

              <p>
                Identifying whether your skin is oily, dry, combination, or
                sensitive helps you select products that nourish without causing
                irritation or breakouts.
              </p>

             
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[img1, img2, img3].map((img, i) => (
                  <div
                    key={i}
                    className="relative h-[210px] rounded-2xl overflow-hidden border border-gray-200"
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>

              <h3 className="text-[21px] font-semibold text-black">
                Essential Skincare Steps
              </h3>

              <ul className="list-disc pl-6">
                <li>Gentle cleanser suited to your skin type</li>
                <li>Hydrating toner or essence</li>
                <li>Targeted serum for concerns</li>
                <li>Moisturizer to lock in hydration</li>
                <li>SPF for daytime protection</li>
              </ul>

            
              <div className="border border-[#22a6dd] rounded-2xl p-2 flex flex-col md:flex-row items-center justify-between gap-2 mt-2">
                <p className="text-lg font-medium text-black">
                  Discover glow-boosting skincare essentials
                </p>
                <button className="px-2 py-1 border border-[#22a6dd] text-[#22a6dd] rounded-full font-medium hover:bg-[#22a6dd] hover:text-white transition">
                  Shop Now
                </button>
              </div>

            </div>
          </div>

         
          <aside className="lg:col-span-4 space-y-7">

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h4 className="font-semibold text-black mb-4">
                Filter by Category
              </h4>
              <div className="flex flex-wrap gap-2">
                {["Skincare", "Makeup", "Haircare", "Wellness"].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 text-sm rounded-full border border-gray-300 text-gray-700 hover:border-[#22a6dd] hover:text-[#22a6dd] cursor-pointer transition"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h4 className="font-semibold text-black mb-4">
                Table of Contents
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="hover:text-[#22a6dd] cursor-pointer">
                  Understanding Skin Types
                </li>
                <li className="hover:text-[#22a6dd] cursor-pointer">
                  Essential Skincare Steps
                </li>
                <li className="hover:text-[#22a6dd] cursor-pointer">
                  Product Layering Tips
                </li>
                <li className="hover:text-[#22a6dd] cursor-pointer">
                  Morning & Night Routine
                </li>
                <li className="hover:text-[#22a6dd] cursor-pointer">
                  Glow Maintenance Tips
                </li>
              </ul>
            </div>

            <div className="relative h-[260px] rounded-2xl overflow-hidden border border-gray-200">
              <Image src={img2} alt="Promo" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6">
                <p className="text-white font-semibold text-lg">
                  Get Your Glow On
                </p>
                <button className="mt-3 w-fit px-5 py-2 border border-white text-white rounded-full text-sm hover:bg-white hover:text-black transition">
                  Shop Now
                </button>
              </div>
            </div>

          </aside>
        </div>
      </section>

     
      <section className="w-full bg-[#f9f9f9] py-12">
        <div className="max-w-[1200px] mx-auto px-4">

          <h2 className="text-[28px] md:text-[32px] font-semibold text-black mb-8">
            Latest Related News & Blogs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {blogData.map((item, index) => (
              <div key={index} className="bg-white rounded-[18px]">

                <div className="relative w-full h-[240px] rounded-[18px] overflow-hidden">
                  <Image src={item.img} alt={item.title} fill className="object-cover" />

                  <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2">
                    <div className="bg-white pt-[2px] rounded-t-md">
                      <div className="bg-[#22a6dd] text-white text-[13px] font-medium px-6 py-[6px] rounded-t-md">
                        {item.date}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-1 pb-4">
                  <h3 className="mt-5 text-[20px] font-semibold leading-[28px] whitespace-pre-line">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-[14px] leading-[22px] text-[#7A7A7A]">
                    {item.desc}
                  </p>

                  <a
                    href="/blogdetails"
                    className="group inline-flex items-center gap-2 mt-3 text-[14px] font-medium text-[#22a6dd]"
                  >
                    Read More
                    <HiArrowRight className="text-[16px] transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default BlogDetailSection;
