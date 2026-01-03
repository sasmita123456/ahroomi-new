"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaStar } from "react-icons/fa";
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline } from "react-icons/io5";
import { BiSolidQuoteAltRight } from "react-icons/bi";

import "swiper/css";
import "swiper/css/navigation";

import Image from "next/image";

import review1 from "../../../../public/assets/images/review1.png";
import review2 from "../../../../public/assets/images/review2.png";
import review3 from "../../../../public/assets/images/review3.png";
import review4 from "../../../../public/assets/images/review4.png";
import review5 from "../../../../public/assets/images/review5.png";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Priya Kumari",
      text: "The skincare products truly transformed my routine. The serum absorbs quickly and keeps my skin glowing throughout the day!",
      img: review1,
      rating: 5,
      date: "May 9, 2023",
      time: "10.30 PM",
    },
    {
      name: "Gaurav Khana",
      text: "I absolutely love their organic range! The moisturizer feels lightweight and has made my skin softer in just a few days.",
      img: review2,
      rating: 5,
      date: "June 15, 2023",
      time: "2.45 PM",
    },
    {
      name: "Riya Dey",
      text: "One of the best face creams I've used so far. My skin feels smooth and refreshed, and the fragrance is just perfect!",
      img: review3,
      rating: 4,
      date: "July 22, 2023",
      time: "11.20 AM",
    },
    {
      name: "John Carter",
      text: "The cleansing products work amazingly well! They removed oil and dirt gently without drying out my skin.",
      img: review4,
      rating: 5,
      date: "August 5, 2023",
      time: "4.15 PM",
    },
    {
      name: "Sarah Johnson",
      text: "These beauty products have become my everyday essentials. The quality is premium and results are clearly visible!",
      img: review5,
      rating: 4,
      date: "September 10, 2023",
      time: "9.30 AM",
    },
    {
      name: "Anjali Sharma",
      text: "Absolutely love the natural ingredients! My sensitive skin feels nourished and irritation-free for the first time.",
      img: review1,
      rating: 5,
      date: "October 18, 2023",
      time: "3.20 PM",
    },
    {
      name: "Rahul Verma",
      text: "The anti-aging serum works wonders! Visible reduction in fine lines within just two weeks of regular use.",
      img: review2,
      rating: 5,
      date: "November 5, 2023",
      time: "6.45 PM",
    },
    {
      name: "Neha Patel",
      text: "Perfect for my combination skin. Balances oil production while keeping dry areas hydrated all day long.",
      img: review3,
      rating: 4,
      date: "December 12, 2023",
      time: "1.30 PM",
    },
  ];

  return (
    <section className="pt-10">
      <div className="container mx-auto px-4">

         {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="title">
            Our Clients Say <span className="title_sub">ABOUT US</span>
          </h2>

          <div className="flex items-center gap-2">
            <button className="swiper-button-prev-custom text-4xl text-[#222] hover:text-[#22a6dd] transition-all duration-400">
              <IoArrowBackCircleOutline />
            </button>
            <button className="swiper-button-next-custom text-4xl text-[#222] hover:text-[#22a6dd] transition-all duration-400">
              <IoArrowForwardCircleOutline />
            </button>
          </div>
        </div>

        {/* SWIPER */}
        <Swiper
          modules={[Navigation, Autoplay]}
          loop={true}
          grabCursor={true}
          centeredSlides={false}
          slidesPerView={4}
          spaceBetween={24}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            480: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          className="testimonial-swiper"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="group relative h-full bg-white  rounded-2xl p-4 transition-all duration-500 shadow-lg hover:shadow-md border border-[#ccc] flex flex-col">
                
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <BiSolidQuoteAltRight className="text-6xl text-[#22a6dd]" />
                </div>

                {/* Profile Image */}
                <div className="flex justify-center -mt-14 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-r from-[#22a6dd] to-[#2dd4bf] rounded-full blur-md opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="relative rounded-full border-4 border-white shadow-lg z-10"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex justify-center gap-1 mb-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-base ${i < item.rating ? "text-[#dda701]" : "text-gray-300"}`}
                      />
                    ))}
                </div>

                {/* Testimonial Text */}
                <div className="grow">
                  <p className="text-gray-700 leading-relaxed text-center mb-3 line-clamp-4">
                    "{item.text}"
                  </p>
                </div>

                {/* Client Info */}
                <div className="text-center pt-3 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900 text-base mb-1">{item.name}</h4>
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                    <span>{item.date}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{item.time}</span>
                  </div>
                </div>

                {/* Bottom Decoration */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="w-6 h-6 bg-white rotate-45 transform border border-gray-100 rounded-sm shadow-sm"></div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

    
      </div>

      <style jsx global>{`
        .testimonial-swiper .swiper-slide {
          height: auto !important;
        }
        
        .swiper-slide {
          transition: opacity 0.4s ease;
        }
        .swiper-slide-active,
        .swiper-slide-next,
        .swiper-slide-prev {
          opacity: 1;
        }
        
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 96px;
        }
        
        @media (max-width: 768px) {
          .line-clamp-4 {
            min-height: 120px;
          }
        }
      `}</style>
    </section>
  );
}