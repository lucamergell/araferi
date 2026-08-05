import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ShieldCheck, FileText } from 'lucide-react';

export const TermsOfServiceView: React.FC = () => {
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
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Official Terms</span>
        </div>
      </div>

      {/* Terms Card Document Container */}
      <div className="p-6 sm:p-10 rounded-3xl glass-card border border-purple-800/30 shadow-2xl space-y-8 text-purple-100/90 leading-relaxed">
        
        {/* Title Header */}
        <div className="border-b border-purple-800/40 pb-6 space-y-2">
          <div className="flex items-center gap-3 text-purple-400 mb-2">
            <FileText className="w-8 h-8 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-purple-300/80">Legal Document</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Padely Terms of Service
          </h1>
          <p className="text-xs text-purple-300/70 font-medium">
            <strong>Last Updated:</strong> August 5, 2026
          </p>
        </div>

        {/* 1. Acceptance of Terms */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            1. Acceptance of Terms
          </h2>
          <p className="text-sm text-purple-200/90">
            By creating an account, accessing, or using Padely, you agree to be bound by these Terms of Service. If you do not agree with these Terms, you may not use Padely.
          </p>
        </section>

        {/* 2. About Padely */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            2. About Padely
          </h2>
          <p className="text-sm text-purple-200/90">
            Padely is a platform that connects padel players, organizes matches, books padel courts, and provides player rankings, statistics, and community features.
          </p>
          <p className="text-sm text-purple-200/90">
            Padely is not a sports club, tournament organizer, or insurance provider.
          </p>
        </section>

        {/* 3. Eligibility */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            3. Eligibility
          </h2>
          <p className="text-sm text-purple-200/90">
            You must be at least 18 years old to create an account and participate in Padely matches.
          </p>
          <p className="text-sm text-purple-200/90">
            By creating an account, you confirm that the information you provide is accurate and truthful.
          </p>
        </section>

        {/* 4. User Accounts */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            4. User Accounts
          </h2>
          <p className="text-sm text-purple-200/90">
            Users sign in using their Google account.
          </p>
          <p className="text-sm text-purple-200/90">
            By creating an account, you authorize Padely to collect and store information including:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-purple-200/90">
            <li>Full name</li>
            <li>Google profile picture</li>
            <li>Age</li>
            <li>Skill level</li>
            <li>Match history</li>
            <li>Player statistics</li>
            <li>Information necessary to operate your account</li>
          </ul>
          <p className="text-sm text-purple-200/90 pt-2">
            By creating an account, you also agree that your first name and the first letter of your last name may be displayed publicly on rankings, statistics, leaderboards, match history, and other community features.
          </p>
          <div className="p-3.5 rounded-2xl bg-purple-950/50 border border-purple-800/40 text-xs text-purple-200/90 font-medium">
            <span className="text-purple-300 font-bold">Example:</span> <br />
            John Smith → <strong>John S.</strong>
          </div>
        </section>

        {/* 5. Match Participation */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            5. Match Participation
          </h2>
          <p className="text-sm text-purple-200/90">
            Padely creates and manages official matches.
          </p>
          <p className="text-sm text-purple-200/90">
            Players may reserve a place in a match by paying the applicable participation fee using one of the available payment methods.
          </p>
          <p className="text-sm text-purple-200/90">
            Available payment methods may include:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-purple-200/90">
            <li>Cash on site</li>
            <li>Bank transfer</li>
          </ul>
          <p className="text-sm text-purple-200/90 pt-1">
            Participation is confirmed only after payment has been successfully received when required.
          </p>
        </section>

        {/* 6. Cancellations */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            6. Cancellations
          </h2>
          <p className="text-sm text-purple-200/90">
            Players may cancel their participation only up to <strong>48 hours before the scheduled match start time</strong>.
          </p>
          <p className="text-sm text-purple-200/90">
            Cancellations made less than 48 hours before the match are not eligible for a refund unless required by applicable law or approved by Padely.
          </p>
        </section>

        {/* 7. Match Cancellation & Refunds */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            7. Match Cancellation & Refunds
          </h2>
          <p className="text-sm text-purple-200/90">
            If a match does not take place for any reason, including failure to reach the required number of players, Padely will issue a full refund. Exception: if a registered player does not show up to a match, then a refund can not be issued.
          </p>
          <p className="text-sm text-purple-200/90">
            Refunds are processed within <strong>7 business days</strong>.
          </p>
          <p className="text-sm text-purple-200/90">
            Weather conditions alone do not automatically result in cancellation. Unless Padely cancels the match, scheduled matches are considered playable.
          </p>
        </section>

        {/* 8. Rankings & Statistics */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            8. Rankings & Statistics
          </h2>
          <p className="text-sm text-purple-200/90">
            Padely provides rankings, ratings, leaderboards, and player statistics for entertainment and community purposes.
          </p>
          <p className="text-sm text-purple-200/90">
            Padely reserves the right to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-purple-200/90">
            <li>Modify ranking algorithms</li>
            <li>Correct inaccurate statistics</li>
            <li>Edit match results</li>
            <li>Recalculate rankings</li>
            <li>Reset rankings</li>
            <li>Remove fraudulent or invalid results</li>
          </ul>
          <p className="text-sm text-purple-200/90 pt-1">
            All ranking decisions made by Padely are final.
          </p>
        </section>

        {/* 9. User Conduct */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            9. User Conduct
          </h2>
          <p className="text-sm text-purple-200/90">
            Users agree to behave respectfully and honestly.
          </p>
          <p className="text-sm text-purple-200/90">
            The following conduct is prohibited:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-purple-200/90">
            <li>Harassment or abusive behavior</li>
            <li>Hate speech</li>
            <li>Threats</li>
            <li>Match fixing</li>
            <li>Cheating</li>
            <li>Fraudulent activity</li>
            <li>Creating multiple or fake accounts</li>
            <li>Impersonating another person</li>
            <li>Entering false match results</li>
            <li>Non-payment</li>
            <li>Any activity intended to manipulate rankings or statistics</li>
            <li>Any unlawful conduct</li>
          </ul>
        </section>

        {/* 10. Account Suspension */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            10. Account Suspension
          </h2>
          <p className="text-sm text-purple-200/90">
            Padely may suspend, restrict, or permanently terminate any account at its sole discretion for violations of these Terms or for conduct that may negatively affect the platform or its community.
          </p>
        </section>

        {/* 11. Health & Liability */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            11. Health & Liability
          </h2>
          <p className="text-sm text-purple-200/90">
            Participation in padel involves physical activity and inherent risks.
          </p>
          <p className="text-sm text-purple-200/90">
            Each participant is solely responsible for ensuring they are physically capable of participating.
          </p>
          <p className="text-sm text-purple-200/90">
            To the fullest extent permitted by applicable law, Padely is not responsible for:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-purple-200/90">
            <li>Personal injuries</li>
            <li>Medical expenses</li>
            <li>Property damage</li>
            <li>Lost or stolen belongings</li>
            <li>Accidents occurring before, during, or after a match</li>
            <li>Actions of other players</li>
            <li>Events beyond Padely's reasonable control</li>
          </ul>
          <p className="text-sm text-purple-200/90 pt-1">
            Participants join matches entirely at their own risk.
          </p>
        </section>

        {/* 12. Photography & Media */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            12. Photography & Media
          </h2>
          <p className="text-sm text-purple-200/90">
            Padely or its representatives may take photographs or videos during events.
          </p>
          <p className="text-sm text-purple-200/90">
            Players will always be asked for permission before photographs or videos are taken for promotional purposes.
          </p>
        </section>

        {/* 13. Privacy */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            13. Privacy
          </h2>
          <p className="text-sm text-purple-200/90">
            Padely processes personal information in accordance with its Privacy Policy.
          </p>
          <p className="text-sm text-purple-200/90">
            By using Padely, you consent to the collection and processing of the information described in these Terms and the Privacy Policy.
          </p>
        </section>

        {/* 14. Changes to These Terms */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            14. Changes to These Terms
          </h2>
          <p className="text-sm text-purple-200/90">
            Padely may update these Terms of Service from time to time.
          </p>
          <p className="text-sm text-purple-200/90">
            Updated versions become effective upon publication within the platform.
          </p>
          <p className="text-sm text-purple-200/90">
            Continued use of Padely after changes have been published constitutes acceptance of the updated Terms.
          </p>
        </section>

        {/* 15. Contact */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">
            15. Contact
          </h2>
          <p className="text-sm text-purple-200/90">
            If you have questions regarding these Terms of Service, you may contact Padely using the contact information provided within the application or on the official website.
          </p>
        </section>

      </div>
    </div>
  );
};
