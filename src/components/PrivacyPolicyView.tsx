import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Lock, FileText } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  const { setCurrentView } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen text-white pb-28 sm:pb-24 pt-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Top Header / Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setCurrentView('landing')}
          className="px-4 py-2 rounded-2xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/40 text-purple-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-purple-400" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-purple-300/80 bg-purple-950/40 px-3 py-1.5 rounded-full border border-purple-800/30">
          <Lock className="w-4 h-4 text-purple-400" />
          <span>Privacy Policy</span>
        </div>
      </div>

      {/* Document Container */}
      <div className="p-6 sm:p-10 rounded-3xl glass-card border border-purple-800/30 shadow-2xl space-y-8 text-purple-100/90 leading-relaxed">
        
        {/* Title Header */}
        <div className="border-b border-purple-800/40 pb-6 space-y-2">
          <div className="flex items-center gap-3 text-purple-400 mb-2">
            <FileText className="w-8 h-8 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-purple-300/80">Legal Document</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Padely Privacy Policy
          </h1>
          <p className="text-xs text-purple-300/70 font-medium">
            <strong>Last Updated:</strong> August 5, 2026
          </p>
        </div>

        {/* 1. Introduction */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            1. Introduction
          </h2>
          <p className="text-sm text-purple-200/90">
            Welcome to Padely.
          </p>
          <p className="text-sm text-purple-200/90">
            This Privacy Policy explains how Padely collects, uses, stores, and protects your personal information when you use our platform.
          </p>
          <p className="text-sm text-purple-200/90">
            By creating an account or using Padely, you agree to the collection and use of your information as described in this Privacy Policy.
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            2. Information We Collect
          </h2>
          <p className="text-sm text-purple-200/90">
            When you create an account using Google Sign-In, we may collect:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-purple-200/90">
            <li>Full name</li>
            <li>Email address</li>
            <li>Google profile picture</li>
            <li>Google account identifier</li>
          </ul>
          <p className="text-sm text-purple-200/90 pt-2">
            Additionally, Padely may collect information you provide, including:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-purple-200/90">
            <li>Age</li>
            <li>Skill level</li>
            <li>Preferred playing position</li>
            <li>Profile information</li>
            <li>Match participation history</li>
            <li>Rankings</li>
            <li>Statistics</li>
            <li>Wins and losses</li>
            <li>Player achievements</li>
            <li>User preferences</li>
          </ul>
          <p className="text-sm text-purple-200/90 pt-2">
            We may also automatically collect technical information such as:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-purple-200/90">
            <li>Device information</li>
            <li>Browser type</li>
            <li>Operating system</li>
            <li>IP address</li>
            <li>Log data</li>
            <li>Date and time of access</li>
            <li>Usage analytics</li>
          </ul>
        </section>

        {/* 3. How We Use Your Information */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            3. How We Use Your Information
          </h2>
          <p className="text-sm text-purple-200/90">
            We use your information to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-purple-200/90">
            <li>Create and manage your account</li>
            <li>Organize padel matches</li>
            <li>Display player rankings and statistics</li>
            <li>Match players with suitable games</li>
            <li>Process bookings</li>
            <li>Communicate important match information</li>
            <li>Improve Padely and its features</li>
            <li>Detect fraud and abuse</li>
            <li>Enforce our Terms of Service</li>
            <li>Respond to customer support requests</li>
          </ul>
        </section>

        {/* 4. Public Information */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            4. Public Information
          </h2>
          <p className="text-sm text-purple-200/90">
            By creating an account, you agree that certain information may be publicly visible to other users.
          </p>
          <p className="text-sm text-purple-200/90">
            This includes:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-purple-200/90">
            <li>First name</li>
            <li>First letter of your last name</li>
            <li>Profile picture</li>
            <li>Skill level</li>
            <li>Rankings</li>
            <li>Match history</li>
            <li>Statistics</li>
            <li>Achievements</li>
          </ul>
          <div className="p-3.5 rounded-2xl bg-purple-950/50 border border-purple-800/40 text-xs text-purple-200/90 font-medium my-2">
            <span className="text-purple-300 font-bold">Example:</span> <br />
            John Smith will appear as <strong>John S.</strong>
          </div>
          <p className="text-sm text-purple-200/90">
            Your email address and other private account information will never be displayed publicly.
          </p>
        </section>

        {/* 5. Payments */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            5. Payments
          </h2>
          <p className="text-sm text-purple-200/90">
            Padely currently accepts payments through methods such as:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-purple-200/90">
            <li>Cash on site</li>
            <li>Bank transfer</li>
          </ul>
          <p className="text-sm text-purple-200/90 pt-1">
            Padely does not store bank card information or payment credentials.
          </p>
        </section>

        {/* 6. Data Sharing */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            6. Data Sharing
          </h2>
          <p className="text-sm text-purple-200/90">
            Padely does not sell your personal information.
          </p>
          <p className="text-sm text-purple-200/90">
            Your information may only be shared when necessary to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-purple-200/90">
            <li>Operate the platform</li>
            <li>Comply with legal obligations</li>
            <li>Protect the rights and safety of Padely or its users</li>
            <li>Prevent fraud or abuse</li>
          </ul>
          <p className="text-sm text-purple-200/90 pt-1">
            Service providers that help operate Padely may process data on our behalf under appropriate confidentiality and security obligations.
          </p>
        </section>

        {/* 7. Data Security */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            7. Data Security
          </h2>
          <p className="text-sm text-purple-200/90">
            Padely uses reasonable administrative, technical, and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.
          </p>
          <p className="text-sm text-purple-200/90">
            While we strive to protect your data, no online service can guarantee absolute security.
          </p>
        </section>

        {/* 8. Data Retention */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            8. Data Retention
          </h2>
          <p className="text-sm text-purple-200/90">
            We retain your information only as long as necessary to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-purple-200/90">
            <li>Provide our services</li>
            <li>Maintain rankings and match history</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce our agreements</li>
          </ul>
          <p className="text-sm text-purple-200/90 pt-1">
            When information is no longer required, it will be deleted or anonymized where reasonably practicable.
          </p>
        </section>

        {/* 9. Your Rights */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            9. Your Rights
          </h2>
          <p className="text-sm text-purple-200/90">
            Depending on applicable law, you may have the right to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-purple-200/90">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your account</li>
            <li>Request deletion of your personal data, subject to legal or operational requirements</li>
            <li>Withdraw consent where applicable</li>
          </ul>
          <p className="text-sm text-purple-200/90 pt-1">
            Some information, such as completed match history or rankings, may be retained where necessary to preserve the integrity of the platform or comply with legal obligations.
          </p>
        </section>

        {/* 10. Cookies and Analytics */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            10. Cookies and Analytics
          </h2>
          <p className="text-sm text-purple-200/90">
            Padely may use cookies and similar technologies to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-purple-200/90">
            <li>Keep you signed in</li>
            <li>Remember your preferences</li>
            <li>Improve performance</li>
            <li>Measure website usage</li>
            <li>Enhance user experience</li>
          </ul>
          <p className="text-sm text-purple-200/90 pt-1">
            You may disable cookies through your browser settings, although some features may no longer function properly.
          </p>
        </section>

        {/* 11. Children's Privacy */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            11. Children's Privacy
          </h2>
          <p className="text-sm text-purple-200/90">
            Padely is intended for individuals who are at least 18 years old.
          </p>
          <p className="text-sm text-purple-200/90">
            We do not knowingly collect personal information from anyone under the age of 18.
          </p>
          <p className="text-sm text-purple-200/90">
            If we become aware that an account belongs to someone under 18, we may remove the account and delete associated personal information.
          </p>
        </section>

        {/* 12. Photography and Media */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            12. Photography and Media
          </h2>
          <p className="text-sm text-purple-200/90">
            During Padely events, photographs or videos may be taken for promotional purposes.
          </p>
          <p className="text-sm text-purple-200/90">
            Players will always be asked for their permission before photographs or videos are taken or published.
          </p>
        </section>

        {/* 13. Changes to This Privacy Policy */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            13. Changes to This Privacy Policy
          </h2>
          <p className="text-sm text-purple-200/90">
            Padely may update this Privacy Policy from time to time.
          </p>
          <p className="text-sm text-purple-200/90">
            Updated versions become effective immediately upon publication on the website or within the application.
          </p>
          <p className="text-sm text-purple-200/90">
            Continued use of Padely after changes have been published constitutes acceptance of the updated Privacy Policy.
          </p>
        </section>

        {/* 14. Contact */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            14. Contact
          </h2>
          <p className="text-sm text-purple-200/90">
            If you have any questions regarding this Privacy Policy or your personal information, you may contact Padely using the contact information provided on the official website or within the application.
          </p>
        </section>

      </div>
    </div>
  );
};
