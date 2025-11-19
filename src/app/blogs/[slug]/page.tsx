'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '../../components/navbar'
import Footer from '../../components/footer'
import { Calendar, Clock, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.red-flagged.com'

interface BlogPost {
  _id: string
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  points: string[]
  content: string
}

// Fallback blog data array (for offline/error cases)
const fallbackBlogPosts = [
  {
    id: 1,
    slug: 'why-candidate-verification-matters',
    title: 'Why Candidate Verification Matters in Modern Hiring',
    description: 'In today\'s competitive job market, verifying candidate credentials has become more crucial than ever. Learn how proper verification can save your company time, money, and reputation.',
    date: '2025-01-15',
    readTime: '5 min read',
    points: [
      'Reduces hiring costs by 40%',
      'Improves employee retention rates',
      'Protects company reputation',
      'Ensures compliance with industry standards'
    ],
    content: `In today's fast-paced business environment, hiring the right candidate is more critical than ever. The cost of a bad hire goes beyond just salary - it includes training time, lost productivity, and potential damage to your company's reputation.

Candidate verification has emerged as a fundamental practice for modern HR departments. By thoroughly checking a candidate's background, employment history, and credentials, companies can make more informed hiring decisions.

The benefits are clear: companies that implement comprehensive verification processes see a 40% reduction in hiring costs, improved employee retention rates, and better overall team performance. Moreover, proper verification helps protect your company from potential legal issues and ensures compliance with industry standards.

At Red-Flagged, we understand the challenges employers face. Our platform provides a comprehensive solution that makes candidate verification simple, fast, and reliable.`
  },
  {
    id: 2,
    slug: 'red-flagged-candidates-impact',
    title: 'Understanding the Impact of Red-Flagged Candidates',
    description: 'Discover how tracking candidates who accept offers but fail to join can transform your hiring process and prevent future recruitment challenges.',
    date: '2025-01-10',
    readTime: '6 min read',
    points: [
      'Prevents repeated no-show incidents',
      'Saves recruitment resources',
      'Improves hiring pipeline efficiency',
      'Builds industry-wide transparency'
    ],
    content: `Red-flagged candidates represent a significant challenge in the modern recruitment landscape. These are candidates who accept job offers but fail to show up on their start date, leaving employers in a difficult position.

The impact of such incidents extends far beyond the immediate inconvenience. Companies invest significant time and resources in the recruitment process - from initial screening to final offer negotiations. When a candidate doesn't show up, all that investment is lost, and the position remains unfilled.

Our platform addresses this challenge by creating a transparent system where employers can share information about red-flagged candidates. This not only helps individual companies avoid problematic hires but also contributes to building a more trustworthy recruitment ecosystem.

By tracking and sharing this information responsibly, we're helping create a hiring environment where both employers and candidates can make better-informed decisions.`
  },
  {
    id: 3,
    slug: 'best-practices-hiring-process',
    title: 'Best Practices for a Streamlined Hiring Process',
    description: 'Learn the essential strategies and best practices that top companies use to streamline their hiring process and attract the best talent.',
    date: '2025-01-05',
    readTime: '7 min read',
    points: [
      'Define clear job requirements',
      'Use structured interviews',
      'Implement verification checks',
      'Maintain candidate communication'
    ],
    content: `A streamlined hiring process is the foundation of successful recruitment. In this comprehensive guide, we explore the best practices that leading companies use to attract, evaluate, and hire top talent.

The first step is defining clear job requirements. This might seem obvious, but many companies struggle with vague job descriptions that attract unqualified candidates. A well-defined role description helps both recruiters and candidates understand expectations from the start.

Structured interviews are another critical component. By asking consistent questions to all candidates, you can make fair comparisons and reduce bias in your hiring decisions. This approach also helps you evaluate candidates based on their actual qualifications rather than first impressions.

Verification checks should be integrated into your process early. Waiting until after an offer is made can lead to wasted time and resources. By verifying credentials, employment history, and references upfront, you can focus your efforts on truly qualified candidates.

Finally, maintaining clear communication throughout the process is essential. Candidates appreciate transparency, and regular updates help build trust even if they're not selected. This positive experience can lead to referrals and a stronger employer brand.`
  },
  {
    id: 4,
    slug: 'cost-of-bad-hire',
    title: 'The Hidden Costs of a Bad Hire',
    description: 'Explore the financial and operational impact of making the wrong hiring decision and how proper verification can help prevent these costly mistakes.',
    date: '2024-12-28',
    readTime: '5 min read',
    points: [
      'Direct costs: salary and benefits',
      'Indirect costs: training and onboarding',
      'Opportunity costs: lost productivity',
      'Reputation damage and team morale'
    ],
    content: `The cost of a bad hire extends far beyond the obvious expenses. While salary and benefits are the most visible costs, the true impact includes training time, lost productivity, and potential damage to team morale and company reputation.

Direct costs are straightforward - you're paying a salary and benefits to someone who isn't performing. But the indirect costs are often much higher. Consider the time spent by managers and colleagues training the new hire, the productivity lost while they're learning, and the potential mistakes they might make.

Opportunity costs are another significant factor. The time and resources spent on a bad hire could have been invested in finding and developing a better candidate. This lost opportunity can have long-term implications for your team's performance and growth.

Perhaps most importantly, a bad hire can damage team morale. When team members have to compensate for an underperforming colleague, it creates frustration and can lead to increased turnover among your best employees.

Proper candidate verification is one of the most effective ways to prevent bad hires. By thoroughly checking credentials, employment history, and references, you can significantly reduce the risk of making a costly hiring mistake.`
  },
  {
    id: 5,
    slug: 'building-trust-hiring',
    title: 'Building Trust in the Hiring Ecosystem',
    description: 'Learn how transparency and verification can help build a more trustworthy hiring ecosystem that benefits both employers and candidates.',
    date: '2024-12-20',
    readTime: '6 min read',
    points: [
      'Transparency benefits everyone',
      'Responsible information sharing',
      'Protecting candidate privacy',
      'Creating industry standards'
    ],
    content: `Trust is the foundation of any successful hiring relationship. When employers and candidates can trust each other, the entire recruitment process becomes more efficient and effective.

Transparency in hiring doesn't mean sharing everything - it means sharing the right information responsibly. Our platform is designed to help employers share critical information about red-flagged candidates while protecting privacy and ensuring fairness.

Responsible information sharing means focusing on verified facts rather than opinions or assumptions. We help employers document specific incidents and behaviors that are relevant to future hiring decisions, while protecting candidates from unfair discrimination.

Protecting candidate privacy is equally important. Our system ensures that only verified, relevant information is shared, and candidates have the opportunity to understand and address any concerns. This balanced approach helps create a fair system that protects both employers and candidates.

By working together to create industry standards for information sharing, we can build a hiring ecosystem that's more transparent, efficient, and fair for everyone involved.`
  },
  {
    id: 6,
    slug: 'technology-recruitment',
    title: 'How Technology is Transforming Recruitment',
    description: 'Discover how modern technology platforms are revolutionizing the way companies find, evaluate, and hire talent in the digital age.',
    date: '2024-12-15',
    readTime: '8 min read',
    points: [
      'Automated screening processes',
      'Data-driven decision making',
      'Improved candidate experience',
      'Faster time-to-hire metrics'
    ],
    content: `Technology is fundamentally transforming the recruitment landscape. From automated screening to data-driven decision making, modern platforms are making hiring faster, more efficient, and more effective.

Automated screening processes help companies handle large volumes of applications efficiently. By using technology to filter candidates based on qualifications and experience, recruiters can focus their time on the most promising candidates.

Data-driven decision making is another key advantage. Modern platforms provide analytics and insights that help companies understand their hiring patterns, identify bottlenecks, and optimize their recruitment processes. This data can reveal trends that might not be obvious through traditional methods.

The candidate experience has also improved significantly. Modern platforms make it easier for candidates to apply, track their application status, and communicate with potential employers. This improved experience helps companies attract better talent and build a stronger employer brand.

Perhaps most importantly, technology is helping companies reduce time-to-hire. By streamlining processes and automating routine tasks, companies can move from application to offer more quickly, which is crucial in competitive job markets where top candidates receive multiple offers.

At Red-Flagged, we're proud to be part of this transformation, providing tools that help employers make better hiring decisions while maintaining fairness and transparency.`
  }
]

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(`${API_BASE_URL}/api/blogs/slug/${slug}`)
        setPost(data)
      } catch (err: any) {
        console.error('Error fetching blog:', err)
        if (err.response?.status === 404) {
          setError('Blog post not found')
        } else {
          setError('Failed to load blog post')
          // Try to use fallback data
          const fallbackPost = fallbackBlogPosts.find(p => p.slug === slug)
          if (fallbackPost) {
            setPost({
              _id: String(fallbackPost.id),
              slug: fallbackPost.slug,
              title: fallbackPost.title,
              description: fallbackPost.description,
              date: fallbackPost.date,
              readTime: fallbackPost.readTime,
              points: fallbackPost.points,
              content: fallbackPost.content
            })
            setError(null)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchBlog()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading blog post...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error && !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link 
            href="/blogs"
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link 
            href="/blogs"
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          href="/blogs"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Blogs</span>
        </Link>
      </div>

      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Date and Read Time */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {post.description}
          </p>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-8"></div>

          {/* Key Points */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Takeaways</h2>
            <ul className="space-y-3">
              {post.points.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-lg">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
              {post.content}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-3">Ready to Transform Your Hiring Process?</h3>
              <p className="text-red-100 mb-6 max-w-2xl mx-auto">
                Join thousands of employers who trust Red-Flagged for candidate verification and smarter hiring decisions.
              </p>
              <Link
                href="/employer/register"
                className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Join Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}


