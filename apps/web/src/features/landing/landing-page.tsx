import { buttonVariants } from "@sema/ui/components/button";
import type { ReactNode } from "react";
import { footerGroups, heroDescription, organizations, platformCards, processSteps, revealCopy, sampleMetrics } from "./content";
import { HeroFlow } from "./hero-flow";
import { BackgroundArtwork, FooterWordmark, indexedStyle, LandingIcon, PlatformArtwork, ProcessArtwork } from "./visuals";
import s from "./landing.module.css";

function Brand() {
  return <a className={s.brand} href="#top" aria-label="Sema, back to top"><span className={s.brandMark} aria-hidden="true" />Sema<span className={s.brandPeriod}>.</span></a>;
}

function ActionLink({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return <a href={href} className={`${buttonVariants({ variant: secondary ? "outline" : "default", size: "lg" })} ${s.actionLink}`}>
    {children}<LandingIcon kind="arrow" className={s.actionArrow} />
  </a>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className={s.eyebrow}><span className={s.smallDot} />{children}</p>;
}

export function LandingPage() {
  return <>
    <BackgroundArtwork /><div className={s.veil} data-veil aria-hidden="true" />
    <a href="#main" className={s.skipLink}>Skip to content</a>
    <header className={s.header}>
      <div className={s.navbar}><Brand /><nav aria-label="Main navigation" className={s.navLinks}><a href="#how-it-works">How it works</a><a href="#platform">Platform</a><a href="#examples">Examples</a><span className={s.plannedNav}>Docs <small>planned</small></span></nav><a href="#demo" className={s.navAction}>Explore the demo <span aria-hidden="true">↗</span></a></div>
      <p className={s.previewNotice}><span className={s.previewTag}>DESIGN PREVIEW</span><span>Organizations, metrics, and activity below are fictional. Sema is not open for signup here.</span></p>
    </header>
    <main id="main" tabIndex={-1}>
      <section className={s.hero} data-hero aria-labelledby="hero-heading">
        <div className={s.heroInner}>
          <div className={s.heroCopy}>
            <Eyebrow>Sema design preview</Eyebrow>
            <h1 id="hero-heading" className={s.heroHeading}><span><span>Every question,</span></span><span><span>one <em>clear</em></span></span><span><span>next step.</span></span></h1>
            <p className={s.heroDescription}>{heroDescription}</p>
            <div className={s.actions}><ActionLink href="#demo">Explore the demo</ActionLink><ActionLink href="#how-it-works" secondary>See how it works</ActionLink></div>
            <div className={s.heroMeta}><p>Illustrative metrics, not measured Sema results</p><ul><li><strong>38<span>ms</span></strong><span>median handoff</span></li><li><strong>99.2<span>%</span></strong><span>run success</span></li><li><strong>900<span>+</span></strong><span>teams</span></li></ul></div>
          </div>
          <HeroFlow />
        </div>
        <div className={s.heroBottom}><span>BUILT AROUND CONVERSATION</span><a href="#examples">Scroll to explore <span aria-hidden="true">↓</span></a><span>EN / SW</span></div>
      </section>
      <section id="examples" tabIndex={-1} className={s.examples} aria-labelledby="examples-heading" data-animated-section>
        <h2 id="examples-heading">Fictional organizations for layout preview</h2>
        <div className={s.marqueeViewport}><div className={s.marqueeTrack} data-marquee>
          <ul className={s.logoList}>{organizations.map((name, i) => <li key={name} className={s[`logoStyle${i % 4}`]}>{name}</li>)}</ul>
          <ul className={s.logoList} aria-hidden="true">{organizations.map((name, i) => <li key={name} className={s[`logoStyle${i % 4}`]}>{name}</li>)}</ul>
        </div></div>
      </section>
      <section id="platform" tabIndex={-1} className={s.platform} data-platform aria-labelledby="platform-heading">
        <div className={s.platformSticky}>
          <div className={s.sectionHeading}><Eyebrow>Platform</Eyebrow><div className={s.headingRow}><h2 id="platform-heading">Built around better answers<br />and <em>human support.</em></h2><span className={s.sectionIndex}>01 / THE PLATFORM</span></div></div>
          <div className={s.platformViewport} data-platform-viewport><ol className={s.platformTrack} data-platform-track>
            {platformCards.map((card, i) => <li key={card.id} className={s.platformCard}>
              <PlatformArtwork kind={card.id} /><div className={s.cardShade} /><div className={s.cardTop}><span>{String(i + 1).padStart(2, "0")}</span><span>{card.tag}</span><span aria-hidden="true">↗</span></div>
              <div className={s.cardCopy}><h3>{card.title}</h3><p>{card.description}</p></div>
            </li>)}
          </ol></div>
          <div className={s.platformProgress} aria-hidden="true"><i data-platform-progress /></div>
        </div>
      </section>
      <section id="how-it-works" tabIndex={-1} className={s.process} data-process aria-labelledby="process-heading">
        <div className={s.sectionHeading}><Eyebrow>How it works</Eyebrow><div className={s.headingRow}><h2 id="process-heading">Four steps from scattered<br />questions to a <em>clearer conversation.</em></h2><span className={s.sectionIndex}>02 / THE PROCESS</span></div></div>
        <ol className={s.processList}>{processSteps.map((step, i) => <li key={step.visual} className={s.processCard} style={indexedStyle(i)} data-process-card data-animated-section>
          <div className={s.processCopy}><span className={s.stepNumber}>{String(i + 1).padStart(2, "0")} <span>/ 04</span></span><div><h3>{step.title}</h3><p>{step.description}</p><small>{step.detail}</small></div><span className={s.stepFoot}>SEMA / ILLUSTRATIVE EXPERIENCE <span aria-hidden="true">↗</span></span></div>
          <ProcessArtwork kind={step.visual} /><div className={s.stackShade} data-stack-shade aria-hidden="true" />
        </li>)}</ol>
      </section>
      <section className={s.reveal} data-reveal aria-label="Why the handoff matters"><div className={s.revealSticky}>
        <p className={s.revealLabel}>BETTER ANSWERS. HUMAN CONNECTION.</p>
        <p className={s.revealCopy}><span className={s.srOnly}>{revealCopy}</span><span aria-hidden="true">{revealCopy.split(" ").map((word, i) => <span key={i} data-reveal-word className={word === "between" ? s.serifWord : undefined}>{word}{" "}</span>)}</span></p>
        <span className={s.revealSignature}>That is the idea behind Sema<span aria-hidden="true">.</span></span>
      </div></section>
      <section className={s.metrics} data-metrics data-animated-section aria-labelledby="metrics-heading">
        <div className={s.metricsIntro}><Eyebrow>Sample metrics</Eyebrow><h2 id="metrics-heading">A sense of the <em>possibilities.</em></h2><p>Fictional values for this design preview, not production results.</p></div>
        <dl className={s.metricGrid}>{sampleMetrics.map((metric) => <div key={metric.id} className={s.metricCard}>
          <dt><span className={s.sampleLabel}>SAMPLE</span>{metric.label}</dt>
          <dd><span className={s.srOnly}>{metric.value}, sample</span><span aria-hidden="true" data-counter data-target={metric.target} data-format={metric.format} data-final={metric.value}>{metric.value}</span></dd>
          <svg viewBox="0 0 200 46" preserveAspectRatio="none" aria-hidden="true"><path d={metric.line} className={s.sparkline} pathLength="100" fill="none" /></svg>
        </div>)}</dl>
      </section>
      <section className={s.ctaSection} aria-labelledby="cta-heading"><div className={s.ctaPanel}>
        <div className={s.ctaOrbits} aria-hidden="true"><i /><i /><i /></div><div className={s.ctaContent}><Eyebrow>Design preview</Eyebrow><h2 id="cta-heading">See a clearer path from<br />questions to <em>people.</em></h2><p>Good support is a conversation.<br />Let&apos;s make the next step a little clearer.</p><div className={s.actions}><ActionLink href="#demo">Explore the demo</ActionLink><ActionLink href="#platform" secondary>See the platform</ActionLink></div><span className={s.ctaNote}>ILLUSTRATIVE EXPERIENCE / NO SIGNUP REQUIRED</span></div>
      </div></section>
    </main>
    <footer className={s.footer} data-animated-section>
      <div className={s.footerGrid}><div className={s.footerBrand}><Brand /><p>A design preview for website support in English and Swahili.</p><span className={s.footerStatus}><i /> Design preview</span></div>
        {footerGroups.map((group) => <nav key={group.title} aria-label={group.title}><h2>{group.title}</h2><ul>{group.items.map((item) => <li key={item.label}>{item.href ? <a href={item.href}>{item.label}</a> : <span className={s.plannedItem}>{item.label}<small>planned</small></span>}</li>)}</ul></nav>)}
      </div><FooterWordmark /><div className={s.footerBottom}><p>© 2026 Sema. All rights reserved.</p><ul>{["X", "GitHub", "LinkedIn", "Discord"].map((name) => <li key={name}>{name}<span>planned</span></li>)}</ul></div>
    </footer>
  </>;
}
