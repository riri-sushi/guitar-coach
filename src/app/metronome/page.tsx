import { Metronome } from "@/components/metronome/Metronome";

export const metadata = { title: "メトロノーム" };

export default function MetronomePage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="font-hand text-3xl">メトロノーム</h1>
        <p className="text-sm text-[color:var(--ink-soft)] mt-1">
          BPM と拍子を変えて練習に使えます。初回再生時はブラウザの音声許可が必要なことがあります。
        </p>
      </header>
      <Metronome defaultBpm={80} defaultSignature="4/4" />
    </div>
  );
}
