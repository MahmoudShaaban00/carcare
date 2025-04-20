import React from "react";

const LegalInformation = () => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl max-w-4xl mx-auto mt-5">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Legal Information</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Welcome to the Legal Information section. Here, you will find all the essential details regarding your rights, responsibilities, and obligations as a user of our platform. By accessing or using this service, you acknowledge that you have read, understood, and agreed to our terms of service and privacy policy.
      </p>
      <p className="text-gray-600 leading-relaxed mb-4">
        Your privacy and data security are our top priorities. We comply with all relevant legal standards to ensure your personal information is handled responsibly. Please review our <span className="text-blue-500 cursor-pointer hover:underline">Privacy Policy</span> for more information about how we collect, use, and store your data.
      </p>
      <p className="text-gray-600 leading-relaxed mb-4">
        It is important to note that by using this platform, you agree not to engage in any activities that violate our <span className="text-blue-500 cursor-pointer hover:underline">Terms of Service</span>. This includes, but is not limited to, activities such as sharing inappropriate content, engaging in fraudulent transactions, or violating intellectual property rights.
      </p>
      <p className="text-gray-600 leading-relaxed">
        If you have any legal questions or need clarification about any of the policies, feel free to contact our support team at <span className="text-blue-500">support@yourwebsite.com</span>. Our team is here to help and ensure that your experience with us remains positive and compliant with the law.
      </p>
    </div>
  );
};

export default LegalInformation;
