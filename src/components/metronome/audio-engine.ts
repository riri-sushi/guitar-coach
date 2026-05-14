export type TimeSignature = "4/4" | "3/4" | "6/8";

export type MetronomeOptions = {
  bpm: number;
  signature: TimeSignature;
  onBeat?: (beat: number) => void;
};

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD_SEC = 0.1;

export class MetronomeEngine {
  private ctx: AudioContext | null = null;
  private timer: number | null = null;
  private nextNoteTime = 0;
  private beatInBar = 0;
  private bpm: number;
  private signature: TimeSignature;
  private onBeat?: (beat: number) => void;

  constructor(opts: MetronomeOptions) {
    this.bpm = opts.bpm;
    this.signature = opts.signature;
    this.onBeat = opts.onBeat;
  }

  setBpm(bpm: number) {
    this.bpm = bpm;
  }

  setSignature(signature: TimeSignature) {
    this.signature = signature;
    this.beatInBar = 0;
  }

  setOnBeat(cb: (beat: number) => void) {
    this.onBeat = cb;
  }

  isRunning(): boolean {
    return this.timer !== null;
  }

  start() {
    if (this.timer !== null) return;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctor();
    }
    void this.ctx.resume();
    this.beatInBar = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.timer = window.setInterval(() => this.tick(), LOOKAHEAD_MS);
  }

  stop() {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  dispose() {
    this.stop();
    this.ctx?.close().catch(() => {});
    this.ctx = null;
  }

  private beatsPerBar(): number {
    switch (this.signature) {
      case "4/4":
        return 4;
      case "3/4":
        return 3;
      case "6/8":
        return 6;
    }
  }

  private beatDuration(): number {
    if (this.signature === "6/8") {
      // treat 6/8 as 6 eighths per bar at quarter-note BPM
      return 30.0 / this.bpm;
    }
    return 60.0 / this.bpm;
  }

  private tick() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    while (this.nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD_SEC) {
      const isDownbeat = this.beatInBar === 0;
      this.scheduleClick(this.nextNoteTime, isDownbeat);
      const beatToReport = this.beatInBar;
      window.setTimeout(
        () => this.onBeat?.(beatToReport),
        Math.max(0, (this.nextNoteTime - ctx.currentTime) * 1000),
      );
      this.nextNoteTime += this.beatDuration();
      this.beatInBar = (this.beatInBar + 1) % this.beatsPerBar();
    }
  }

  private scheduleClick(time: number, isDownbeat: boolean) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = isDownbeat ? 1500 : 800;
    osc.type = "square";
    gain.gain.value = 0.0001;
    osc.connect(gain).connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(isDownbeat ? 0.5 : 0.3, time + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);
    osc.start(time);
    osc.stop(time + 0.07);
  }
}
