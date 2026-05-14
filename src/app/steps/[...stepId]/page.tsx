import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";

import { ChordDiagram } from "@/components/chord/ChordDiagram";
import { Metronome } from "@/components/metronome/Metronome";
import { StepActions } from "@/components/curriculum/StepActions";
import {
  getAdjacentSteps,
  loadStep,
  type StepMetronome,
} from "@/lib/curriculum";

const components = { ChordDiagram, Metronome };

type Params = { stepId: string[] };

export default async function StepPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { stepId } = await params;
  if (!stepId || stepId.length < 2) notFound();
  const fullId = stepId.join("/");
  const step = await loadStep(fullId);
  if (!step) notFound();

  const { content } = await compileMDX({
    source: step.body,
    components,
    options: { parseFrontmatter: false },
  });

  const { prev, next } = await getAdjacentSteps(fullId);

  return (
    <article className="flex flex-col gap-6">
      <header>
        <Link
          href="/"
          className="text-xs text-[color:var(--ink-soft)] hover:underline"
        >
          ← ダッシュボード
        </Link>
        <h1 className="font-hand text-3xl mt-2">{step.title}</h1>
        {step.estimatedMinutes && (
          <p className="text-xs text-[color:var(--ink-soft)] mt-1">
            目安: {step.estimatedMinutes} 分
          </p>
        )}
      </header>

      <div className="card-paper rounded-md p-6 leading-relaxed [&_p]:my-3 [&_h2]:font-hand [&_h2]:text-xl [&_h2]:mt-6 [&_h3]:font-hand [&_h3]:text-lg [&_h3]:mt-5 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_table]:border [&_table]:border-[color:var(--rule)] [&_table]:my-3 [&_th]:border [&_th]:border-[color:var(--rule)] [&_th]:px-2 [&_th]:py-1 [&_th]:bg-[color:var(--paper)] [&_td]:border [&_td]:border-[color:var(--rule)] [&_td]:px-2 [&_td]:py-1 [&_blockquote]:border-l-4 [&_blockquote]:border-[color:var(--accent)] [&_blockquote]:bg-[color:var(--highlight)]/40 [&_blockquote]:pl-3 [&_blockquote]:py-1 [&_blockquote]:my-3 [&_blockquote]:rounded-r [&_code]:bg-[color:var(--paper-warm)] [&_code]:px-1 [&_code]:rounded">
        {content}
      </div>

      {step.metronome && <EmbeddedMetronome metronome={step.metronome} />}

      <StepActions stepId={step.fullId} nextId={next} />

      <div className="flex justify-between text-sm">
        {prev ? (
          <Link
            href={`/steps/${prev}`}
            className="text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"
          >
            ← 前のステップ
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/steps/${next}`}
            className="text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"
          >
            次のステップ →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </article>
  );
}

function EmbeddedMetronome({ metronome }: { metronome: StepMetronome }) {
  return (
    <section>
      <h2 className="font-hand text-lg mb-2 text-[color:var(--ink)]">
        練習用メトロノーム
      </h2>
      <Metronome
        defaultBpm={metronome.bpm}
        defaultSignature={metronome.signature}
      />
    </section>
  );
}
