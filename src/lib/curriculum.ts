import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "src", "content", "curriculum");

export type StepMetronome = {
  bpm: number;
  signature: "4/4" | "3/4" | "6/8";
};

export type StepFrontmatter = {
  id: string;
  chapter: string;
  order: number;
  title: string;
  estimatedMinutes?: number;
  introduces?: string[];
  metronome?: StepMetronome;
};

export type Step = StepFrontmatter & {
  fullId: string;
  body: string;
};

export type Chapter = {
  id: string;
  title: string;
  summary: string;
  steps: Step[];
};

export const CHAPTER_META: Record<string, { title: string; summary: string }> = {
  "01-getting-started": {
    title: "ギターをはじめる前に",
    summary: "パーツの名前と、必要な道具を知る",
  },
  "02-holding": {
    title: "構え方",
    summary: "座り方と、左右の手の構え",
  },
  "03-first-sounds": {
    title: "はじめての音",
    summary: "開放弦・チューニング・ダウンストローク",
  },
  "04-basic-chords": {
    title: "基本コードを覚える",
    summary: "Em / Am / C / G / D",
  },
  "05-strumming": {
    title: "ストロークパターン",
    summary: "4分音符・ダウンアップ・8ビート",
  },
  "06-chord-change": {
    title: "コードチェンジ",
    summary: "コード間を滑らかにつなぐ",
  },
  "07-first-song": {
    title: "1曲弾く",
    summary: "選んだ目標曲を通しで弾く",
  },
};

export async function loadCurriculum(): Promise<Chapter[]> {
  const chapterDirs = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
  const chapters: Chapter[] = [];

  for (const dir of chapterDirs) {
    if (!dir.isDirectory()) continue;
    const chapterId = dir.name;
    const chapterPath = path.join(CONTENT_ROOT, chapterId);
    const files = await fs.readdir(chapterPath);
    const steps: Step[] = [];
    for (const f of files) {
      if (!f.endsWith(".mdx") && !f.endsWith(".md")) continue;
      const filePath = path.join(chapterPath, f);
      const raw = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(raw);
      const fm = data as StepFrontmatter;
      steps.push({
        ...fm,
        fullId: `${chapterId}/${fm.id}`,
        body: content,
      });
    }
    steps.sort((a, b) => a.order - b.order);
    const meta = CHAPTER_META[chapterId] ?? {
      title: chapterId,
      summary: "",
    };
    chapters.push({
      id: chapterId,
      title: meta.title,
      summary: meta.summary,
      steps,
    });
  }

  chapters.sort((a, b) => a.id.localeCompare(b.id));
  return chapters;
}

export async function loadStep(fullId: string): Promise<Step | null> {
  const [chapterId] = fullId.split("/");
  if (!chapterId) return null;
  const chapters = await loadCurriculum();
  for (const ch of chapters) {
    const step = ch.steps.find((s) => s.fullId === fullId);
    if (step) return step;
  }
  return null;
}

export async function getAllStepIds(): Promise<string[]> {
  const chapters = await loadCurriculum();
  return chapters.flatMap((c) => c.steps.map((s) => s.fullId));
}

export async function getAdjacentSteps(fullId: string): Promise<{
  prev: string | null;
  next: string | null;
}> {
  const ids = await getAllStepIds();
  const i = ids.indexOf(fullId);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? ids[i - 1] : null,
    next: i < ids.length - 1 ? ids[i + 1] : null,
  };
}
