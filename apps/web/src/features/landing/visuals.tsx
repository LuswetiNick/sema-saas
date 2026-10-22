import type { CSSProperties } from "react";
import type { PlatformVisualKind, ProcessVisualKind } from "./content";

type IconKind = "message" | "person" | "document" | "spinner" | "arrow" | "check";
export function LandingIcon({ kind, className }: { kind: IconKind; className?: string }) {
  const paths: Record<Exclude<IconKind, "spinner">, string> = {
    message: "M4 5h16v11H9l-5 4V5Zm4 4h8M8 12h5",
    person: "M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21v-2a7 7 0 0 1 14 0v2",
    document: "M6 3h8l4 4v14H6V3Zm8 0v5h4M9 12h6M9 16h6",
    arrow: "M4 12h15m-6-6 6 6-6 6",
    check: "m5 12 4 4L19 6",
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "spinner" ? <circle className="sema-spinner" cx="12" cy="12" r="8" strokeDasharray="35 16" /> : <path d={paths[kind]} />}
  </svg>;
}

export function BackgroundArtwork() {
  return <div className="sema-backgroundArtwork" data-background-artwork aria-hidden="true">
    <div className="sema-aurora" />
    <svg viewBox="0 0 1400 1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sema-orbit" x1="0" y1="1" x2="1" y2="0"><stop stopColor="var(--accent)" stopOpacity=".08" /><stop offset=".55" stopColor="var(--accent)" stopOpacity=".8" /><stop offset="1" stopColor="var(--accent-2)" stopOpacity=".15" /></linearGradient>
        <radialGradient id="sema-halo"><stop stopColor="var(--accent)" stopOpacity=".18" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="1090" cy="450" rx="550" ry="490" fill="url(#sema-halo)" />
      <g fill="none" stroke="url(#sema-orbit)" transform="rotate(-34 1000 420)">
        {Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx="1030" cy="420" rx={240 + i * 24} ry={90 + i * 17} strokeWidth={i === 5 ? 2 : .7} opacity={1 - i * .045} />)}
      </g>
      <path d="M300 1000C850 850 600 120 1400 60" fill="none" stroke="url(#sema-orbit)" strokeWidth="2" />
    </svg>
  </div>;
}

function DocumentMesh() {
  return <g>
    <path d="M80 210 190 140 300 215M190 140 190 310M80 210 190 310 300 215" className="sema-artLine" />
    {[[58, 170], [160, 86], [271, 172], [160, 264]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}>
      <rect width="62" height="80" rx="8" className="sema-artSurface" />
      <path d="M14 22h25M14 33h34M14 44h27M14 55h18" className="sema-artLine" />
      <circle cx="49" cy="12" r="3" fill="var(--accent)" />
    </g>)}
  </g>;
}

