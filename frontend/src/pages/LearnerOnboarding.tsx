import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Flame,
  Star,
  Sparkles,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { learningModules, type LearningModule, type Lesson } from '../data/learningModules';

type ViewState = 'moduleMap' | 'lessonContent' | 'quiz' | 'quizResult' | 'moduleComplete' | 'allDone';

interface LearnerOnboardingProps {
  onComplete: () => void;
}

export const LearnerOnboarding: React.FC<LearnerOnboardingProps> = ({ onComplete }) => {
  const { user, updateLearningProgress } = useAuth();
  const progress = user?.learningProgress || { currentModule: 0, completedLessons: [], xp: 0, streak: 0 };

  const [view, setView] = useState<ViewState>('moduleMap');
  const [activeModule, setActiveModule] = useState<LearningModule>(learningModules[progress.currentModule]);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const totalLessons = learningModules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = progress.completedLessons.length;
  const totalXP = progress.xp;

  const currentLesson: Lesson = activeModule.lessons[activeLessonIndex];
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const startLesson = (mod: LearningModule, lessonIdx: number = 0) => {
    setActiveModule(mod);
    setActiveLessonIndex(lessonIdx);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setView('lessonContent');
  };

  const goToQuiz = () => {
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setView('quiz');
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    const correct = selectedAnswer === currentLesson.quiz.correctIndex;
    setIsCorrect(correct);
    setAnswerSubmitted(true);

    const xpGain = correct ? 15 : 5;
    const newCompleted = [...progress.completedLessons, currentLesson.id];
    updateLearningProgress({
      completedLessons: newCompleted,
      xp: progress.xp + xpGain,
      streak: progress.streak + 1,
    });

    setView('quizResult');
  };

  const nextLesson = () => {
    setShowCelebration(false);
    if (activeLessonIndex < activeModule.lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
      setSelectedAnswer(null);
      setAnswerSubmitted(false);
      setView('lessonContent');
    } else {
      // Module complete
      const nextModuleIdx = activeModule.id + 1;
      if (nextModuleIdx < learningModules.length) {
        updateLearningProgress({ currentModule: nextModuleIdx });
      }
      setView('moduleComplete');
      setShowCelebration(true);
    }
  };

  const continueFromModuleComplete = () => {
    setShowCelebration(false);
    const nextModuleIdx = activeModule.id + 1;
    if (nextModuleIdx < learningModules.length) {
      setActiveModule(learningModules[nextModuleIdx]);
      setActiveLessonIndex(0);
      setView('moduleMap');
    } else {
      setView('allDone');
    }
  };

  const isLessonCompleted = (lessonId: string) => progress.completedLessons.includes(lessonId);

  // ── Module Map View ──
  if (view === 'moduleMap') {
    return (
      <div className="min-h-screen pb-32" style={{ background: '#f8fafb' }}>
        {/* Top Bar */}
        <div className="sticky top-0 z-30 px-4 py-4" style={{ background: 'rgba(248,250,251,0.92)', backdropFilter: 'blur(12px)' }}>
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg" style={{ background: '#181D1F', color: 'white' }}>
                  🐝
                </div>
                <div>
                  <h2 className="text-sm font-bold" style={{ fontFamily: 'Gabarito, sans-serif', color: '#181D1F' }}>
                    FundBee Academy
                  </h2>
                  <p className="text-xs" style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}>
                    Financial Literacy Journey
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: '#FFF5F0' }}>
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  <span className="text-xs font-bold" style={{ fontFamily: 'Archivo, sans-serif', color: '#C2410C' }}>
                    {progress.streak}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: '#FEF3C7' }}>
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold" style={{ fontFamily: 'Archivo, sans-serif', color: '#B45309' }}>
                    {totalXP} XP
                  </span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: '#E7E7E9' }}>
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #10B981, #059669)',
                }}
              />
            </div>
            <p className="text-xs mt-1.5 text-right" style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}>
              {completedCount}/{totalLessons} lessons complete
            </p>
          </div>
        </div>

        {/* Module Cards */}
        <div className="max-w-xl mx-auto px-4 pt-6 space-y-4">
          <div className="text-center mb-8">
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
              style={{ fontFamily: 'Gabarito, sans-serif', color: '#181D1F' }}
            >
              Your Learning Path
            </h1>
            <p className="text-sm" style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}>
              Master financial literacy one lesson at a time
            </p>
          </div>

          {learningModules.map((mod, idx) => {
            const allDone = mod.lessons.every((l) => isLessonCompleted(l.id));
            const unlocked = idx <= progress.currentModule;
            const nextLessonIdx = mod.lessons.findIndex((l) => !isLessonCompleted(l.id));

            return (
              <div key={mod.id} className="animate-fade-up" style={{ animationDelay: `${idx * 0.06}s` }}>
                <button
                  onClick={() => unlocked && startLesson(mod, nextLessonIdx >= 0 ? nextLessonIdx : 0)}
                  disabled={!unlocked}
                  className={`w-full text-left p-5 rounded-3xl border-2 transition-all duration-300 ${
                    unlocked ? 'cursor-pointer hover:shadow-lg' : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{
                    borderColor: allDone ? mod.color + '55' : '#E7E7E9',
                    background: allDone
                      ? `linear-gradient(135deg, ${mod.bgColor}, white)`
                      : '#ffffff',
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Module icon */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm"
                      style={{
                        background: unlocked
                          ? `linear-gradient(135deg, ${mod.color}, ${mod.color}CC)`
                          : '#E7E7E9',
                      }}
                    >
                      {allDone ? (
                        <CheckCircle2 className="w-7 h-7 text-white" />
                      ) : (
                        <span className={unlocked ? '' : 'grayscale'}>{mod.icon}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-bold uppercase tracking-wider"
                          style={{ fontFamily: 'Archivo, sans-serif', color: mod.color }}
                        >
                          Module {idx + 1}
                        </span>
                        {allDone && (
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ background: mod.color }}
                          >
                            Complete
                          </span>
                        )}
                      </div>
                      <h3
                        className="text-lg font-bold mb-0.5"
                        style={{ fontFamily: 'Gabarito, sans-serif', color: '#181D1F' }}
                      >
                        {mod.title}
                      </h3>
                      <p className="text-xs mb-3" style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}>
                        {mod.subtitle}
                      </p>

                      {/* Lesson dots */}
                      <div className="flex items-center gap-2">
                        {mod.lessons.map((lesson, li) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-1"
                          >
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                              style={{
                                fontFamily: 'Archivo, sans-serif',
                                background: isLessonCompleted(lesson.id) ? mod.color : '#F3F4F6',
                                color: isLessonCompleted(lesson.id) ? 'white' : '#9CA3AF',
                              }}
                            >
                              {isLessonCompleted(lesson.id) ? '✓' : li + 1}
                            </div>
                            {li < mod.lessons.length - 1 && (
                              <div
                                className="w-4 h-0.5"
                                style={{
                                  background: isLessonCompleted(lesson.id) ? mod.color : '#E5E7EB',
                                }}
                              />
                            )}
                          </div>
                        ))}
                        {unlocked && (
                          <ChevronRight
                            className="w-4 h-4 ml-auto shrink-0"
                            style={{ color: '#7d7d87' }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Lesson Content View ──
  if (view === 'lessonContent') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#f8fafb' }}>
        {/* Header */}
        <div className="px-4 py-4" style={{ background: 'rgba(248,250,251,0.92)', backdropFilter: 'blur(12px)' }}>
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => setView('moduleMap')}
                className="p-2 rounded-xl hover:bg-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" style={{ color: '#7d7d87' }} />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ fontFamily: 'Archivo, sans-serif', color: activeModule.color }}>
                    Module {activeModule.id + 1}
                  </span>
                  <span className="text-xs" style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}>
                    · Lesson {activeLessonIndex + 1}/{activeModule.lessons.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: '#FEF3C7' }}>
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold" style={{ fontFamily: 'Archivo, sans-serif', color: '#B45309' }}>
                  {totalXP} XP
                </span>
              </div>
            </div>

            {/* Lesson progress bar */}
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#E7E7E9' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((activeLessonIndex) / activeModule.lessons.length) * 100}%`,
                  background: activeModule.color,
                }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="max-w-xl w-full animate-fade-up">
            <div
              className="rounded-3xl p-7 sm:p-10 border-2"
              style={{
                background: '#ffffff',
                borderColor: activeModule.color + '33',
                boxShadow: `0 8px 40px ${activeModule.color}15`,
              }}
            >
              {/* Lesson icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
                style={{ background: activeModule.bgColor }}
              >
                {currentLesson.icon}
              </div>

              <h2
                className="text-2xl sm:text-3xl font-bold mb-4"
                style={{ fontFamily: 'Gabarito, sans-serif', color: '#181D1F' }}
              >
                {currentLesson.title}
              </h2>

              {/* Main content */}
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ fontFamily: 'Archivo, sans-serif', color: '#424647' }}
              >
                {currentLesson.content}
              </p>

              {/* Analogy box */}
              <div
                className="p-5 rounded-2xl mb-6"
                style={{ background: activeModule.bgColor }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">💡</span>
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ fontFamily: 'Archivo, sans-serif', color: activeModule.color }}
                  >
                    Think of it this way
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: 'Archivo, sans-serif', color: '#424647' }}
                >
                  {currentLesson.analogy}
                </p>
              </div>

              {/* Key takeaway */}
              <div
                className="p-4 rounded-2xl flex items-start gap-3"
                style={{ background: '#F0FDF9', border: '1px solid #D5E2DA' }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#10B981' }}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <span
                    className="text-xs font-bold block mb-0.5"
                    style={{ fontFamily: 'Archivo, sans-serif', color: '#047857' }}
                  >
                    Key Takeaway
                  </span>
                  <p
                    className="text-sm font-medium"
                    style={{ fontFamily: 'Archivo, sans-serif', color: '#065F46' }}
                  >
                    {currentLesson.keyTakeaway}
                  </p>
                </div>
              </div>
            </div>

            {/* Continue button */}
            <div className="text-center mt-8">
              <button
                onClick={goToQuiz}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-[15px] transition-all cursor-pointer"
                style={{
                  fontFamily: 'Gabarito, sans-serif',
                  background: activeModule.color,
                  color: 'white',
                  boxShadow: `0 8px 32px ${activeModule.color}40`,
                }}
              >
                <span>Got it — Test me!</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz View ──
  if (view === 'quiz') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#f8fafb' }}>
        {/* Header */}
        <div className="px-4 py-4" style={{ background: 'rgba(248,250,251,0.92)', backdropFilter: 'blur(12px)' }}>
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => setView('lessonContent')}
                className="p-2 rounded-xl hover:bg-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" style={{ color: '#7d7d87' }} />
              </button>
              <span
                className="text-sm font-bold"
                style={{ fontFamily: 'Gabarito, sans-serif', color: '#181D1F' }}
              >
                Quick Check
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#E7E7E9' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((activeLessonIndex + 0.5) / activeModule.lessons.length) * 100}%`,
                  background: activeModule.color,
                }}
              />
            </div>
          </div>
        </div>

        {/* Quiz content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="max-w-xl w-full animate-fade-up">
            <div
              className="rounded-3xl p-7 sm:p-10 border-2"
              style={{
                background: '#ffffff',
                borderColor: '#E7E7E9',
                boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5" style={{ color: activeModule.color }} />
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ fontFamily: 'Archivo, sans-serif', color: activeModule.color }}
                >
                  Knowledge Check
                </span>
              </div>

              <h3
                className="text-xl sm:text-2xl font-bold mb-8"
                style={{ fontFamily: 'Gabarito, sans-serif', color: '#181D1F' }}
              >
                {currentLesson.quiz.question}
              </h3>

              <div className="space-y-3">
                {currentLesson.quiz.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => !answerSubmitted && setSelectedAnswer(idx)}
                      disabled={answerSubmitted}
                      className="w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer"
                      style={{
                        borderColor: isSelected ? activeModule.color : '#E7E7E9',
                        background: isSelected ? activeModule.color + '10' : '#ffffff',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{
                            fontFamily: 'Archivo, sans-serif',
                            background: isSelected ? activeModule.color : '#F3F4F6',
                            color: isSelected ? 'white' : '#7d7d87',
                          }}
                        >
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span
                          className="text-sm font-medium"
                          style={{ fontFamily: 'Archivo, sans-serif', color: '#181D1F' }}
                        >
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="text-center mt-8">
              <button
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-[15px] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  fontFamily: 'Gabarito, sans-serif',
                  background: selectedAnswer !== null ? activeModule.color : '#E7E7E9',
                  color: 'white',
                  boxShadow: selectedAnswer !== null ? `0 8px 32px ${activeModule.color}40` : 'none',
                }}
              >
                <span>Check Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz Result View ──
  if (view === 'quizResult') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: '#f8fafb' }}>
        <div className="max-w-xl w-full animate-fade-up">
          <div
            className="rounded-3xl p-7 sm:p-10 border-2 text-center"
            style={{
              background: '#ffffff',
              borderColor: isCorrect ? '#10B98155' : '#EF444455',
              boxShadow: `0 8px 40px ${isCorrect ? '#10B981' : '#EF4444'}20`,
            }}
          >
            {/* Result icon */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: isCorrect
                  ? 'linear-gradient(135deg, #10B981, #059669)'
                  : 'linear-gradient(135deg, #EF4444, #DC2626)',
              }}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-10 h-10 text-white" />
              ) : (
                <XCircle className="w-10 h-10 text-white" />
              )}
            </div>

            <h2
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ fontFamily: 'Gabarito, sans-serif', color: '#181D1F' }}
            >
              {isCorrect ? 'Excellent!' : 'Not quite!'}
            </h2>

            <p
              className="text-sm mb-4"
              style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}
            >
              {isCorrect
                ? 'You nailed it! Here is 15 XP.'
                : 'Here is 5 XP for trying. You will get it next time!'}
            </p>

            {/* XP gain */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: '#FEF3C7' }}
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span
                className="text-sm font-bold"
                style={{ fontFamily: 'Archivo, sans-serif', color: '#B45309' }}
              >
                +{isCorrect ? 15 : 5} XP
              </span>
            </div>

            {/* Explanation */}
            <div
              className="p-5 rounded-2xl text-left mb-6"
              style={{ background: '#F8F4EF' }}
            >
              <span
                className="text-xs font-bold uppercase tracking-wider block mb-2"
                style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}
              >
                💡 Explanation
              </span>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: 'Archivo, sans-serif', color: '#424647' }}
              >
                {currentLesson.quiz.explanation}
              </p>
            </div>

            {/* Correct answer highlight if wrong */}
            {!isCorrect && (
              <div
                className="p-4 rounded-2xl text-left mb-6"
                style={{ background: '#F0FDF9', border: '1px solid #D5E2DA' }}
              >
                <span
                  className="text-xs font-bold block mb-1"
                  style={{ fontFamily: 'Archivo, sans-serif', color: '#047857' }}
                >
                  Correct Answer:
                </span>
                <p
                  className="text-sm"
                  style={{ fontFamily: 'Archivo, sans-serif', color: '#065F46' }}
                >
                  {currentLesson.quiz.options[currentLesson.quiz.correctIndex]}
                </p>
              </div>
            )}
          </div>

          {/* Continue */}
          <div className="text-center mt-8">
            <button
              onClick={nextLesson}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-[15px] transition-all cursor-pointer"
              style={{
                fontFamily: 'Gabarito, sans-serif',
                background: activeModule.color,
                color: 'white',
                boxShadow: `0 8px 32px ${activeModule.color}40`,
              }}
            >
              <span>{activeLessonIndex < activeModule.lessons.length - 1 ? 'Next Lesson' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Module Complete View ──
  if (view === 'moduleComplete') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: '#f8fafb' }}>
        <div className="max-w-xl w-full animate-fade-up">
          <div
            className="rounded-3xl p-7 sm:p-10 border-2 text-center overflow-hidden relative"
            style={{
              background: `linear-gradient(135deg, ${activeModule.bgColor}, white)`,
              borderColor: activeModule.color + '44',
              boxShadow: `0 8px 40px ${activeModule.color}25`,
            }}
          >
            {/* Celebration animation */}
            {showCelebration && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-celebration"
                    style={{
                      left: `${10 + Math.random() * 80}%`,
                      top: '-10%',
                      animationDelay: `${i * 0.1}s`,
                      fontSize: `${16 + Math.random() * 12}px`,
                    }}
                  >
                    {['🎉', '⭐', '🔥', '✨', '🎊', '💪'][i % 6]}
                  </div>
                ))}
              </div>
            )}

            <div className="relative z-10">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{
                  background: `linear-gradient(135deg, ${activeModule.color}, ${activeModule.color}CC)`,
                }}
              >
                <Trophy className="w-10 h-10 text-white" />
              </div>

              <h2
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ fontFamily: 'Gabarito, sans-serif', color: '#181D1F' }}
              >
                Module Complete!
              </h2>
              <p
                className="text-sm mb-6"
                style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}
              >
                You finished "{activeModule.title}" — great work!
              </p>

              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ fontFamily: 'Gabarito, sans-serif', color: activeModule.color }}
                  >
                    {activeModule.lessons.length * 15}
                  </div>
                  <div
                    className="text-xs"
                    style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}
                  >
                    XP Earned
                  </div>
                </div>
                <div className="w-px h-8" style={{ background: '#E7E7E9' }} />
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ fontFamily: 'Gabarito, sans-serif', color: activeModule.color }}
                  >
                    {progress.completedLessons.length}
                  </div>
                  <div
                    className="text-xs"
                    style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}
                  >
                    Lessons Done
                  </div>
                </div>
              </div>

              {/* Next module preview */}
              {activeModule.id + 1 < learningModules.length && (
                <div
                  className="p-4 rounded-2xl text-left mb-6"
                  style={{ background: 'white', border: '1px solid #E7E7E9' }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-wider block mb-2"
                    style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}
                  >
                    Up Next
                  </span>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: learningModules[activeModule.id + 1].bgColor }}
                    >
                      {learningModules[activeModule.id + 1].icon}
                    </div>
                    <div>
                      <div
                        className="text-sm font-bold"
                        style={{ fontFamily: 'Gabarito, sans-serif', color: '#181D1F' }}
                      >
                        {learningModules[activeModule.id + 1].title}
                      </div>
                      <div
                        className="text-xs"
                        style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}
                      >
                        {learningModules[activeModule.id + 1].subtitle}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={continueFromModuleComplete}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-[15px] transition-all cursor-pointer"
              style={{
                fontFamily: 'Gabarito, sans-serif',
                background: '#181D1F',
                color: 'white',
                boxShadow: '0 8px 32px rgba(24,29,31,0.2)',
              }}
            >
              <span>
                {activeModule.id + 1 < learningModules.length
                  ? 'Start Next Module'
                  : 'Finish Journey'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── All Done View ──
  if (view === 'allDone') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: '#f8fafb' }}>
        <div className="max-w-xl w-full animate-fade-up text-center">
          {/* Celebration */}
          <div className="relative mb-8">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-celebration"
                  style={{
                    left: `${5 + Math.random() * 90}%`,
                    top: '-10%',
                    animationDelay: `${i * 0.08}s`,
                    fontSize: `${18 + Math.random() * 14}px`,
                  }}
                >
                  {['🎉', '🌟', '🏆', '✨', '🎊', '💪', '🧠', '📈'][i % 8]}
                </div>
              ))}
            </div>

            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10"
              style={{
                background: 'linear-gradient(135deg, #FD956D, #e07840)',
                boxShadow: '0 12px 40px rgba(253,149,109,0.35)',
              }}
            >
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'Gabarito, sans-serif', color: '#181D1F' }}
          >
            You did it! 🎉
          </h1>

          <p
            className="text-lg mb-8 max-w-md mx-auto"
            style={{ fontFamily: 'Archivo, sans-serif', color: '#424647' }}
          >
            You have completed the FundBee Financial Literacy Journey. You now understand the foundations of money, investing, and smart decision-making.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-10">
            <div className="text-center">
              <div
                className="text-3xl font-bold coral-gradient-text"
                style={{ fontFamily: 'Gabarito, sans-serif' }}
              >
                {totalXP}
              </div>
              <div
                className="text-xs"
                style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}
              >
                Total XP
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-3xl font-bold coral-gradient-text"
                style={{ fontFamily: 'Gabarito, sans-serif' }}
              >
                {completedCount}
              </div>
              <div
                className="text-xs"
                style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}
              >
                Lessons Complete
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-3xl font-bold coral-gradient-text"
                style={{ fontFamily: 'Gabarito, sans-serif' }}
              >
                5
              </div>
              <div
                className="text-xs"
                style={{ fontFamily: 'Archivo, sans-serif', color: '#7d7d87' }}
              >
                Modules Mastered
              </div>
            </div>
          </div>

          {/* What you learned */}
          <div
            className="rounded-3xl p-6 text-left mb-8"
            style={{ background: '#ffffff', border: '1px solid #E7E7E9' }}
          >
            <h3
              className="text-sm font-bold mb-4"
              style={{ fontFamily: 'Gabarito, sans-serif', color: '#181D1F' }}
            >
              What you now understand:
            </h3>
            <div className="space-y-2.5">
              {learningModules.map((mod) => (
                <div key={mod.id} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: mod.color }} />
                  <span
                    className="text-sm"
                    style={{ fontFamily: 'Archivo, sans-serif', color: '#424647' }}
                  >
                    {mod.title} — {mod.subtitle}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onComplete}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-[15px] transition-all cursor-pointer"
            style={{
              fontFamily: 'Gabarito, sans-serif',
              background: '#181D1F',
              color: 'white',
              boxShadow: '0 8px 32px rgba(24,29,31,0.2)',
            }}
          >
            <span>Enter FundBee Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default LearnerOnboarding;
