import Navbar from '../components/navbar'
import Footer from '../components/footer'
import Link from 'next/link'

export default function TermsOfServicePage() {
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
          <span className="text-slate-700 font-medium">Terms of Service</span>
        </nav>

        {/* Heading */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Red-Flagged platform.
            By creating an account or using the service, you agree to be bound by these Terms.
          </p>
        </header>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Eligibility &amp; Accounts</h2>
            <p className="text-slate-700 mb-2">
              Red-Flagged is intended for use by legitimate employers, HR professionals, and authorised
              representatives. You are responsible for:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>Providing accurate registration information.</li>
              <li>Maintaining the confidentiality of login credentials.</li>
              <li>Ensuring that only authorised users access your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Acceptable Use</h2>
            <p className="text-slate-700 mb-2">
              You agree to use the platform only for lawful, HR-related verification purposes and to:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>Submit information that is truthful, accurate, and made in good faith.</li>
              <li>Not misuse candidate data or use it for discrimination or harassment.</li>
              <li>Comply with all applicable employment, data protection, and privacy laws.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Data &amp; Confidentiality</h2>
            <p className="text-slate-700">
              Candidate records may contain sensitive information. You agree to keep all such data confidential,
              restrict access within your organisation on a need-to-know basis, and implement appropriate security
              controls. Our use of data is further described in our{' '}
              <Link href="/privacy-policy" className="text-red-600 underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Disclaimers</h2>
            <p className="text-slate-700">
              Red-Flagged provides a verification platform and does not guarantee any hiring outcome. While we strive
              for accuracy, information on the platform may be contributed by third-party employers and may not always
              be complete or up to date. You remain solely responsible for your hiring decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
            <p className="text-slate-700">
              To the maximum extent permitted by law, Red-Flagged will not be liable for any indirect, incidental, or
              consequential damages arising out of or related to your use of the platform. Our aggregate liability to
              you for any claims arising under these Terms will be limited to the fees paid by you (if any) in the
              preceding twelve (12) months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Termination</h2>
            <p className="text-slate-700">
              We may suspend or terminate your access if you violate these Terms, misuse the platform, or where
              required by law. You may stop using the service at any time; certain obligations (such as confidentiality)
              will survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Changes to These Terms</h2>
            <p className="text-slate-700">
              We may update these Terms occasionally. When we do, we will update the &quot;Last updated&quot; date and
              may notify you via email or in-app notices. Continued use of the platform after changes take effect
              constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">8. Contact</h2>
            <p className="text-slate-700">
              For questions about these Terms, please contact{' '}
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


