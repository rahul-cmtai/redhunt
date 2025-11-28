import Navbar from '../components/navbar'
import Footer from '../components/footer'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-red-600 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700 font-medium">Privacy Policy</span>
        </nav>

        {/* Heading */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            This Privacy Policy explains how Red-Flagged Technologies Pvt. Ltd. (&quot;Red-Flagged&quot;, &quot;we&quot;, &quot;us&quot;)
            collects, uses, and protects information when you use our platform.
          </p>
        </header>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
            <p className="text-slate-700 mb-2">
              We collect information that you provide directly to us, such as when you create an account, submit
              candidate records, or contact us for support. This may include:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>Employer account details (name, work email, company details).</li>
              <li>Candidate-related information submitted by employers.</li>
              <li>Usage data, log data, device information, and cookies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. How We Use Information</h2>
            <p className="text-slate-700 mb-2">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>Provide, operate, and improve the Red-Flagged platform.</li>
              <li>Enable employers to verify candidate history and reduce hiring risk.</li>
              <li>Maintain security, prevent fraud, and comply with legal obligations.</li>
              <li>Communicate with you about updates, service changes, and support.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Data Sharing &amp; Security</h2>
            <p className="text-slate-700 mb-2">
              We do not sell personal data. Candidate information is shared only with authorised, verified employers
              using the platform, in accordance with our terms and applicable law.
            </p>
            <p className="text-slate-700">
              We use industry-standard security practices to protect data in transit and at rest. However, no system is
              completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Your Rights</h2>
            <p className="text-slate-700">
              Depending on your jurisdiction, you may have rights to access, update, or request deletion of your
              personal information. To exercise these rights, please contact us at{' '}
              <a href="mailto:support@red-flagged.com" className="text-red-600 underline">
                support@red-flagged.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Updates to This Policy</h2>
            <p className="text-slate-700">
              We may update this Privacy Policy from time to time. When we do, we will revise the &quot;Last updated&quot;
              date and, where appropriate, notify you through the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
            <p className="text-slate-700">
              If you have any questions about this Privacy Policy, you can reach us at{' '}
              <a href="mailto:support@red-flagged.com" className="text-red-600 underline">
                support@red-flagged.com
              </a>
              .
            </p>
          </section>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


