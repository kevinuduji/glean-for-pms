"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Check,
  X,
  Zap,
  Building2,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import LandingNav from "@/components/LandingNav";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const tiers = [
  {
    name: "Starter",
    description: "For individual PMs exploring product intelligence.",
    monthlyPrice: 0,
    annualPrice: 0,
    icon: User,
    iconColor: "bg-slate-600",
    borderColor: "border-slate-200",
    cta: "Get started free",
    ctaStyle:
      "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
    popular: false,
    features: [
      "1 user seat",
      "3 data source connections",
      "1,000 AI queries / month",
      "5 active experiments",
      "7-day insight retention",
      "Basic anomaly detection",
      "Community support",
    ],
  },
  {
    name: "Team",
    description: "For product teams that need a shared intelligence layer.",
    monthlyPrice: 79,
    annualPrice: 69,
    icon: Zap,
    iconColor: "bg-indigo-600",
    borderColor: "border-indigo-300",
    cta: "Start free trial",
    ctaStyle:
      "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/25",
    popular: true,
    features: [
      "Up to 15 users",
      "10 data source connections",
      "10,000 AI queries / month",
      "25 active experiments",
      "90-day insight retention",
      "Advanced anomaly detection",
      "Institutional memory index",
      "Natural language experiment builder",
      "Priority recommendations",
      "Email & chat support",
    ],
  },
  {
    name: "Business",
    description: "For organizations scaling product-led growth.",
    monthlyPrice: 149,
    annualPrice: 129,
    icon: Building2,
    iconColor: "bg-violet-600",
    borderColor: "border-slate-200",
    cta: "Contact sales",
    ctaStyle:
      "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
    popular: false,
    features: [
      "Unlimited users",
      "Unlimited data sources",
      "Unlimited AI queries",
      "Unlimited experiments",
      "Unlimited data retention",
      "Custom AI model tuning",
      "SSO / SAML authentication",
      "Advanced roles & permissions",
      "Dedicated success manager",
      "SLA guarantees & audit logs",
    ],
  },
];

const comparisonCategories = [
  {
    name: "Usage",
    features: [
      {
        name: "Users",
        starter: "1",
        team: "Up to 15",
        business: "Unlimited",
      },
      {
        name: "Data source connections",
        starter: "3",
        team: "10",
        business: "Unlimited",
      },
      {
        name: "AI queries / month",
        starter: "1,000",
        team: "10,000",
        business: "Unlimited",
      },
      {
        name: "Active experiments",
        starter: "5",
        team: "25",
        business: "Unlimited",
      },
      {
        name: "Insight retention",
        starter: "7 days",
        team: "90 days",
        business: "Unlimited",
      },
    ],
  },
  {
    name: "Intelligence",
    features: [
      {
        name: "Anomaly detection",
        starter: "Basic",
        team: "Advanced",
        business: "Advanced",
      },
      {
        name: "Priority recommendations",
        starter: false,
        team: true,
        business: true,
      },
      {
        name: "Institutional memory index",
        starter: false,
        team: true,
        business: true,
      },
      {
        name: "Natural language experiments",
        starter: false,
        team: true,
        business: true,
      },
      {
        name: "Custom AI model tuning",
        starter: false,
        team: false,
        business: true,
      },
      {
        name: "Cross-platform pattern recognition",
        starter: false,
        team: true,
        business: true,
      },
    ],
  },
  {
    name: "Platform",
    features: [
      {
        name: "SSO / SAML",
        starter: false,
        team: false,
        business: true,
      },
      {
        name: "Advanced roles & permissions",
        starter: false,
        team: false,
        business: true,
      },
      {
        name: "Audit logs",
        starter: false,
        team: false,
        business: true,
      },
      {
        name: "Custom integrations",
        starter: false,
        team: false,
        business: true,
      },
      {
        name: "SLA guarantees",
        starter: false,
        team: false,
        business: true,
      },
    ],
  },
  {
    name: "Support",
    features: [
      {
        name: "Community support",
        starter: true,
        team: true,
        business: true,
      },
      {
        name: "Email & chat support",
        starter: false,
        team: true,
        business: true,
      },
      {
        name: "Dedicated success manager",
        starter: false,
        team: false,
        business: true,
      },
      {
        name: "Dedicated Slack channel",
        starter: false,
        team: false,
        business: true,
      },
    ],
  },
];

