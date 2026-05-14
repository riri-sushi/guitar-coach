import { Dashboard } from "@/components/curriculum/Dashboard";
import { loadCurriculum } from "@/lib/curriculum";

export default async function Home() {
  const chapters = await loadCurriculum();
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="font-hand text-3xl">練習ノート</h1>
        <p className="text-sm text-[color:var(--ink-soft)] mt-1">
          上から順にステップをチェックしていくと、最後に選んだ目標曲が弾けるようになります。
        </p>
      </section>
      <Dashboard chapters={chapters} />
    </div>
  );
}
