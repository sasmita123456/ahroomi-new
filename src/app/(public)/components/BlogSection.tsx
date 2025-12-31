"use client";
import React, { useState } from "react";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";

// Dummy blog images (you can replace with actual images)
import blog1 from "../../../../public/assets/blogimg/bloginner1.jpg";
import blog2 from "../../../../public/assets/blogimg/bloginner2.jpg";
import blog3 from "../../../../public/assets/blogimg/bloginner3.jpg";
import blog4 from "../../../../public/assets/blogimg/bloginner4.jpg";
import blog5 from "../../../../public/assets/blogimg/bloginner5.jpg";
import blog6 from "../../../../public/assets/blogimg/bloginner6.jpg";
import blog7 from "../../../../public/assets/blogimg/bloginner7.jpg";
import blog8 from "../../../../public/assets/blogimg/bloginner8.jpg";
import blog9 from "../../../../public/assets/blogimg/bloginner9.jpg";
import blog10 from "../../../../public/assets/blogimg/bloginner10.jpeg";
import blog11 from "../../../../public/assets/blogimg/bloginner11.jpeg";
import blog12 from "../../../../public/assets/blogimg/bloginner12.jpeg";

// Create 18 items by repeating the 6 images
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
  {
    img: blog4,
    date: "10 April 2024",
    title: "Aroma Therapy:\nBalance Your Senses Naturally",
    desc: "Discover the calming power of aromatherapy blends that help reduce stress, uplift mood, and restore inner balance.",
  },
  {
    img: blog5,
    date: "08 April 2024",
    title: "Home Fragrances:\nA Touch of Comfort & Calm",
    desc: "Enhance your living spaces with soothing home fragrances that create a warm, relaxing, and peaceful environment.",
  },
  {
    img: blog6,
    date: "05 April 2024",
    title: "Self-Care Rituals:\nSmall Moments, Big Benefits",
    desc: "Simple self-care rituals using natural products that help you unwind, refresh, and feel your best every day.",
  },

 
  {
    img: blog7,
    date: "04 April 2024",
    title: "Essential Oils:\nPure Care for Mind & Body",
    desc: "Experience the goodness of natural essential oils that help relax the mind, improve mood, and support daily wellness.",
  },
  {
    img: blog8,
    date: "03 April 2024",
    title: "Body Mists:\nStay Fresh, Feel Confident",
    desc: "Light and refreshing body mists designed to keep you feeling fresh, confident, and beautifully scented all day long.",
  },
  {
    img: blog9,
    date: "02 April 2024",
    title: "Air Fresheners:\nRefresh Your Living Space",
    desc: "Create a pleasant and welcoming atmosphere with long-lasting air fresheners that eliminate unwanted odors.",
  },
  {
    img: blog10,
    date: "01 April 2024",
    title: "Aroma Therapy:\nBalance Your Senses Naturally",
    desc: "Discover the calming power of aromatherapy blends that help reduce stress, uplift mood, and restore inner balance.",
  },
  {
    img: blog11,
    date: "31 March 2024",
    title: "Home Fragrances:\nA Touch of Comfort & Calm",
    desc: "Enhance your living spaces with soothing home fragrances that create a warm, relaxing, and peaceful environment.",
  },
  {
    img: blog12,
    date: "30 March 2024",
    title: "Self-Care Rituals:\nSmall Moments, Big Benefits",
    desc: "Simple self-care rituals using natural products that help you unwind, refresh, and feel your best every day.",
  },

  
  {
    img: blog1,
    date: "29 March 2024",
    title: "Essential Oils:\nPure Care for Mind & Body",
    desc: "Experience the goodness of natural essential oils that help relax the mind, improve mood, and support daily wellness.",
  },
  {
    img: blog2,
    date: "28 March 2024",
    title: "Body Mists:\nStay Fresh, Feel Confident",
    desc: "Light and refreshing body mists designed to keep you feeling fresh, confident, and beautifully scented all day long.",
  },
  {
    img: blog3,
    date: "27 March 2024",
    title: "Air Fresheners:\nRefresh Your Living Space",
    desc: "Create a pleasant and welcoming atmosphere with long-lasting air fresheners that eliminate unwanted odors.",
  },
  {
    img: blog4,
    date: "26 March 2024",
    title: "Aroma Therapy:\nBalance Your Senses Naturally",
    desc: "Discover the calming power of aromatherapy blends that help reduce stress, uplift mood, and restore inner balance.",
  },
  {
    img: blog5,
    date: "25 March 2024",
    title: "Home Fragrances:\nA Touch of Comfort & Calm",
    desc: "Enhance your living spaces with soothing home fragrances that create a warm, relaxing, and peaceful environment.",
  },
  {
    img: blog6,
    date: "24 March 2024",
    title: "Self-Care Rituals:\nSmall Moments, Big Benefits",
    desc: "Simple self-care rituals using natural products that help you unwind, refresh, and feel your best every day.",
  },
];


  

const ITEMS_PER_PAGE = 6;

const BlogSection = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(blogData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBlogs = blogData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="w-full bg-white py-8">
      <div className="max-w-[1200px] mx-auto px-4">

      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentBlogs.map((item, index) => (
            <div key={index}>
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

              <h3 className="mt-5 text-[20px] font-semibold leading-[28px] text-[#111111] whitespace-pre-line">
                {item.title}
              </h3>

              <p className="mt-3 text-[14px] leading-[22px] text-[#7A7A7A]">
                {item.desc}
              </p>

              <a
                href="/blogdetails"
                className="group inline-flex items-center gap-2 mt-3 text-[14px] font-medium text-[#22a6dd] transition-colors duration-300 hover:text-green-600"
              >
                Read More
                <HiArrowRight className="text-[16px] transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-3 mt-12">
      
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-2 text-sm text-gray-500 disabled:opacity-40 hover:text-[#22a6dd]"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-full text-sm font-medium transition
                  ${
                    currentPage === page
                      ? "bg-[#22a6dd] text-white"
                      : "text-gray-600 hover:bg-[#f9c11c] hover:text-white"
                  }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-2 text-sm text-gray-500 disabled:opacity-40 hover:text-[#22a6dd]"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