const faqs = [
  {
    question: "What counts as an AI query?",
    answer:
      "An AI query is any question you ask the Probe agent — whether it's investigating a metric drop, generating experiment ideas, or pulling a cross-platform insight. Browsing dashboards and viewing saved insights don't count toward your query limit.",
  },
  {
    question: "Can I switch plans later?",
    answer:
      "Absolutely. You can upgrade, downgrade, or cancel at any time. When you upgrade, the new plan takes effect immediately and we prorate the charge. When you downgrade, the change takes effect at the end of your current billing period.",
  },
  {
    question: "What data sources can I connect?",
    answer:
      "Probe integrates with Amplitude, Mixpanel, PostHog, Sentry, GitHub, Stripe, Jira, Slack, Prometheus, Notion, and more. On the Starter plan you can connect up to 3, Team supports 10, and Business has no limit. We're adding new integrations every month.",
  },
  {
    question: "How does the institutional memory index work?",
    answer:
      "Every experiment result, decision rationale, user pattern, and insight you surface in Probe feeds a growing intelligence index unique to your product. Over time, Probe cross-references new data against this history — so recommendations get sharper and more context-aware the longer you use it.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Probe is SOC 2 Type II compliant, encrypts all data at rest and in transit, and never trains models on your data. Business plans include additional controls like SSO, audit logs, and data residency options.",
  },
  {
    question: "Do you offer discounts for startups or nonprofits?",
    answer:
      "Yes! We offer 50% off the first year for qualifying startups and nonprofits. Reach out to our sales team to learn more about eligibility.",
  },
];

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return (
      <span className="text-sm font-medium text-slate-700">{value}</span>
    );
  }
  return value ? (
    <Check className="w-4.5 h-4.5 text-indigo-600" />
  ) : (
    <X className="w-4.5 h-4.5 text-slate-300" />
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left group"
      >
        <span className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors pr-4">
          {question}
        </span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
          className="pb-5"
        >
          <p className="text-sm text-slate-500 leading-relaxed">{answer}</p>
        </motion.div>
      )}
    </div>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <LandingNav />

      {/* Hero */}
      <section className="relative pt-32 pb-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-700 tracking-wide">
                SIMPLE, TRANSPARENT PRICING
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6"
          >
            Intelligence that scales
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              with your product
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
          >
            Start free, upgrade when your team is ready.
            Every plan includes the core Probe agent.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex items-center justify-center gap-4 mb-16"
          >
            <span
              className={`text-sm font-medium transition-colors ${
                !annual ? "text-slate-900" : "text-slate-400"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                annual ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                  annual ? "translate-x-7" : "translate-x-0.5"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium transition-colors ${
                annual ? "text-slate-900" : "text-slate-400"
              }`}
            >
              Annual
            </span>
            {annual && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                Save ~13%
              </span>
            )}
          </motion.div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pb-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => {
              const Icon = tier.icon;
              const price = annual ? tier.annualPrice : tier.monthlyPrice;
              return (
                <motion.div
                  key={tier.name}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={i + 4}
                  className={`relative rounded-2xl border ${tier.borderColor} bg-white p-8 flex flex-col ${
                    tier.popular
                      ? "shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-200"
                      : "hover:shadow-lg hover:shadow-slate-200/50"
                  } transition-all`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="text-xs font-bold text-white bg-indigo-600 px-4 py-1.5 rounded-full shadow-md shadow-indigo-600/30">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <div
                      className={`w-10 h-10 rounded-xl ${tier.iconColor} flex items-center justify-center mb-4 shadow-lg shadow-slate-900/10`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-slate-500">{tier.description}</p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        ${price}
                      </span>
                      {price > 0 && (
                        <span className="text-sm text-slate-400 font-medium">
                          / user / month
                        </span>
                      )}
                    </div>
                    {price === 0 && (
                      <span className="text-sm text-slate-400 font-medium">
                        Free forever
                      </span>
                    )}
                    {annual && price > 0 && (
                      <p className="text-xs text-slate-400 mt-1">
                        Billed annually (${price * 12}/user/year)
                      </p>
                    )}
                  </div>

                  <Link
                    href="/signup"
                    className={`inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl transition-all active:scale-[0.98] mb-8 ${tier.ctaStyle}`}
                  >
                    {tier.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="border-t border-slate-100 pt-6 flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                      What&apos;s included
                    </p>
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm text-slate-600"
                        >
                          <Check className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
              Compare Plans
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              See exactly what each plan includes so you can pick the right fit
              for your team.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
          >
            {/* Table header */}
            <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200">
              <div />
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900">Starter</p>
                <p className="text-xs text-slate-400">Free</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-indigo-600">Team</p>
                <p className="text-xs text-slate-400">
                  ${annual ? "69" : "79"}/user/mo
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900">Business</p>
                <p className="text-xs text-slate-400">
                  ${annual ? "129" : "149"}/user/mo
                </p>
              </div>
            </div>

            {/* Table body */}
            {comparisonCategories.map((category) => (
              <div key={category.name}>
                <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {category.name}
                  </p>
                </div>
                {category.features.map((feature, fi) => (
                  <div
                    key={feature.name}
                    className={`grid grid-cols-4 gap-4 px-6 py-3.5 ${
                      fi < category.features.length - 1
                        ? "border-b border-slate-50"
                        : "border-b border-slate-100"
                    }`}
                  >
                    <p className="text-sm text-slate-600 font-medium">
                      {feature.name}
                    </p>
                    <div className="flex justify-center items-center">
                      <FeatureCell value={feature.starter} />
                    </div>
                    <div className="flex justify-center items-center">
                      <FeatureCell value={feature.team} />
                    </div>
                    <div className="flex justify-center items-center">
                      <FeatureCell value={feature.business} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Common questions
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="bg-white rounded-2xl border border-slate-200 px-8 divide-slate-100"
          >
            {faqs.map((faq) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Ready to stop guessing?
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 font-medium">
              Join product teams who ship faster, experiment smarter, and
              build with confidence — not just data.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.98]"
            >
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-sm tracking-tight">
                Probe
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Pricing
              </Link>
            </div>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Probe AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
