"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ArrowRight, Play, Star, Globe, ShieldCheck, Ban, Clock, TrendingUp, Shield } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative py-6 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Right Gradient Orb */}
        <motion.div
          className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 via-indigo-400/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Bottom Left Gradient Orb */}
        <motion.div
          className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-400/20 via-blue-400/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Floating Geometric Shapes */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-16 h-16 border-2 border-blue-500/20 rounded-lg"
          animate={{
            rotate: [0, 180, 360],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 left-1/4 w-12 h-12 border-2 border-indigo-500/20 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content (previous content restored) */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-slate-900/40 border border-brand text-brand text-sm font-medium"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Globe className="w-4 h-4" />
              <span>Trusted by 200+ Companies Worldwide</span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                <span className="block text-slate-900 dark:text-white">Verify Before You</span>
                <span className="block bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">Hire</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                Uncover the truth about candidates who accept job offers but never show up. Our platform provides employment data to help you build trust and make smarter recruitment decisions. Get insights into a candidate's past, including any history of fraudulent activity, termination, or absconding, to ensure you're hiring the right person for the job.
              </p>
            </div>

            {/* Sliding tagline ticker */}
            <div className="h-6 overflow-hidden relative max-w-xl">
              <motion.div
                className="space-y-1"
                animate={{ y: [0, -24, -48, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                <div className="text-sm text-slate-700 dark:text-slate-300">Detect offer-hoarders before onboarding</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">Check shared Red-flagged database across companies</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">Reduce no-shows and hiring risks</div>
              </motion.div>
            </div>

            {/* Premium bullet points */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <div className="flex items-center gap-3 bg-slate-100/70 dark:bg-slate-800/60 backdrop-blur-sm border border-brand rounded-xl p-4">
                <ShieldCheck className="h-5 w-5 text-brand" />
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">No-show insights</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">Spot "offer-accepted but not joined" Patterns</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-100/70 dark:bg-slate-800/60 backdrop-blur-sm border border-brand rounded-xl p-4">
                <Clock className="h-5 w-5 text-brand" />
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Red-flagged Candidates</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">Avoid risky hires proactively</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-100/70 dark:bg-slate-800/60 backdrop-blur-sm border border-brand rounded-xl p-4">
                <Ban className="h-5 w-5 text-brand" />
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Candidate's Version</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">Know why the candidate declined</div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link
                href="/employer/register"
                className="btn-brand px-8 py-4 rounded-xl text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center justify-center"
              >
                Join Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="/contact"
                className="border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 inline-flex items-center justify-center"
              >
                <Play className="mr-2 w-5 h-5" />
                Contact Us
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap gap-6 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {[
                { value: "200+", label: "Companies Trusting Us" },
                { value: "20K+", label: "Candidates Verified" },
                { value: "4.9/5", label: "User Rating" },
              ].map((stat, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className="text-center">
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Lottie Animation */}
          <motion.div
            className="relative lg:block hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-full h-[500px] max-w-lg mx-auto">
              {/* Main Animation Container */}
              <motion.div
                className="relative w-full h-full rounded-3xl overflow-hidden"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-indigo-600/20 z-10"></div>

                {/* Lottie */}
                <div className="w-full h-full bg-white dark:bg-slate-900">
                  <DotLottieReact
                    src="https://lottie.host/029551e8-7520-47e1-a484-a1ee35f2d68c/OD3h8NihZn.lottie"
                    loop
                    autoplay
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </motion.div>

              {/* Floating Stats Badge */}
              <motion.div
                className="absolute top-8 -right-4 rounded-2xl shadow-2xl p-4 border border-slate-200 dark:border-slate-700 backdrop-blur-sm bg-white/90 dark:bg-slate-800/90"
                animate={{
                  y: [0, 15, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">98%</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Success Rate</p>
              </motion.div>

              {/* Floating Security Badge */}
              <motion.div
                className="absolute bottom-8 -left-4 bg-brand rounded-2xl shadow-2xl p-4"
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <div className="flex items-center gap-3 text-white">
                  <Shield className="w-6 h-6" />
                  <div>
                    <p className="font-bold text-sm">100% Secure</p>
                    <p className="text-xs opacity-90">HIPAA Compliant</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Rating Badge */}
              <motion.div
                className="absolute top-1/2 -left-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-3 border border-slate-200 dark:border-slate-700"
                animate={{
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">4.9</p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">Rating</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
