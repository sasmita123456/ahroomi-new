import React from "react";
import Image from "next/image";

import policyBg from "../../../../public/assets/refundimg/refundimg1.jpg";

const TermsCondition = () => {
  return (
    <section className="relative w-full py-8 px-4 overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={policyBg}
          alt="Background"
          fill
          priority
          className="object-cover opacity-10"
        />
      </div>

      {/* Main Content Card */}
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-[#22a6dd]/30 p-4 md:p-6">

        <h1 className="text-2xl md:text-3xl font-semibold text-black mb-6 border-b border-[#22a6dd]/40 pb-4">
          TERMS & CONDITIONS
        </h1>

        <p className="text-gray-700 mb-2 leading-relaxed">
          These Terms of Use govern your use of the Ahroomi website and all services provided by the company.
          By accessing or using the Site, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Site.
        </p>

        <h2 className="text-xl font-semibold text-black mb-2">
          <span className="text-[#22a6dd]">1.</span> Acceptance of Terms
        </h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
          <li>By accessing or using the Site, you agree to comply with these Terms.</li>
          <li>These Terms may be updated from time to time without notice, and your continued use of the Site after any changes constitutes acceptance.</li>
          <li>It is your responsibility to review these Terms periodically.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black mb-2">
          <span className="text-[#22a6dd]">2.</span> Use of the Site
        </h2>
        <p className="text-gray-700 mb-4">
          <strong>User Conduct:</strong> You agree not to use the Services for any unlawful purpose or in a way that violates these Terms.
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Account:</strong> Some features may require you to create an account. You are responsible for your credentials and all activities under your account.
        </p>
        <p className="text-gray-700 mb-6">
          <strong>User Content:</strong> By submitting content, you grant the company a non-exclusive, royalty-free, perpetual right to use, modify, and display it.
        </p>

        <h2 className="text-xl font-semibold text-black mb-2">
          <span className="text-[#22a6dd]">3.</span> Shipping Policy
        </h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
          <li>Delivery Timeline: Minimum 5 days to Maximum 7 days.</li>
          <li>Shipping services within India only.</li>
          <li>We work with reputable carriers to ensure timely and secure delivery.</li>
          <li>During peak seasons, processing may take longer.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black mb-2">
          <span className="text-[#22a6dd]">4.</span> Intellectual Property
        </h2>
        <p className="text-gray-700 mb-4"><strong>Ownership:</strong> The Site and its original content are owned by Ahroomi and protected by intellectual property laws.</p>
        <p className="text-gray-700 mb-6"><strong>License:</strong> Ahroomi grants a limited, non-exclusive license to access and use the Site for personal, non-commercial purposes.</p>

        <h2 className="text-xl font-semibold text-black mb-2">
          <span className="text-[#22a6dd]">5.</span> Prohibited Conduct
        </h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
          <li>Use the Site in violation of any law.</li>
          <li>Engage in fraudulent, abusive, or illegal activity.</li>
          <li>Impersonate any person or entity.</li>
          <li>Transmit spam or unsolicited communications.</li>
          <li>Interfere with the operation of the Site or connected networks.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black mb-2">
          <span className="text-[#22a6dd]">6.</span> Limitation of Liability
        </h2>
        <p className="text-gray-700 mb-6">
          In no event shall Ahroomi, its directors, employees, or affiliates be liable for any indirect or consequential damages resulting from your use of the Site.
        </p>

        <h2 className="text-xl font-semibold text-black mb-2">
          <span className="text-[#22a6dd]">7.</span> Governing Law
        </h2>
        <p className="text-gray-700 mb-6">These Terms shall be governed by and construed in accordance with the laws of India.</p>

        <div className="mt-10 bg-[#22a6dd]/5 border border-[#22a6dd]/30 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-black mb-2">8. Contact Information</h2>
          <p className="text-gray-700 mb-2">If you have any questions about these Terms, please contact us at:</p>
          <p className="text-gray-700 mb-1"><strong>Contact No.:</strong> 9937291219</p>
          <p className="text-gray-700"><strong>Email:</strong> ahroomi@aashdit.com</p>
        </div>

      </div>
    </section>
  );
};

export default TermsCondition;