export function PlatformArtwork({ kind }: { kind: PlatformVisualKind }) {
  return <svg className="sema-platformArt" viewBox="0 0 380 475" fill="none" aria-hidden="true">
    <circle cx="200" cy="210" r="140" className="sema-artHalo" />
    <g className="sema-artDrawing">
      {kind === "knowledge" && <DocumentMesh />}
      {kind === "languages" && <g transform="rotate(-9 190 220)">
        <rect x="47" y="116" width="235" height="104" rx="14" className="sema-artSurface" />
        <text x="67" y="145" className="sema-artCaption">ENGLISH</text><text x="67" y="177" className="sema-artText">How can we help?</text>
        <rect x="96" y="237" width="235" height="104" rx="14" className="sema-artSurface" />
        <text x="116" y="266" className="sema-artCaption">SWAHILI</text><text x="116" y="298" className="sema-artText">Tunaweza kusaidiaje?</text>
        <path d="M210 220v17" className="sema-artLine" />
      </g>}
      {kind === "people" && <g>
        <path d="M90 230c50-120 140 120 200 0" className="sema-artLine" strokeDasharray="5 7" />
        {[90, 290].map((x, i) => <g key={x} transform={`translate(${x} 225)`}><circle r="42" className="sema-artSurface" /><circle cy="-8" r="10" stroke="var(--accent)" /><path d="M-17 20a17 17 0 0 1 34 0" stroke="var(--accent)" /><text y="76" textAnchor="middle" className="sema-artCaption">{i ? "YOUR TEAM" : "VISITOR"}</text></g>)}
        <circle cx="190" cy="226" r="17" fill="var(--accent)" /><path d="M183 226h14m-5-5 5 5-5 5" stroke="var(--bg)" />
      </g>}
      {kind === "website" && <g transform="rotate(-6 190 220)">
        <rect x="36" y="115" width="306" height="215" rx="12" className="sema-artSurface" /><path d="M36 144h306" className="sema-artLine" />
        {[52, 64, 76].map((x) => <circle key={x} cx={x} cy="130" r="2" fill="var(--muted)" />)}
        <path d="M61 176h110M61 190h135M61 222h72M61 234h93" className="sema-artLine" />
        <rect x="202" y="185" width="120" height="127" rx="10" className="sema-artSurface" /><text x="216" y="207" className="sema-artText">Sema</text><path d="M216 227h82M216 239h65M216 264h74" className="sema-artLine" /><circle cx="309" cy="344" r="18" fill="var(--accent)" /><path d="M303 339h12v9h-8l-4 3v-12" stroke="var(--bg)" />
      </g>}
      {kind === "publish" && <g>
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${85 + i * 28} ${125 + i * 30}) rotate(-12)`}><rect width="170" height="150" rx="12" className="sema-artSurface" /><text x="18" y="29" className="sema-artCaption">{i === 2 ? "PUBLISHED" : "DRAFT"}</text><path d="M18 51h105M18 65h130M18 79h85" className="sema-artLine" />{i === 2 && <path d="m120 112 8 8 15-19" stroke="var(--accent)" strokeWidth="2" />}</g>)}
      </g>}
      {kind === "boundaries" && <g transform="translate(190 225)">
        {[60, 95, 130].map((r) => <ellipse key={r} rx={r} ry={r * .8} className="sema-artLine" strokeDasharray={r === 95 ? "3 7" : undefined} />)}
        <path d="M0-40 29-26v30C29 29 0 44 0 44S-29 29-29 4v-30L0-40Z" className="sema-artSurface" /><path d="m-12 0 9 9L15-12" stroke="var(--accent)" strokeWidth="2" />
      </g>}
    </g>
  </svg>;
}

export function ProcessArtwork({ kind }: { kind: ProcessVisualKind }) {
  return <div className="sema-processVisual" data-process-visual>
    <span className="sema-visualLabel">ILLUSTRATIVE / SAMPLE</span>
    {kind === "hub" && <svg viewBox="0 0 500 340" fill="none" aria-hidden="true">
      <circle cx="250" cy="170" r="120" className="sema-artHalo" />
      {Array.from({ length: 7 }, (_, i) => {
        const angle = i * Math.PI * 2 / 7;
        const x = Math.round(250 + Math.cos(angle) * 150);
        const y = Math.round(170 + Math.sin(angle) * 115);
        return <g key={i}><path d={`M250 170L${x} ${y}`} className="sema-artLine" /><path d={`M250 170L${x} ${y}`} className="sema-packet" pathLength="100" style={{ animationDelay: `${i * -.3}s` }} /><rect x={x - 23} y={y - 23} width="46" height="46" rx="10" className="sema-artSurface" /><path d={`M${x - 8} ${y - 4}h16m-16 8h11`} className="sema-artLine" /></g>;
      })}
      <rect x="208" y="128" width="84" height="84" rx="20" className="sema-hubCenter" /><text x="250" y="178" textAnchor="middle" className="sema-hubText">sema</text>
    </svg>}
    {kind === "chart" && <>
      <div className="sema-chartBadge">−63% tokens <small>Sample</small></div>
      <svg viewBox="0 0 500 340" fill="none" aria-hidden="true">
        {[90, 150, 210, 270].map((y) => <path key={y} d={`M40 ${y}H460`} className="sema-artLine" opacity=".35" />)}
        <path d="M40 270C100 260 95 210 155 225S210 130 270 150 315 65 365 95 420 40 460 50" className="sema-chartPath" pathLength="100" />
        <path d="M40 285C120 260 150 280 210 250S290 245 350 220 420 230 460 200" className="sema-artLine" strokeDasharray="4 6" />
        <text x="40" y="312" className="sema-artCaption">SAMPLE RETRIEVAL</text><text x="410" y="312" className="sema-artCaption">TODAY</text>
      </svg>
    </>}
    {kind === "gauge" && <>
      <svg viewBox="0 0 500 340" fill="none" aria-hidden="true">
        <path d="M135 210a115 115 0 1 1 230 0" className="sema-gaugeTrack" />
        <path d="M135 210a115 115 0 1 1 230 0" className="sema-gaugeArc" data-gauge-arc pathLength="100" />
        <text x="250" y="180" textAnchor="middle" className="sema-gaugeValue" data-gauge-value>72%</text>
        <text x="250" y="213" textAnchor="middle" className="sema-artCaption">DEMO ALLOWANCE · 100 ANSWERS</text>
      </svg>
      <div className="sema-policyPills"><span>PII ✓</span><span>SPEND ✓</span><span>REVIEW 2</span></div>
      <span className="sema-controlsCaption">Sample controls</span>
    </>}
    {kind === "timeline" && <svg viewBox="0 0 500 340" fill="none" aria-hidden="true">
      {[100, 180, 260, 340, 420].map((x) => <path key={x} d={`M${x} 65v220`} className="sema-artLine" opacity=".35" />)}
      {["intake", "knowledge", "review", "handoff", "reply"].map((name, i) => <g key={name}><text x="30" y={90 + i * 42} className="sema-artCaption">{name}</text><rect x={115 + i * 38} y={75 + i * 42} width={170 - i * 18} height="23" rx="5" className={i % 2 ? "sema-timelineIvory" : "sema-timelineEmerald"} /></g>)}
      <g className="sema-scrubber"><path d="M140 54v235" stroke="var(--text)" /><circle cx="140" cy="55" r="4" fill="var(--text)" /></g>
    </svg>}
  </div>;
}

export function FooterWordmark() {
  const text = { x: 600, y: 205, textAnchor: "middle" as const };
  return <svg className="sema-wordmark" viewBox="0 0 1200 230" aria-hidden="true">
    <defs><linearGradient id="sema-wordmark-gradient"><stop stopColor="var(--accent)" /><stop offset=".5" stopColor="var(--accent-2)" /><stop offset="1" stopColor="var(--accent)" /></linearGradient></defs>
    <text {...text} className="sema-wordmarkBase">sema</text>
    <text {...text} className="sema-wordmarkDots">sema</text>
    <text {...text} className="sema-wordmarkRunner">sema</text>
  </svg>;
}

export function indexedStyle(index: number): CSSProperties {
  return { "--index": index } as CSSProperties;
}
