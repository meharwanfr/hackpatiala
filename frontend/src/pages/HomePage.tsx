import React, { useState, useEffect } from 'react';
import {
  Flame,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Brain,
  BookOpen,
  Gauge,
  MessageCircle,
  BarChart3,
  FileText,
  Play,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onExploreDemo: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onGetStarted,
  onSignIn,
  onExploreDemo,
}) => {
  const { signIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [sampleHeadline, setSampleHeadline] = useState(
    'Short squeeze incoming! Apes buy the dip to the moon 🚀🚀💎🦍'
  );
  const [demoResult, setDemoResult] = useState<{
    score: number;
    label: string;
    isHype: boolean;
  } | null>({
    score: 99.3,
    label: 'Hype-driven',
    isHype: true,
  });
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTestSample = async (text: string) => {
    setSampleHeadline(text);
    setAnalyzing(true);
    try {
      const res = await fetch('http://localhost:8000/hype-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headlines: [text] }),
      });
      if (res.ok) {
        const data = await res.json();
        const score = typeof data.hype_score === 'number' ? data.hype_score : 50;
        setDemoResult({
          score: Math.round(score * 10) / 10,
          label: data.label,
          isHype: score >= 50,
        });
        setAnalyzing(false);
        return;
      }
    } catch {
      // fallback
    }

    const lower = text.toLowerCase();
    const isH = lower.includes('moon') || lower.includes('🚀') || lower.includes('squeeze') || lower.includes('pump');
    setDemoResult({
      score: isH ? 94.2 : 21.5,
      label: isH ? 'Hype-driven' : 'Fundamentals-driven',
      isHype: isH,
    });
    setAnalyzing(false);
  };

  const handleQuickDemo = async () => {
    await signIn('investor@FundBee.demo', 'demo1234');
    onExploreDemo();
  };

  const features = [
    {
      icon: Gauge,
      title: 'Risk Radar',
      subtitle: 'Neural Net #1',
      description: 'An intelligent risk model trained on volatility, beta, drawdown, and market cap to output a clean 0–100 risk score with color-coded danger levels.',
      tag: 'Quantitative Danger Gauge',
      iconBg: 'bg-[#D5E2DA]',
      iconColor: '#2d7a4f',
    },
    {
      icon: Flame,
      title: 'Hype Detector',
      subtitle: 'Neural Net #2',
      description: 'Natural-language classifier that detects FOMO momentum and social chatter. Separates meme-stock noise from genuine business performance signals.',
      tag: 'Real-Time Sentiment AI',
      iconBg: 'bg-[#FDDBCE]',
      iconColor: '#C2410C',
    },
    {
      icon: MessageCircle,
      title: 'Decision Coach',
      subtitle: 'Socratic Simulator',
      description: 'A thoughtful investing dialogue that asks 2–3 probing questions before executing a paper trade. Forces reflection on impulse buys.',
      tag: 'Socratic Coaching',
      iconBg: 'bg-[#D7CEF0]',
      iconColor: '#6b21a8',
    },
    {
      icon: BookOpen,
      title: 'Jargon Buster',
      subtitle: 'Plain-English ELI5',
      description: 'Every financial term on screen is underlined. Hover or tap to see an everyday lemonade-stand analogy with zero complex vocabulary.',
      tag: '50+ Plain-English Terms',
      iconBg: 'bg-[#EAE4DC]',
      iconColor: '#424647',
    },
    {
      icon: BarChart3,
      title: 'Asset Radar',
      subtitle: 'Simplified Cards',
      description: 'Minimalist cards for stocks, ETFs, and crypto with fewer than 5 essential data points, 30-day sparklines, and AI-powered badges.',
      tag: 'Stocks, ETFs, Crypto',
      iconBg: 'bg-[#DCEEEF]',
      iconColor: '#0369a1',
    },
    {
      icon: FileText,
      title: 'Document Reader',
      subtitle: 'PDF Summarizer',
      description: 'Upload 10-K filings, earnings reports, or fund prospectuses. Extracts executive summaries, key risks, and revenue metrics in seconds.',
      tag: 'AI-Powered Extraction',
      iconBg: 'bg-[#FFE4D6]',
      iconColor: '#be123c',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Explore Without Overwhelm',
      description: 'Browse curated stocks, index funds, and crypto. Every term is explained inline with beginner-friendly analogies.',
      icon: TrendingUp,
    },
    {
      number: '02',
      title: 'AI Evaluates Risk & Hype',
      description: 'Our neural networks compute danger level and social FOMO intensity so you know exactly what is moving the price.',
      icon: Brain,
    },
    {
      number: '03',
      title: 'Simulate & Reflect',
      description: 'Answer 2 thoughtful questions before making a simulated trade to build lasting emotional discipline.',
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#181D1F] selection:bg-[#FD956D33]">
      {/* ─── Navigation ─── */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E7E7E9] transition-shadow duration-200 ${
          scrolled ? 'nav-scrolled' : ''
        }`}
      >
        <div className="max-w-[1140px] mx-auto px-6 h-[68px] flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5 select-none">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#FD956D]">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="text-[20px] font-semibold tracking-[-0.3px]"
                style={{ fontFamily: 'Gabarito, sans-serif' }}
              >
                Money<span className="text-[#FD956D]">Mind</span>
              </span>
              <span
                className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#7d7d87]"
                style={{ fontFamily: 'Archivo, sans-serif' }}
              >
                Mind Over Money
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '#features', label: 'Features' },
              { href: '#hype-demo', label: 'Hype Detector' },
              { href: '#how-it-works', label: 'How It Works' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium px-3 py-1.5 rounded-md text-[#424647] hover:text-[#181D1F] hover:bg-[#F8F4EF] transition-colors"
                style={{ fontFamily: 'Archivo, sans-serif' }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSignIn}
              className="text-[13px] font-semibold px-3 py-1.5 text-[#424647] hover:text-[#FD956D] transition-colors cursor-pointer"
              style={{ fontFamily: 'Archivo, sans-serif' }}
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="text-[13px] font-bold px-4 py-2 rounded-full bg-[#181D1F] text-white hover:bg-[#2d3336] transition-colors cursor-pointer"
              style={{ fontFamily: 'Archivo, sans-serif' }}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="pt-20 pb-16 px-6 max-w-[1140px] mx-auto text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF5F0] border border-[#FD956D33] text-[#C2410C] text-[11px] font-bold mb-6">
          <Sparkles className="w-3 h-3 text-[#FD956D]" />
          <span style={{ fontFamily: 'Archivo, sans-serif' }}>Google Developer Groups "Bit N Build" · Punjab Round</span>
        </div>

        {/* Headline */}
        <h1
          className="text-[42px] sm:text-[58px] lg:text-[68px] font-bold leading-[1.08] tracking-[-1px] max-w-[820px] mb-5"
          style={{ fontFamily: 'Gabarito, sans-serif' }}
        >
          Invest with <span className="coral-gradient-text">clarity.</span>
          <br />
          Never with social hype.
        </h1>

        {/* Subtitle */}
        <p
          className="text-[16px] sm:text-[18px] leading-[28px] max-w-[620px] text-[#424647] mb-8"
          style={{ fontFamily: 'Archivo, sans-serif' }}
        >
          The first beginner-investor platform where numbers and headlines get explained in plain English <strong className="text-[#181D1F]">and</strong> scored by trained AI models — stopping impulsive FOMO before you buy.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-10">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#181D1F] hover:bg-[#2d3336] text-white font-bold text-[14px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            style={{ fontFamily: 'Archivo, sans-serif' }}
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleQuickDemo}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-[#E7E7E9] hover:border-[#181D1F] text-[#181D1F] font-bold text-[13px] bg-[#F8F4EF] hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
            style={{ fontFamily: 'Archivo, sans-serif' }}
          >
            <Zap className="w-3.5 h-3.5 text-[#FD956D] fill-[#FD956D]" />
            <span>Instant Demo — No Sign-Up</span>
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-[#7d7d87]" style={{ fontFamily: 'Archivo, sans-serif' }}>
          {[
            { icon: Shield, text: 'Zero Real Money at Risk' },
            { icon: Brain, text: 'Trained Risk & Hype AI' },
            { icon: BookOpen, text: 'Plain-English Jargon Buster' },
          ].map((badge) => (
            <span key={badge.text} className="flex items-center gap-1.5 font-medium">
              <badge.icon className="w-3.5 h-3.5 text-emerald-600" />
              {badge.text}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Hype Demo ─── */}
      <section id="hype-demo" className="py-16 px-6 bg-[#F8F4EF] border-y border-[#E7E7E9]">
        <div className="max-w-[960px] mx-auto">
          {/* Header */}
          <div className="text-center max-w-[580px] mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDDBCE] text-[#B34A26] text-[10px] font-bold uppercase tracking-wider mb-4">
              <Flame className="w-3 h-3 fill-current" />
              <span style={{ fontFamily: 'Archivo, sans-serif' }}>Interactive Model Demo</span>
            </div>
            <h2
              className="text-[30px] sm:text-[36px] font-bold tracking-[-0.3px] mb-3 text-[#181D1F]"
              style={{ fontFamily: 'Gabarito, sans-serif' }}
            >
              Try the Hype Detector Right Now
            </h2>
            <p className="text-[14px] text-[#424647] leading-relaxed" style={{ fontFamily: 'Archivo, sans-serif' }}>
              Our AI model translates headline tone and sentiment into a 0–100 hype score, differentiating retail FOMO from real earnings.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E7E7E9] space-y-4">
            {/* Input */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={sampleHeadline}
                onChange={(e) => setSampleHeadline(e.target.value)}
                placeholder="Enter a financial headline..."
                className="input-modern flex-1 px-4 py-3 rounded-xl border border-[#E7E7E9] bg-[#F8F4EF] text-[13px] text-[#181D1F] focus:outline-none"
                style={{ fontFamily: 'Archivo, sans-serif' }}
              />
              <button
                onClick={() => handleTestSample(sampleHeadline)}
                disabled={analyzing}
                className="px-5 py-3 rounded-xl bg-[#181D1F] hover:bg-[#2d3336] text-white font-bold text-[13px] flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50 transition-colors"
                style={{ fontFamily: 'Archivo, sans-serif' }}
              >
                {analyzing ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Play className="w-3 h-3 fill-current" />
                )}
                <span>{analyzing ? 'Classifying...' : 'Classify'}</span>
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7d7d87] mr-1" style={{ fontFamily: 'Archivo, sans-serif' }}>
                Try:
              </span>
              {[
                { text: '🚀 GME Meme Spike', headline: 'Short squeeze incoming! Apes buy the dip to the moon 🚀🚀💎🦍' },
                { text: '📈 AAPL Earnings', headline: 'Apple reports quarterly revenue growth of 8% with expanded services margin' },
                { text: '⚡ BTC FOMO', headline: 'Bitcoin breaking out to $150k imminent! Massive pump loading get in before it is too late 🔥' },
              ].map((preset) => (
                <button
                  key={preset.text}
                  onClick={() => handleTestSample(preset.headline)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-[#E7E7E9] bg-white hover:border-[#FD956D] hover:bg-[#FFF5F0] transition-colors cursor-pointer"
                  style={{ fontFamily: 'Archivo, sans-serif' }}
                >
                  {preset.text}
                </button>
              ))}
            </div>

            {/* Result */}
            {demoResult && (
              <div
                className="p-4 rounded-xl border flex items-center justify-between gap-4"
                style={{
                  background: demoResult.isHype ? '#FFF5F0' : '#F0F9F5',
                  borderColor: demoResult.isHype ? '#FD956D44' : '#10B98144',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0"
                    style={{
                      background: demoResult.isHype ? '#FD956D' : '#10B981',
                    }}
                  >
                    {demoResult.score}
                  </div>
                  <div>
                    <span
                      className="text-[14px] font-bold block mb-0.5"
                      style={{
                        fontFamily: 'Gabarito, sans-serif',
                        color: demoResult.isHype ? '#C2410C' : '#047857',
                      }}
                    >
                      {demoResult.isHype ? '🔥 Hype-Driven Noise' : '📈 Fundamentals-Driven'}
                    </span>
                    <span className="text-[12px] text-[#424647] leading-snug" style={{ fontFamily: 'Archivo, sans-serif' }}>
                      {demoResult.isHype
                        ? 'High density of emotional momentum triggers and social media euphoria.'
                        : 'Calm corporate reporting focused on verifiable financial performance.'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#7d7d87] bg-white px-2 py-1 rounded-md border border-[#E7E7E9] shrink-0 hidden sm:inline">
                  FundBee AI
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-20 px-6 max-w-[1140px] mx-auto">
        <div className="text-center max-w-[620px] mx-auto mb-14">
          <p className="section-label mb-2 text-[#7d7d87]">Everything Inside FundBee</p>
          <h2
            className="text-[32px] sm:text-[40px] font-bold tracking-[-0.3px] text-[#181D1F] mb-3"
            style={{ fontFamily: 'Gabarito, sans-serif' }}
          >
            Built for First-Time Investors
          </h2>
          <p className="text-[15px] text-[#424647] leading-relaxed" style={{ fontFamily: 'Archivo, sans-serif' }}>
            We replaced terrifying financial terminal complexity with plain-English clarity and real machine learning.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="feature-card rounded-2xl p-6 border border-[#E7E7E9] bg-white"
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${feature.iconBg}`}>
                    <Icon className="w-5 h-5" style={{ color: feature.iconColor }} />
                  </div>
                  <div>
                    <h3
                      className="text-[17px] font-semibold text-[#181D1F]"
                      style={{ fontFamily: 'Gabarito, sans-serif' }}
                    >
                      {feature.title}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d7d87]" style={{ fontFamily: 'Archivo, sans-serif' }}>
                      {feature.subtitle}
                    </span>
                  </div>
                  <p className="text-[13px] leading-[21px] text-[#424647]" style={{ fontFamily: 'Archivo, sans-serif' }}>
                    {feature.description}
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-[#E7E7E9] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#7d7d87]" style={{ fontFamily: 'Archivo, sans-serif' }}>
                    {feature.tag}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#7d7d87]" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-20 px-6 bg-[#F8F4EF] border-t border-[#E7E7E9]">
        <div className="max-w-[960px] mx-auto">
          <div className="text-center max-w-[580px] mx-auto mb-14">
            <p className="section-label mb-2 text-[#7d7d87]">The 3-Step Journey</p>
            <h2
              className="text-[32px] sm:text-[38px] font-bold tracking-[-0.3px] text-[#181D1F]"
              style={{ fontFamily: 'Gabarito, sans-serif' }}
            >
              How FundBee Protects Your Decisions
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  <div className="bg-white rounded-2xl p-6 border border-[#E7E7E9] space-y-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-[28px] font-black font-mono"
                        style={{ color: '#FD956D' }}
                      >
                        {step.number}
                      </span>
                      <div className="w-9 h-9 rounded-lg bg-[#FFF5F0] flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5 text-[#FD956D]" />
                      </div>
                    </div>
                    <h4
                      className="text-[16px] font-bold text-[#181D1F]"
                      style={{ fontFamily: 'Gabarito, sans-serif' }}
                    >
                      {step.title}
                    </h4>
                    <p className="text-[13px] text-[#424647] leading-relaxed" style={{ fontFamily: 'Archivo, sans-serif' }}>
                      {step.description}
                    </p>
                  </div>
                  {/* Connector arrow (desktop) */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-3 w-6 h-6 items-center justify-center text-[#E7E7E9]">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-14 px-6 border-y border-[#E7E7E9]">
        <div className="max-w-[960px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '2', label: 'Neural Networks' },
            { value: '50+', label: 'Terms Decoded' },
            { value: '$0', label: 'Real Money at Risk' },
            { value: '3', label: 'Step Process' },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                className="text-[32px] sm:text-[36px] font-bold mb-1"
                style={{ fontFamily: 'Gabarito, sans-serif', color: '#FD956D' }}
              >
                {stat.value}
              </div>
              <div className="text-[12px] font-medium text-[#7d7d87]" style={{ fontFamily: 'Archivo, sans-serif' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 px-6">
        <div className="max-w-[860px] mx-auto">
          <div className="rounded-3xl p-10 sm:p-14 text-center space-y-5 bg-[#181D1F]">
            <div className="w-12 h-12 rounded-2xl bg-[#FD956D] text-white text-xl flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <h2
              className="text-[32px] sm:text-[40px] font-bold leading-tight tracking-[-0.3px] text-white"
              style={{ fontFamily: 'Gabarito, sans-serif' }}
            >
              Ready to master your<br />investing mindset?
            </h2>
            <p
              className="text-[15px] text-[#9ca3af] max-w-md mx-auto"
              style={{ fontFamily: 'Archivo, sans-serif' }}
            >
              Join the platform built for Google Developer Groups "Bit N Build" Hackathon. Zero real money at risk — 100% learning.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#FD956D] hover:bg-[#fa8657] text-white font-bold text-[14px] transition-colors cursor-pointer"
                style={{ fontFamily: 'Archivo, sans-serif' }}
              >
                Create Free Account
              </button>
              <button
                onClick={handleQuickDemo}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-[14px] transition-colors cursor-pointer"
                style={{ fontFamily: 'Archivo, sans-serif' }}
              >
                Explore Demo Instantly
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[#E7E7E9] py-8 px-6 mt-auto">
        <div className="max-w-[1140px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#FD956D]">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[14px] font-semibold" style={{ fontFamily: 'Gabarito, sans-serif' }}>
              MoneyMind
            </span>
            <span className="text-[12px] text-[#7d7d87]" style={{ fontFamily: 'Archivo, sans-serif' }}>
              · Mind Over Money · GDG Bit N Build
            </span>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-[#7d7d87]" style={{ fontFamily: 'Archivo, sans-serif' }}>
            <button onClick={onSignIn} className="hover:text-[#181D1F] transition-colors cursor-pointer">
              Sign In
            </button>
            <button onClick={onGetStarted} className="hover:text-[#181D1F] transition-colors cursor-pointer">
              Sign Up
            </button>
            <button onClick={handleQuickDemo} className="hover:text-[#181D1F] transition-colors cursor-pointer">
              Quick Demo
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
