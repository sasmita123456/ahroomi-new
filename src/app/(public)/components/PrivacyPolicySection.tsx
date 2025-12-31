import React from "react";
import Image from "next/image";

import policyBg from "../../../../public/assets/refundimg/refundimg1.jpg";

const PrivacyPolicySection = () => {
  return (
    <section className="relative w-full py-8 px-4 overflow-hidden">

      {/* Subtle background image */}
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
          Privacy Policy
        </h1>

        <h2 className="text-xl font-semibold text-black mb-3">1. Introduction</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Welcome to Ahroomi, a brand owned and operated by Aashdit Nutritech ("Company," "we," "our," or "us"). We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </p>
        <p className="text-gray-700 mb-6 leading-relaxed">
          By accessing or using our website, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with this policy, please do not use our services.
        </p>

        <h2 className="text-xl font-semibold text-black mb-3">2. Information We Collect</h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
          <li>Personal Information: Name, email, phone number, shipping/billing address.</li>
          <li>Payment details (processed securely through third-party payment gateways).</li>
          <li>Account login credentials (if applicable).</li>
          <li>Non-Personal Information: IP address, browser type, OS, browsing behavior.</li>
          <li>Cookies and tracking technologies for analytics and website improvements.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black mb-3">3. How We Use Your Information</h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
          <li>To process and fulfill your orders.</li>
          <li>To provide customer support and respond to inquiries.</li>
          <li>To improve website functionality, content, and user experience.</li>
          <li>To send promotional emails, newsletters, and marketing messages (with your consent).</li>
          <li>To comply with legal and regulatory requirements.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black mb-3">4. Sharing and Disclosure of Information</h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
          <li>We do not sell, trade, or rent your personal information.</li>
          <li>Service Providers: Third-party vendors who assist with order fulfillment, payments, shipping, and marketing.</li>
          <li>Legal Compliance: If required by law, we may disclose information to law enforcement or government authorities.</li>
          <li>Business Transfers: In case of a merger, sale, or acquisition, your information may be transferred to the new entity.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black mb-3">5. Cookies and Tracking Technologies</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          We use cookies and similar tracking technologies to enhance your experience. You can manage cookie preferences through your browser settings.
        </p>

        <h2 className="text-xl font-semibold text-black mb-3">6. Data Security</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          We are committed to ensuring that your information is secure. To prevent unauthorized access or disclosure, we have put in place suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect online.
        </p>

        <h2 className="text-xl font-semibold text-black mb-3">7. Your Rights & Choices</h2>
        <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
          <li>Access, update, or delete your personal information.</li>
          <li>Opt-out of marketing communications.</li>
          <li>Restrict or object to data processing under certain circumstances.</li>
          <li>To exercise your rights, please contact us at <span className="text-[#22a6dd]">ahroomi@aashdit.com</span>.</li>
        </ul>

        <h2 className="text-xl font-semibold text-black mb-3">8. Third-Party Links</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.
        </p>

        <h2 className="text-xl font-semibold text-black mb-3">9. Updates to This Privacy Policy</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          We may update this policy from time to time. Changes will be posted on this page with a revised "Last Updated" date.
        </p>

        <h2 className="text-xl font-semibold text-black mb-3">10. Contact Us</h2>
        <p className="text-gray-700 mb-1"><strong>Email:</strong> <span className="text-[#22a6dd]">ahroomi@aashdit.com</span></p>
        <p className="text-gray-700 mb-6">By using our website, you consent to this Privacy Policy.</p>

      </div>
    </section>
  );
};

export default PrivacyPolicySection;
