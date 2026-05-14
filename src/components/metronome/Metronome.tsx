"use client";

import { useEffect, useRef, useState } from "react";

import { MetronomeEngine, type TimeSignature } from "./audio-engine";

type Props = {
  defaultBpm?: number;
  defaultSignature?: TimeSignature;
};

const MIN_BPM = 40;
const MAX_BPM = 200;

export function Metronome({
  defaultBpm = 80,
  defaultSignature = "4/4",
}: Props) {
  const [bpm, setBpm] = useState(defaultBpm);
  const [signature, setSignature] = useState<TimeSignature>(defaultSignature);
  const [running, setRunning] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [tilt, setTilt] = useState<"L" | "R">("L");
  const engineRef = useRef<MetronomeEngine | null>(null);

  useEffect(() => {
    const engine = new MetronomeEngine({
      bpm: defaultBpm,
      signature: defaultSignature,
      onBeat: (b) => setCurrentBeat(b),
    });
    engineRef.current = engine;
    return () => engine.dispose();
  }, [defaultBpm, defaultSignature]);

  useEffect(() => {
    engineRef.current?.setBpm(bpm);
  }, [bpm]);

  useEffect(() => {
    engineRef.current?.setSignature(signature);
  }, [signature]);

  useEffect(() => {
    if (currentBeat < 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTilt((t) => (t === "L" ? "R" : "L"));
  }, [currentBeat]);

  function toggle() {
    if (!engineRef.current) return;
    if (running) {
      engineRef.current.stop();
      setRunning(false);
      setCurrentBeat(-1);
    } else {
      engineRef.current.start();
      setRunning(true);
    }
  }

  const beats = signature === "3/4" ? 3 : signature === "6/8" ? 6 : 4;
  const beatMs = Math.round((signature === "6/8" ? 30000 : 60000) / bpm);

  return (
    <div className="card-paper rounded-md p-5 flex flex-col gap-4">
      <div className="flex justify-center">
        <PendulumSvg
          tilt={tilt}
          running={running}
          beatMs={beatMs}
          isDownbeat={currentBeat === 0}
        />
      </div>

      <div className="flex items-baseline gap-2 border-b border-dashed border-[color:var(--rule)] pb-2">
        <span className="font-hand text-4xl tabular-nums text-[color:var(--ink)]">
          {bpm}
        </span>
        <span className="text-sm text-[color:var(--ink-soft)]">BPM</span>
        <span className="ml-auto text-xs text-[color:var(--ink-soft)]">
          拍子 {signature}
        </span>
      </div>

      <input
        type="range"
        min={MIN_BPM}
        max={MAX_BPM}
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
        aria-label="BPM"
        className="w-full accent-[color:var(--accent)]"
      />

      <div className="flex gap-2 flex-wrap">
        {(["4/4", "3/4", "6/8"] as const).map((sig) => (
          <button
            key={sig}
            type="button"
            onClick={() => setSignature(sig)}
            className={`text-xs rounded-md px-3 py-1 border ${
              signature === sig
                ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)]"
                : "border-[color:var(--rule)] text-[color:var(--ink-soft)] hover:bg-[color:var(--highlight)]/50"
            }`}
          >
            {sig}
          </button>
        ))}
        <button
          type="button"
          onClick={toggle}
          className={`ml-auto rounded-md px-5 py-1.5 text-sm font-medium text-white ${
            running
              ? "bg-[color:var(--ink-soft)]"
              : "bg-[color:var(--accent)]"
          }`}
        >
          {running ? "停止" : "開始"}
        </button>
      </div>

      <ul
        className="flex gap-2 items-center justify-center pt-1"
        aria-label="拍数表示"
      >
        {Array.from({ length: beats }).map((_, i) => (
          <li
            key={i}
            className={`h-3 w-3 rounded-full border transition-colors ${
              i === currentBeat
                ? i === 0
                  ? "bg-[color:var(--accent)] border-[color:var(--accent)]"
                  : "bg-[color:var(--ink-soft)] border-[color:var(--ink-soft)]"
                : "border-[color:var(--rule)]"
            }`}
          />
        ))}
      </ul>
    </div>
  );
}

function PendulumSvg({
  tilt,
  running,
  beatMs,
  isDownbeat,
}: {
  tilt: "L" | "R";
  running: boolean;
  beatMs: number;
  isDownbeat: boolean;
}) {
  const rotateDeg = running ? (tilt === "L" ? -22 : 22) : 0;
  return (
    <svg
      width={160}
      height={210}
      viewBox="0 0 160 210"
      role="img"
      aria-label="メトロノーム"
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--paper)" />
          <stop offset="100%" stopColor="var(--paper-warm)" />
        </linearGradient>
      </defs>

      {/* Body (trapezoid) */}
      <polygon
        points="40,200 120,200 100,40 60,40"
        fill="url(#bodyGrad)"
        stroke="var(--ink)"
        strokeWidth={1.5}
      />

      {/* Body scale marks */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const y = 60 + i * 22;
        const w = 14;
        return (
          <line
            key={i}
            x1={80 - w}
            x2={80 - 4}
            y1={y}
            y2={y}
            stroke="var(--ink-soft)"
            strokeOpacity={0.5}
            strokeWidth={1}
          />
        );
      })}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const y = 60 + i * 22;
        const w = 14;
        return (
          <line
            key={`r-${i}`}
            x1={80 + 4}
            x2={80 + w}
            y1={y}
            y2={y}
            stroke="var(--ink-soft)"
            strokeOpacity={0.5}
            strokeWidth={1}
          />
        );
      })}

      {/* Pivot */}
      <circle
        cx={80}
        cy={42}
        r={3.5}
        fill="var(--ink)"
      />

      {/* Pendulum group rotates from pivot */}
      <g
        style={{
          transform: `rotate(${rotateDeg}deg)`,
          transformOrigin: "80px 42px",
          transition: `transform ${Math.max(80, beatMs - 30)}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`,
        }}
      >
        {/* Rod */}
        <line
          x1={80}
          y1={42}
          x2={80}
          y2={-20}
          stroke="var(--ink)"
          strokeWidth={2}
        />
        {/* Weight (tear-drop) */}
        <rect
          x={72}
          y={-12}
          width={16}
          height={22}
          rx={3}
          fill="var(--accent)"
          stroke="var(--ink)"
          strokeWidth={1.2}
        />
        {/* Top tick highlight */}
        <circle
          cx={80}
          cy={-22}
          r={4}
          fill={isDownbeat && running ? "var(--accent)" : "var(--ink-soft)"}
          opacity={running ? 1 : 0.4}
        />
      </g>

      {/* Base shadow */}
      <ellipse
        cx={80}
        cy={203}
        rx={36}
        ry={3}
        fill="var(--ink)"
        opacity={0.15}
      />
    </svg>
  );
}
