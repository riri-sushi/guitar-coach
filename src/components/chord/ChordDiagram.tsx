import { CHORDS, type ChordShape } from "./chord-data";

type Props = {
  chord: string | ChordShape;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  showPhoto?: boolean;
};

const SIZE = {
  sm: { width: 80, headerHeight: 16, fretHeight: 18, photo: 80 },
  md: { width: 120, headerHeight: 24, fretHeight: 26, photo: 180 },
  lg: { width: 180, headerHeight: 32, fretHeight: 38, photo: 220 },
};

export function ChordDiagram({
  chord,
  size = "md",
  showName = true,
  showPhoto = true,
}: Props) {
  const shape = typeof chord === "string" ? CHORDS[chord] : chord;
  if (!shape) {
    return (
      <span className="text-red-600 text-xs">
        Unknown chord: {String(chord)}
      </span>
    );
  }

  const dims = SIZE[size];
  const showPhotoActual = showPhoto && size !== "sm" && Boolean(shape.photo);

  return (
    <figure
      className={`inline-flex gap-4 items-start my-2 ${
        showPhotoActual ? "flex-row flex-wrap" : "flex-col items-center"
      }`}
    >
      {showPhotoActual && shape.photo && (
        <a
          href={shape.photo.page}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col gap-1 group"
          aria-label={`${shape.name} のコード写真（Wikimedia Commons へ）`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shape.photo.src}
            alt={`${shape.name} を押さえる手元`}
            width={dims.photo}
            height={dims.photo}
            loading="lazy"
            className="rounded-md border border-zinc-300 dark:border-zinc-700 object-cover"
            style={{ width: dims.photo, height: dims.photo }}
          />
          <span className="text-[10px] text-zinc-500 group-hover:underline">
            © {shape.photo.author} / {shape.photo.license}
          </span>
        </a>
      )}

      <div className="inline-flex flex-col items-center gap-1">
        <ChordSvg shape={shape} dims={dims} />
        {showName && (
          <figcaption className="text-sm font-medium">{shape.name}</figcaption>
        )}
      </div>
    </figure>
  );
}

function ChordSvg({
  shape,
  dims,
}: {
  shape: ChordShape;
  dims: { width: number; headerHeight: number; fretHeight: number };
}) {
  const { width, headerHeight, fretHeight } = dims;
  const strings = 6;
  const fretsShown = 4;
  const padding = 12;
  const stringSpacing = (width - padding * 2) / (strings - 1);
  const totalHeight = headerHeight + fretHeight * fretsShown + padding;
  const x = (i: number) => padding + i * stringSpacing;

  return (
    <svg
      width={width}
      height={totalHeight}
      viewBox={`0 0 ${width} ${totalHeight}`}
      role="img"
      aria-label={`コード ${shape.name}`}
    >
      <rect
        x={padding - 2}
        y={headerHeight}
        width={(strings - 1) * stringSpacing + 4}
        height={3}
        fill="currentColor"
      />
      {Array.from({ length: fretsShown }).map((_, i) => (
        <line
          key={i}
          x1={padding}
          x2={padding + (strings - 1) * stringSpacing}
          y1={headerHeight + 3 + (i + 1) * fretHeight}
          y2={headerHeight + 3 + (i + 1) * fretHeight}
          stroke="currentColor"
          strokeOpacity={0.4}
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: strings }).map((_, i) => (
        <line
          key={i}
          x1={x(i)}
          x2={x(i)}
          y1={headerHeight + 3}
          y2={headerHeight + 3 + fretsShown * fretHeight}
          stroke="currentColor"
          strokeOpacity={0.55}
          strokeWidth={1}
        />
      ))}
      {shape.frets.map((fret, i) => {
        const cx = x(i);
        if (fret === "x") {
          return (
            <text
              key={i}
              x={cx}
              y={headerHeight - 2}
              textAnchor="middle"
              fontSize={headerHeight * 0.7}
              fill="currentColor"
              opacity={0.6}
            >
              ×
            </text>
          );
        }
        if (fret === 0) {
          return (
            <circle
              key={i}
              cx={cx}
              cy={headerHeight - headerHeight * 0.35}
              r={headerHeight * 0.28}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
            />
          );
        }
        const cy = headerHeight + 3 + (fret - 0.5) * fretHeight;
        return (
          <g key={i}>
            <circle
              cx={cx}
              cy={cy}
              r={fretHeight * 0.32}
              fill="currentColor"
            />
            {shape.fingers?.[i] && (
              <text
                x={cx}
                y={cy + fretHeight * 0.12}
                textAnchor="middle"
                fontSize={fretHeight * 0.45}
                fill="white"
                fontWeight={600}
              >
                {shape.fingers[i]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
