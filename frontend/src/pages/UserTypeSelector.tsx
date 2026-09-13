import React, { useState } from 'react';
import { GraduationCap, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserType } from '../context/AuthContext';

interface UserTypeSelectorProps {
  onComplete: () => void;
}

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ onComplete }) => {
  const { setUserType } = useAuth();
  const [selected, setSelected] = useState<UserType | null>(null);
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    if (!selected) return;
    setConfirming(true);
    setUserType(selected);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#f8fafb' }}>
      <div className="max-w-2xl w-full animate-fade-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: '#D5E2DA' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#10B981' }} />
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ fontFamily: 'Archivo, sans-serif', color: '#047857' }}
            >
              Welcome to FundBee
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-3"
            style={{ fontFamily: 'Gabarito, sans-serif', color: '#181D1F' }}
          >
            What brings you here?
          </h1>
          <p
            className="text-lg max-w-md mx-auto"
            style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}
          >
            Choose your path — we will personalize your experience.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          {/* Learner Card */}
          <button
            onClick={() => setSelected('learner')}
            className={`relative group text-left p-7 rounded-3xl border-2 transition-all duration-300 cursor-pointer ${
              selected === 'learner'
                ? 'border-[#10B981] shadow-lg shadow-emerald-100/60'
                : 'border-[#E7E7E9] hover:border-[#10B981]/40 hover:shadow-md'
            }`}
            style={{
              background: selected === 'learner'
                ? 'linear-gradient(135deg, #F0FDF9, #D5E2DA)'
                : '#ffffff',
            }}
          >
            {selected === 'learner' && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{
                  background: selected === 'learner'
                    ? 'linear-gradient(135deg, #10B981, #059669)'
                    : '#D5E2DA',
                }}
              >
                <GraduationCap className="w-8 h-8" style={{ color: selected === 'learner' ? 'white' : '#059669' }} />
              </div>
              <div>
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: 'Gabarito, sans-serif', color: '#181D1F' }}
                >
                  I am learning
                </h3>
                <p
                  className="text-sm"
                  style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}
                >
                  New to finance
                </p>
              </div>
            </div>

            <p
              className="text-sm leading-relaxed mb-5"
              style={{ fontFamily: 'Archivo, sans-serif', color: '#424647' }}
            >
              Start with a guided journey through the financial basics. We will teach you how money, markets, and investing work — step by step, with zero jargon.
            </p>

            <div className="flex flex-wrap gap-2">
              {['Interactive Lessons', 'Simple Language', 'Quizzes & XP'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    background: selected === 'learner' ? '#D5E2DA' : '#F8F4EF',
                    color: selected === 'learner' ? '#047857' : '#7d7d87',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>

          {/* Experienced Card */}
          <button
            onClick={() => setSelected('experienced')}
            className={`relative group text-left p-7 rounded-3xl border-2 transition-all duration-300 cursor-pointer ${
              selected === 'experienced'
                ? 'border-[#3B82F6] shadow-lg shadow-blue-100/60'
                : 'border-[#E7E7E9] hover:border-[#3B82F6]/40 hover:shadow-md'
            }`}
            style={{
              background: selected === 'experienced'
                ? 'linear-gradient(135deg, #EFF6FF, #DCEEEF)'
                : '#ffffff',
            }}
          >
            {selected === 'experienced' && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#3B82F6] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{
                  background: selected === 'experienced'
                    ? 'linear-gradient(135deg, #3B82F6, #2563EB)'
                    : '#DCEEEF',
                }}
              >
                <TrendingUp className="w-8 h-8" style={{ color: selected === 'experienced' ? 'white' : '#2563EB' }} />
              </div>
              <div>
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: 'Gabarito, sans-serif', color: '#181D1F' }}
                >
                  I know the ropes
                </h3>
                <p
                  className="text-sm"
                  style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}
                >
                  Experienced investor
                </p>
              </div>
            </div>

            <p
              className="text-sm leading-relaxed mb-5"
              style={{ fontFamily: 'Archivo, sans-serif', color: '#424647' }}
            >
              Skip straight to the dashboard. Browse live market data, run risk analysis, test headlines with our Hype Detector AI, and simulate trades.
            </p>

            <div className="flex flex-wrap gap-2">
              {['Live Markets', 'AI Risk Scoring', 'Trade Simulator'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    background: selected === 'experienced' ? '#DCEEEF' : '#F8F4EF',
                    color: selected === 'experienced' ? '#2563EB' : '#7d7d87',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleConfirm}
            disabled={!selected || confirming}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-[15px] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              fontFamily: 'Gabarito, sans-serif',
              background: selected ? '#181D1F' : '#E7E7E9',
              color: 'white',
              boxShadow: selected ? '0 8px 32px rgba(24,29,31,0.2)' : 'none',
            }}
          >
            {confirming ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Setting up...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelector;
