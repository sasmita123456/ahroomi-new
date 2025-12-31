import React from "react";
import Image from "next/image";


import policyBg from "../../../../public/assets/refundimg/refundimg1.jpg";

const RefundSection = () => {
  return (
    <section className="relative w-full py-8 px-4  overflow-hidden">


    <div className="absolute inset-0 -z-10 overflow-hidden">
  <Image
    src={policyBg}
    alt="Background"
    fill
    priority
    className="object-cover opacity-10"
  />
</div>

     
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-[#22a6dd]/30 p-4 md:p-6">

         
        <h1 className="text-2xl md:text-3xl font-semibold text-black mb-6 border-b border-[#22a6dd]/40 pb-4">
          Returns, Refund & Cancellation Policy
        </h1>

        <p className="text-gray-700 mb-4 leading-relaxed">
          At Ahroomi, we aim to ensure your satisfaction with every purchase.
          This policy outlines the guidelines for returns, refunds, and order cancellations.
        </p>

       
        <h2 className="text-xl font-semibold text-black mb-2">
          <span className="text-[#22a6dd]">1.</span> Returns Policy
        </h2>

        <p className="text-gray-700 mb-2">
          We do not accept returns once an order has been delivered.
        </p>

        <p className="text-gray-700 mb-2">
          However, in exceptional cases, returns or exchanges may be allowed under the following conditions:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
          <li>
            <strong className="text-black">Incorrect Product Received:</strong>{" "}
            If the wrong product was delivered due to an error from our end.
          </li>
          <li>
            <strong className="text-black">Return/Exchange Request:</strong>{" "}
            Customers must initiate the process within 7 days of delivery.
          </li>
          <li>
            <strong className="text-black">Return Shipping Costs:</strong>{" "}
            The cost of return shipping must be borne by the customer.
          </li>
        </ul>

        
        <h2 className="text-xl font-semibold text-black mb-2">
          <span className="text-[#22a6dd]">2.</span> Refund Policy
        </h2>

        <p className="text-gray-700 mb-4">
          Refunds will be issued in the form of{" "}
          <span className="text-black font-medium">store points only</span>.
          No cash refunds will be provided.
        </p>

        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
          <li>
            <strong className="text-black">Product Unavailability:</strong>{" "}
            If the purchased product is unavailable after payment.
          </li>
          <li>
            <strong className="text-black">Damaged Product:</strong>{" "}
            Customers may be required to share images for verification.
          </li>
          <li>
            <strong className="text-black">Lost in Transit:</strong>{" "}
            If delivery remains incomplete due to transit loss.
          </li>
        </ul>

       
        <h2 className="text-xl font-semibold text-black mb-3">
          <span className="text-[#22a6dd]">3.</span> Order Cancellation Policy
        </h2>

        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
          <li>Ahroomi reserves the right to cancel any order at its discretion.</li>
          <li>Additional information may be required to process an order.</li>
          <li>Customers will be notified if an order is canceled  after payment.</li>
          <li>
            Refunds will be processed within{" "}
            <span className="text-black font-medium">5–7 working days</span>.
          </li>
        </ul>

        
        <div className="mt-10 bg-[#22a6dd]/5 border border-[#22a6dd]/30 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-black mb-3">
            4. Contact Information
          </h2>

          <p className="text-gray-700 mb-2">
            If you would like to contact Ahroomi Store:
          </p>

          <p className="text-gray-700">
            <strong className="text-black">Email:</strong>{" "}
            <span className="text-[#22a6dd]">ahroomi@aashdit.com</span>
          </p>

          <p className="text-gray-700">
            <strong className="text-black">Contact:</strong>{" "}
            <span className="text-[#22a6dd]">8327729174</span>
          </p>
        </div>

      </div>
    </section>
  );
};

export default RefundSection;
