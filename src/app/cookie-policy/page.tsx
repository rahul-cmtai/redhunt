import Navbar from '../components/navbar'
import Footer from '../components/footer'
import Link from 'next/link'

export default function CookiePolicyPage() {
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
          <span className="text-slate-700 font-medium">Cookie Policy</span>
        </nav>

        {/* Heading */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Cookie Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            This Cookie Policy explains how Red-Flagged uses cookies and similar technologies on our website and
            platform.
          </p>
        </header>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. What Are Cookies?</h2>
            <p className="text-slate-700">
              Cookies are small text files that are stored on your device when you visit a website. They help us
              remember your preferences, understand how you use the platform, and improve your experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Types of Cookies We Use</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-2">
              <li>
                <span className="font-semibold">Essential cookies:</span> Required for core functionality such as login,
                session management, and security.
              </li>
              <li>
                <span className="font-semibold">Performance cookies:</span> Help us understand usage patterns so we can
                optimise the platform.
              </li>
              <li>
                <span className="font-semibold">Preference cookies:</span> Remember your settings (for example, language
                or saved filters).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Managing Cookies</h2>
            <p className="text-slate-700 mb-2">
              Most web browsers allow you to control cookies through their settings. You can choose to block cookies or
              receive alerts when cookies are being used.
            </p>
            <p className="text-slate-700">
              If you disable certain cookies, some features of the Red-Flagged platform may not work as intended.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Third-Party Cookies</h2>
            <p className="text-slate-700">
              We may use third-party analytics or service providers that set their own cookies to help us measure
              traffic and usage. These providers process data in accordance with their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Changes to This Policy</h2>
            <p className="text-slate-700">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an
              updated &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Contact</h2>
            <p className="text-slate-700">
              If you have questions about our use of cookies, please contact{' '}
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


