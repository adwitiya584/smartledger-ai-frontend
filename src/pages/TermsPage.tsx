import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/register" className="glass p-2 rounded-xl text-slate-400 hover:text-white transition">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl balance-gradient flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Terms & Conditions</h1>
              <p className="text-slate-400 text-sm">Last updated: May 2026</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 space-y-6 text-slate-300 text-sm leading-relaxed">

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using Paisa Nest ("the App", "we", "us", or "our"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service. These terms apply to all users of the application.</p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">2. Description of Service</h2>
            <p>Paisa Nest is a personal finance management application that provides tools for tracking income, expenses, investments, loans, savings goals, and AI-powered financial insights. The service is intended for personal, non-commercial use only.</p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">3. User Accounts & Registration</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>You must provide accurate and complete information during registration</li>
              <li>Email verification via OTP is required for all new accounts</li>
              <li>You are responsible for maintaining the confidentiality of your password</li>
              <li>You must be at least 18 years of age to create an account</li>
              <li>One person may not maintain more than one account</li>
              <li>You are responsible for all activities that occur under your account</li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">4. Financial Data & Disclaimer</h2>
            <p className="mb-2">Paisa Nest is a <strong className="text-white">personal finance tracking tool</strong>, not a financial advisory service. Please note:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>All financial insights and AI-generated advice are for informational purposes only</li>
              <li>Tax calculations provided are indicative and not a substitute for professional CA advice</li>
              <li>We are not responsible for any financial decisions made based on data in the app</li>
              <li>Investment tracking does not constitute investment advice</li>
              <li>Always consult a certified financial advisor for major financial decisions</li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">5. Data Privacy & Security</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>All passwords are encrypted using BCrypt — we cannot access your password</li>
              <li>Your financial data is stored securely and is only accessible by you</li>
              <li>We do not sell, share, or rent your personal data to third parties</li>
              <li>We use industry-standard JWT tokens for authentication</li>
              <li>You can delete your account and all associated data at any time</li>
              <li>We use your email only for account verification and important notifications</li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">6. AI-Powered Features</h2>
            <p className="mb-2">Paisa Nest uses AI (Llama 3.3 via Groq) for financial insights. Please understand:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>AI responses are generated based on your transaction data</li>
              <li>AI suggestions are not guaranteed to be accurate or suitable for your situation</li>
              <li>Your financial data summaries may be processed by third-party AI services</li>
              <li>We do not store AI conversations permanently</li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">7. Subscription & Payments</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Free trial period is available for new users (24 hours)</li>
              <li>Subscription fees are non-refundable unless required by law</li>
              <li>We reserve the right to change pricing with 30 days notice</li>
              <li>Payments are processed securely via Razorpay</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">8. Prohibited Activities</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              <li>Use the app for any illegal or unauthorized purpose</li>
              <li>Attempt to reverse engineer or hack the application</li>
              <li>Share your account credentials with others</li>
              <li>Upload false or misleading financial information</li>
              <li>Use automated bots or scripts to access the service</li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">9. Account Termination</h2>
            <p>You may delete your account at any time from Settings → Delete Account. Upon deletion, all your personal data, transactions, investments, and financial records will be permanently removed from our servers within 24 hours. This action is irreversible.</p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">10. Limitation of Liability</h2>
            <p>Paisa Nest and its developers shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of the application, including but not limited to financial losses, data loss, or business interruption.</p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">11. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Changes will be notified via email or in-app notification. Continued use of the app after changes constitutes acceptance of new terms.</p>
          </div>

          <div>
            <h2 className="text-white font-semibold text-lg mb-2">12. Contact Us</h2>
            <p>For any questions about these Terms & Conditions, please contact us at:</p>
            <div className="mt-2 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-indigo-400 font-medium">Paisa Nest</p>
              <p className="text-slate-400">Email:paisanest442@gmail.com</p>
              <p className="text-slate-400">Governed by laws of India</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-center">
            <p className="text-slate-500 text-xs">
              By using Paisa Nest, you acknowledge that you have read, understood,
              and agree to be bound by these Terms & Conditions.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/register"
            className="balance-gradient text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition inline-block"
          >
            Back to Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;