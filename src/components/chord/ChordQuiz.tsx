"use client";

import { useCallback, useEffect, useState } from "react";

import { ChordDiagram } from "./ChordDiagram";
import { CHORDS, type ChordShape } from "./chord-data";

const POOL = ["Em", "Am", "C", "G", "D", "A", "E", "Dm", "F"];
const TOTAL_QUESTIONS = 10;
const CHOICES = 4;

type Question = {
  answer: ChordShape;
  options: ChordShape[];
};

function makeQuestion(): Question {
  const answerName = POOL[Math.floor(Math.random() * POOL.length)];
  const answer = CHORDS[answerName];
  const others = POOL.filter((n) => n !== answerName);
  shuffle(others);
  const optionNames = [answerName, ...others.slice(0, CHOICES - 1)];
  shuffle(optionNames);
  return {
    answer,
    options: optionNames.map((n) => CHORDS[n]).filter(Boolean),
  };
}

function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export function ChordQuiz() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionNo, setQuestionNo] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const next = useCallback(() => {
    setPicked(null);
    setQuestion(makeQuestion());
  }, []);

  useEffect(() => {
    next();
  }, [next]);

  function onPick(name: string) {
    if (!question || picked !== null) return;
    setPicked(name);
    if (name === question.answer.name) {
      setCorrectCount((c) => c + 1);
    }
  }

  function onAdvance() {
    if (questionNo >= TOTAL_QUESTIONS) {
      setDone(true);
      return;
    }
    setQuestionNo((n) => n + 1);
    next();
  }

  function restart() {
    setQuestionNo(1);
    setCorrectCount(0);
    setDone(false);
    next();
  }

  if (!question) {
    return (
      <div className="card-paper rounded-md p-6 text-center text-sm text-[color:var(--ink-soft)]">
        準備中…
      </div>
    );
  }

  if (done) {
    const percent = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
    return (
      <div className="card-paper rounded-md p-6 flex flex-col items-center gap-4">
        <h2 className="font-hand text-3xl">結果</h2>
        <p className="text-5xl font-hand tabular-nums">
          {correctCount}
          <span className="text-base text-[color:var(--ink-soft)]">
            {" "}
            / {TOTAL_QUESTIONS}
          </span>
        </p>
        <p className="text-[color:var(--ink-soft)] text-sm">正答率 {percent}%</p>
        <button
          type="button"
          onClick={restart}
          className="rounded-md px-5 py-2 bg-[color:var(--accent)] text-white"
        >
          もう一度やる
        </button>
      </div>
    );
  }

  return (
    <div className="card-paper rounded-md p-6 flex flex-col items-center gap-5">
      <div className="self-stretch flex items-center justify-between text-sm text-[color:var(--ink-soft)]">
        <span>
          第 {questionNo} 問 / {TOTAL_QUESTIONS}
        </span>
        <span>正解 {correctCount}</span>
      </div>

      <ChordDiagram
        chord={question.answer}
        size="lg"
        showName={false}
        showPhoto={false}
      />

      <p className="text-sm text-[color:var(--ink-soft)]">
        この押さえ方のコード名は？
      </p>

      <ul className="grid grid-cols-2 gap-3 w-full">
        {question.options.map((opt) => {
          const isAnswer = opt.name === question.answer.name;
          const isPicked = picked === opt.name;
          const showResult = picked !== null;
          let cls =
            "border-[color:var(--rule)] hover:bg-[color:var(--highlight)]/50";
          if (showResult) {
            if (isAnswer) {
              cls =
                "border-[color:var(--accent)] bg-[color:var(--highlight)] text-[color:var(--accent)]";
            } else if (isPicked) {
              cls = "border-red-400 text-red-600 line-through";
            } else {
              cls = "border-[color:var(--rule)] opacity-60";
            }
          }
          return (
            <li key={opt.name}>
              <button
                type="button"
                disabled={picked !== null}
                onClick={() => onPick(opt.name)}
                className={`w-full rounded-md border px-4 py-3 text-lg font-hand transition-colors ${cls}`}
              >
                {opt.name}
              </button>
            </li>
          );
        })}
      </ul>

      {picked !== null && (
        <button
          type="button"
          onClick={onAdvance}
          className="rounded-md px-5 py-2 bg-[color:var(--accent)] text-white"
        >
          {questionNo >= TOTAL_QUESTIONS ? "結果を見る" : "次の問題"}
        </button>
      )}
    </div>
  );
}
