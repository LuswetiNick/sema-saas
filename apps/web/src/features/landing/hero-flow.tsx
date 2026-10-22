import type { CSSProperties } from "react";
import { flowNodes, initialRuns } from "./content";
import { LandingIcon } from "./visuals";
import s from "./landing.module.css";

const wires = ["M28 52 C33 52 32 30 38 30", "M28 52 C33 52 32 74 38 74", "M59 30 C65 30 64 52 70 52", "M59 74 C65 74 64 52 70 52"];

export function HeroFlow() {
  return <figure id="demo" className={s.flowFigure} tabIndex={-1} aria-labelledby="flow-caption" aria-describedby="flow-description">
    <figcaption id="flow-caption" className={s.flowCaption}><span className={s.smallDot} /> Illustrative support flow <span>NOT LIVE DATA</span></figcaption>
    <p id="flow-description" className={s.srOnly}>An example visitor question branches to a staff request or an uncertain answer. Both paths pass the conversation to a person. All activity is simulated.</p>
    <div className={s.stage} data-stage aria-hidden="true">
      <div className={s.rig} data-rig>
        <div className={s.flowLayer} data-layer data-depth="0">
          <div className={s.flowWindow}>
            <div className={s.windowBar}><span className={s.windowMark}>◈</span><span>Support handoff demo</span><span className={s.windowBranch}>4 steps · 1 branch</span><span className={s.demoPill}><i /> DEMO</span></div>
            <div className={s.flowBody}>
              <div className={s.flowTools}><span>↖</span><span>⟲</span></div><span className={s.zoomTag}>100%</span>
              <svg className={s.wires} viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
                {wires.map((d, i) => <g key={d}><path d={d} className={s.wire} vectorEffect="non-scaling-stroke" /><path d={d} className={`${s.wirePulse} ${i % 2 ? s.ivoryPulse : ""}`} vectorEffect="non-scaling-stroke" pathLength="100" /></g>)}
              </svg>
              <span className={s.branchStaff}>staff</span><span className={s.branchUnsure}>unsure</span>
              {flowNodes.map((node, i) => {
                const position = { left: node.x, top: node.y, "--node-index": i } as CSSProperties;
                return <div key={node.title}>
                  <div className={s.flowBase} style={position}><i /><b /></div>
                  <div className={s.flowNode} data-flow-node style={position}><span className={s.nodeIcon}><LandingIcon kind={node.symbol} /></span><strong>{node.title}</strong><small>{node.subtitle}</small><i className={s.nodePort} /></div>
                </div>;
              })}
              <div className={s.runList}><div className={s.runsHeading}><span>LAST SAMPLE RUNS</span><span>ELAPSED / RESULT</span></div>
                <div data-run-list>{initialRuns.map((run) => <div key={run.id} className={s.runRow}><span data-run-time>{run.elapsed}</span><span data-run-subject>#{run.id} {run.subject}</span><span data-run-duration>{run.duration}ms ✓</span></div>)}</div>
              </div>
              <div className={s.glare} data-glare />
            </div>
          </div>
        </div>
        <div className={`${s.depthChip} ${s.dailyChip}`} data-layer data-depth="90"><span className={s.smallDot} /><strong>1,284</strong> sample handoffs today</div>
        <div className={`${s.depthChip} ${s.latencyChip}`} data-layer data-depth="140"><span className={s.chipSymbol}>⌁</span><span>knowledge → support</span><strong><span data-chip-duration>38</span> ms</strong><small>Sample</small></div>
      </div>
    </div>
  </figure>;
}
