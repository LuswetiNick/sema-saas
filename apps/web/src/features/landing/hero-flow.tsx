import type { CSSProperties } from "react";
import { flowNodes, initialRuns } from "./content";
import { LandingIcon } from "./visuals";

const wires = ["M28 52 C33 52 32 30 38 30", "M28 52 C33 52 32 74 38 74", "M59 30 C65 30 64 52 70 52", "M59 74 C65 74 64 52 70 52"];

export function HeroFlow() {
  return <figure id="demo" className="sema-flowFigure" tabIndex={-1} aria-labelledby="flow-caption" aria-describedby="flow-description">
    <figcaption id="flow-caption" className="sema-flowCaption"><span className="sema-smallDot" /> Illustrative support flow <span>NOT LIVE DATA</span></figcaption>
    <p id="flow-description" className="sema-srOnly">An example visitor question branches to a staff request or an uncertain answer. Both paths pass the conversation to a person. All activity is simulated.</p>
    <div className="sema-stage" data-stage aria-hidden="true">
      <div className="sema-rig" data-rig>
        <div className="sema-flowLayer" data-layer data-depth="0">
          <div className="sema-flowWindow">
            <div className="sema-windowBar"><span className="sema-windowMark">◈</span><span>Support handoff demo</span><span className="sema-windowBranch">4 steps · 1 branch</span><span className="sema-demoPill"><i /> DEMO</span></div>
            <div className="sema-flowBody">
              <div className="sema-flowTools"><span>↖</span><span>⟲</span></div><span className="sema-zoomTag">100%</span>
              <svg className="sema-wires" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
                {wires.map((d, i) => <g key={d}><path d={d} className="sema-wire" vectorEffect="non-scaling-stroke" /><path d={d} className={`sema-wirePulse ${i % 2 ? "sema-ivoryPulse" : ""}`} vectorEffect="non-scaling-stroke" pathLength="100" /></g>)}
              </svg>
              <span className="sema-branchStaff">staff</span><span className="sema-branchUnsure">unsure</span>
              {flowNodes.map((node, i) => {
                const position = { left: node.x, top: node.y, "--node-index": i } as CSSProperties;
                return <div key={node.title}>
                  <div className="sema-flowBase" style={position}><i /><b /></div>
                  <div className="sema-flowNode" data-flow-node style={position}><span className="sema-nodeIcon"><LandingIcon kind={node.symbol} /></span><strong>{node.title}</strong><small>{node.subtitle}</small><i className="sema-nodePort" /></div>
                </div>;
              })}
              <div className="sema-runList"><div className="sema-runsHeading"><span>LAST SAMPLE RUNS</span><span>ELAPSED / RESULT</span></div>
                <div data-run-list>{initialRuns.map((run) => <div key={run.id} className="sema-runRow"><span data-run-time>{run.elapsed}</span><span data-run-subject>#{run.id} {run.subject}</span><span data-run-duration>{run.duration}ms ✓</span></div>)}</div>
              </div>
              <div className="sema-glare" data-glare />
            </div>
          </div>
        </div>
        <div className={`sema-depthChip sema-dailyChip`} data-layer data-depth="90"><span className="sema-smallDot" /><strong>1,284</strong> sample handoffs today</div>
        <div className={`sema-depthChip sema-latencyChip`} data-layer data-depth="140"><span className="sema-chipSymbol">⌁</span><span>knowledge → support</span><strong><span data-chip-duration>38</span> ms</strong><small>Sample</small></div>
      </div>
    </div>
  </figure>;
}
