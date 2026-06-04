"use client";

import { useState } from "react";
import Link from "next/link";
import { STEP_LABELS } from "@web-hoc-stripe/shared";

type Question = {
  id: string;
  step: number;
  question: string;
  options: [string, string, string];
};

type Breakdown = {
  questionId: string;
  correct: boolean;
  correctIndex?: number;
  explanation: string;
};

export function QuizGame() {
  const [playId, setPlayId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    score: number;
    total: number;
    percent: number;
    breakdown: Breakdown[];
  } | null>(null);

  async function startPlay() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/plays/start", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? data.error ?? "Không thể bắt đầu");
        return;
      }
      setPlayId(data.playId);
      setQuestions(data.questions);
      setIndex(0);
      setAnswers([]);
      setSelected(null);
    } catch {
      setError("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  }

  function confirmAnswer() {
    if (selected === null || !questions.length) return;
    const next = [...answers, selected];
    setAnswers(next);
    setSelected(null);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      submitPlay(next);
    }
  }

  async function submitPlay(finalAnswers: number[]) {
    if (!playId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/plays/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playId, answers: finalAnswers }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Nộp bài lỗi");
        return;
      }
      setResult(data);
      setPlayId(null);
      setQuestions([]);
    } catch {
      setError("Lỗi nộp bài");
    } finally {
      setLoading(false);
    }
  }

  const current = questions[index];

  if (result) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-indigo-700">Kết quả lượt chơi</h2>
        <p className="mt-2 text-3xl font-semibold">
          {result.score}/{result.total} ({result.percent}%)
        </p>
        <ul className="mt-4 space-y-2 text-sm max-h-64 overflow-y-auto">
          {result.breakdown?.map((b, i) => (
            <li
              key={b.questionId}
              className={b.correct ? "text-green-700" : "text-red-700"}
            >
              Câu {i + 1}: {b.correct ? "Đúng" : "Sai"} — {b.explanation}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={startPlay}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Chơi lượt mới
          </button>
          <Link href="/pricing" className="rounded-xl border px-4 py-2 hover:bg-slate-50">
            Nâng cấp
          </Link>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <h2 className="text-xl font-semibold">Quiz — Dự án web + Stripe</h2>
        <p className="mt-2 text-slate-600">Mỗi lượt: 10 câu trắc nghiệm (3 lựa chọn).</p>
        {error && (
          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4 text-amber-900">
            <p>{error}</p>
            <Link href="/pricing" className="mt-2 inline-block text-indigo-600 font-medium">
              Xem gói Pro / Vip →
            </Link>
          </div>
        )}
        <button
          type="button"
          onClick={startPlay}
          disabled={loading}
          className="mt-6 rounded-xl bg-indigo-600 px-8 py-3 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Đang tải..." : "Bắt đầu lượt mới"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex justify-between text-sm text-slate-500 mb-4">
        <span>
          Câu {index + 1}/{questions.length}
        </span>
        <span>Bước {current.step}: {STEP_LABELS[current.step]}</span>
      </div>
      <h2 className="text-lg font-semibold text-slate-900">{current.question}</h2>
      <ul className="mt-4 space-y-2">
        {current.options.map((opt, i) => (
          <li key={opt}>
            <button
              type="button"
              onClick={() => setSelected(i)}
              className={`w-full text-left rounded-xl border px-4 py-3 transition ${
                selected === i
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-200 hover:border-indigo-300"
              }`}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={confirmAnswer}
        disabled={selected === null || loading}
        className="mt-6 w-full rounded-xl bg-indigo-600 py-2.5 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
      >
        {index + 1 < questions.length ? "Câu tiếp" : "Nộp bài"}
      </button>
    </div>
  );
}
