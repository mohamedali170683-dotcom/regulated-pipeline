import { useState } from "react";

// ─── QuoIntelligence Pipeline Operations Plan v3 ────────────────
// Sequential guided interface with behavioral science layer
// Phased: Finance Q1-Q2, Manufacturing Q2-Q3, Energy Q3-Q4
// Sources: Gartner, ENISA, BaFin, BSI, Cialdini, Kahneman, Shotton

// ─── BEHAVIORAL SCIENCE PRINCIPLES ──────────────────────────────
const BIAS_DISCLAIMER = "These behavioral science suggestions are derived from peer-reviewed research and adapted for enterprise cybersecurity buying contexts. They are strategic frameworks, not manipulation techniques — the goal is to align messaging with how regulated buyers actually make decisions. Each principle is cited with its original research source and, where available, cybersecurity-specific validation.";

const BIASES = {
  lossAversion: {
    name: "Loss Aversion",
    source: "Kahneman & Tversky — Prospect Theory (1979)",
    insight: "Losses feel 2x more painful than equivalent gains. 84% of security professionals gamble on higher loss rather than accept certain lower loss.",
    application: "Frame around regulatory penalties, breaches, and downtime cost — not feature benefits.",
    evidence: "Original research: Kahneman & Tversky's Prospect Theory (1979) demonstrated losses are weighted ~2.25x more than equivalent gains. Replicated across 100+ studies. CISO-specific: Security Magazine (2022) found 84% of security professionals choose gamble over certain-but-lower loss, confirming loss aversion drives security purchasing decisions. Pamphlet study: loss-framed health messages were 2x more effective than benefit-framed (Meyerowitz & Chaiken, 1987).",
    howItWorks: "When a CISO or CFO hears 'BaFin can restrict operations for DORA non-compliance,' the potential loss (operational shutdown) triggers stronger motivation than the potential gain (better threat detection). The pain of the penalty anchors the decision. This is why compliance-triggered messaging consistently outperforms feature-benefit messaging in regulated industries."
  },
  statusQuo: {
    name: "Status Quo Bias",
    source: "Thaler & Sunstein — Nudge (2008); Samuelson & Zeckhauser (1988)",
    insight: "CISOs default to existing vendors. Dutch study: boards remain convinced they're protected until a major incident strikes.",
    application: "Don't sell replacement — sell the gap. 'What did your current feed miss last quarter?'",
    evidence: "Samuelson & Zeckhauser (1988) first formalized status quo bias — people disproportionately prefer the current state. Dutch cybersecurity study (Computer Weekly, 2024): identified status quo bias as one of 7 cognitive biases undermining board-level cyber decisions. Boards consistently overestimate existing protection until a breach forces reassessment. ASIS International (2022): security decision-makers anchor trust in long-standing suppliers, failing to vet whether those suppliers still meet current threat landscape requirements.",
    howItWorks: "The CISO's current threat feed feels 'good enough' — even if it consistently misses sector-specific campaigns. Asking 'what did your current feed miss?' forces a gap assessment without directly attacking their existing choice. This respects the status quo while making its limitations visible."
  },
  authority: {
    name: "Authority Principle",
    source: "Cialdini — Influence, Ch. 6 (1984)",
    insight: "54% higher response rate when signed by a credible authority. ENISA contract = instant credibility in EU cybersecurity.",
    application: "Lead with ENISA contract, Gartner listing. Not 'we're great' — 'these institutions chose us.'",
    evidence: "Cialdini's foundational research: letters signed by a doctor saw 54% higher compliance. Milgram experiments (1963): 65% compliance with authority figures. In cybersecurity: ENISA is the EU's highest cybersecurity authority. A €1.4M, 4-year contract (Startbase, Feb 2025) signals institutional validation. Gartner Market Guide listing (2021) adds analyst credibility. For OT Security Managers, MITRE ATT&CK framework alignment serves as technical authority — it's the standard they trust.",
    howItWorks: "Procurement teams and CISOs in regulated industries need to justify vendor selection to auditors and boards. An ENISA contract is not just marketing — it's audit-ready evidence that a credible institution has already vetted this vendor. The authority does the selling; the SDR just surfaces it."
  },
  socialProof: {
    name: "Social Proof",
    source: "Cialdini — Influence, Ch. 4 (1984)",
    insight: "Under uncertainty, people mirror peer behavior. CISOs benchmark against peers in their vertical.",
    application: "Sector-specific reference calls. 'Banks your size using Mercury found X.' Never generic testimonials.",
    evidence: "Cialdini (1984): hotel towel reuse increased 26% with 'most guests reuse' messaging. In B2B cybersecurity: CISOs operate in tight peer networks (CISO Alliance, Evanta communities). Gartner Peer Insights reviews carry more weight than vendor claims. Key insight from Shotton (The Choice Factory, 2018): social proof is most powerful when the reference group is specific and similar — 'banks your size' outperforms 'Fortune 500 companies' by 3-5x in conversion.",
    howItWorks: "A CISO at a 2,000-employee German bank doesn't care that a Fortune 100 US company uses Mercury. They care that another mid-size German bank under DORA uses it. Sector-specific, size-matched references reduce perceived risk and shorten evaluation cycles."
  },
  scarcity: {
    name: "Regulatory Scarcity",
    source: "Cialdini — Influence, Ch. 7 (1984) + DORA/NIS2/CER deadlines",
    insight: "Time-limited compliance windows create natural scarcity. DORA already enforced. CER resilience plans due July 2026.",
    application: "Compliance deadline = built-in urgency. No fake scarcity needed — the regulator creates it.",
    evidence: "Cialdini (1984): scarcity increased opt-in rates from 7% to 10% for limited-slot programs. Cookie jar study: identical cookies rated tastier from jar of 2 vs. jar of 10. In regulated cybersecurity: DORA entered force Jan 17, 2025 — non-compliance risk is live now. CER Directive resilience plans are due July 2026. NIS2 national transpositions are rolling out 2024-2026 with enforcement actions already beginning. These are real, externally imposed deadlines — not artificial urgency.",
    howItWorks: "Unlike consumer scarcity ('only 3 left!'), regulatory scarcity is genuine and verifiable. The Head of Compliance knows the CER deadline. Referencing it isn't pressure — it's demonstrating awareness of their actual constraint. This positions the vendor as a partner who understands their regulatory calendar, not a salesperson creating fake urgency."
  },
  anchoring: {
    name: "Anchoring",
    source: "Kahneman — Thinking Fast and Slow (2011); Ariely — Predictably Irrational (2008)",
    insight: "First number encountered shapes all subsequent judgments. MIT students bid 3x more after higher prime.",
    application: "Lead with penalty/breach cost (€10M, 2% turnover), then show Mercury price. The anchor makes the investment feel small.",
    evidence: "Tversky & Kahneman (1974): random wheel spin influenced UN membership estimates by 20+ percentage points. Ariely (2008): MIT students' Social Security digits influenced auction bids by 3x. In real estate: arbitrary listing prices heavily influence agent valuations. In cybersecurity purchasing: ManageEngine research (2024) found analysts anchor security spending decisions on the most recent incident cost, not on systematic risk assessment.",
    howItWorks: "When a CFO first hears 'DORA non-compliance can cost 2% of global turnover' (potentially tens of millions), the €95K Mercury license becomes trivially small by comparison. The penalty number becomes the mental anchor against which the investment is judged. This is why the business case should always lead with the risk number, not the price."
  },
  endowment: {
    name: "Endowment Effect",
    source: "Kahneman — Thinking Fast and Slow (2011); Thaler (1980)",
    insight: "People value things 2x more once they feel ownership. POV embeds Mercury in daily workflow — creates psychological ownership.",
    application: "2-week POV is not a demo — it's creating ownership. After POV, removing Mercury feels like a loss.",
    evidence: "Thaler (1980) first described the endowment effect. Kahneman's mug experiment: owners demanded 2x more to sell than buyers would pay for identical mugs. In SaaS: free trials convert at 15-25% (higher than demos at 5-10%) because they create ownership. Specifically in cybersecurity: once a SOC team integrates a threat feed into daily triage workflow and builds processes around it, removing it creates operational disruption — combining endowment effect with loss aversion.",
    howItWorks: "A 2-week POV isn't a 'trial period' — it's a strategic tool to embed Mercury into daily SOC operations. After 2 weeks of analysts using Mercury for triage, removing it means going back to slower, less informed processes. The SOC team becomes an internal advocate because they've experienced the value firsthand, and losing it feels like a step backward."
  },
  reciprocity: {
    name: "Reciprocity",
    source: "Cialdini — Influence, Ch. 2 (1984)",
    insight: "Free value creates obligation. Threat briefs with real IOCs give security teams immediate value before any ask.",
    application: "Lead with free threat brief containing real IOCs. No gating. Give first, ask second.",
    evidence: "Cialdini (1984): restaurant tips increased 23% when servers gave mints. Charity donations increased 75% with included gift. Harhut (Using Behavioral Science in Marketing, 2022) emphasizes that the gift must be genuinely useful, not a token gesture. In cybersecurity: a threat brief with real IOCs that a SOC can immediately operationalize is high-value reciprocity — unlike a generic whitepaper, it's actionable intelligence the security team can use today.",
    howItWorks: "A CISO who receives a sector-specific threat brief with actual IOCs they can feed into their SIEM has received real operational value — for free. This creates a reciprocity obligation that makes them more likely to accept a discovery call. Critically, the brief must contain genuinely useful intelligence, not marketing content disguised as a threat report."
  },
  availabilityBias: {
    name: "Availability Bias",
    source: "Kahneman — Thinking Fast and Slow (2011); Tversky & Kahneman (1973)",
    insight: "Recent events disproportionately influence risk assessment. Analysts buy expensive solutions for low-probability risks after a recent incident.",
    application: "Time outreach to follow major incidents (ransomware, nation-state disclosures). The event does the selling.",
    evidence: "Tversky & Kahneman (1973): people estimate event frequency based on how easily examples come to mind. ManageEngine (2024): security analysts overweight recent incidents when allocating budget. Security Magazine (2022): 10 cognitive biases affecting cybersecurity programs — availability bias drives reactive purchasing after breaches. BSI Lagebericht confirms cyclical spikes in cybersecurity investment following major German incidents.",
    howItWorks: "When a ransomware group shuts down a German manufacturer, every IT Director at a similar company is suddenly thinking about ransomware. The risk feels vivid and imminent. This is the highest-conversion window for outreach — not because we're exploiting fear, but because the buyer's attention is already focused on exactly the problem Mercury solves. The 48-hour response window captures this natural attention spike."
  },
  commitmentConsistency: {
    name: "Commitment & Consistency",
    source: "Cialdini — Influence, Ch. 3 (1984)",
    insight: "Once committed to a position, people act to stay consistent. Small yeses lead to big yeses.",
    application: "Micro-commitments: download brief → attend webinar → take discovery call → POV → contract. Never skip steps.",
    evidence: "Cialdini (1984): beach theft experiment — 20% intervened normally, 95% intervened after verbally agreeing to watch belongings. Written commitments significantly more binding than verbal. Freedman & Fraser (1966): small initial request increased compliance with larger request by 4x. In enterprise sales: landing with 1 module at lower ACV creates a contractual and operational commitment that makes year-2 expansion the path of least resistance — consistent with the initial buying decision.",
    howItWorks: "A €95K single-module contract is easier to approve than a €200K full-platform deal. Once the organization has committed budget, integrated Mercury into workflow, and reported positive results, expanding to additional modules is consistent with the original decision. The expansion clause isn't just commercial — it's a behavioral design choice that leverages the buyer's desire to remain consistent with their initial commitment."
  }
};

// ─── SAMPLE THREAT BRIEFS (based on QI Q4 2025 Industrials report format) ──
const THREAT_BRIEFS = {
  "dach-finance": {
    title: "DACH Financial Services — Threat Landscape Brief",
    quarter: "Q1 2026",
    threats: [
      { type: "State-Sponsored", risk: "H", trend: "↑", actor: "Lazarus Group (DPRK)", detail: "SWIFT & payment infrastructure targeting. Credential harvesting via spear-phishing financial executives." },
      { type: "Ransomware", risk: "H", trend: "→", actor: "LockBit 4.0 / BlackCat", detail: "Opportunistic targeting of DACH financial services. Initial access via VPN vulnerabilities and infostealers." },
      { type: "Infostealers", risk: "M", trend: "↑", actor: "Lumma, Raccoon v2", detail: ">90% of breaches initiated by infostealers or mass-exploitation. Corporate VPN and email credentials sold via Initial Access Brokers." },
    ],
    mitre: ["Initial-access: Phishing (T1566)", "Initial-access: Valid Accounts (T1078)", "Defense-evasion: Obfuscated Files (T1027)", "Impact: Data Encrypted (T1486)"],
    keyInsight: "DORA Art. 6 requires board-approved ICT risk management frameworks. This brief maps active threats to DORA obligations — operational intelligence, not generic reporting.",
  },
  "eu-energy": {
    title: "EU Energy & Critical Infrastructure — Threat Landscape Brief",
    quarter: "Q1 2026",
    threats: [
      { type: "State-Sponsored", risk: "H", trend: "↑", actor: "Muddy Water (Iran), Sandworm (Russia)", detail: "Iran-linked operations amplifying campaigns across EU energy and critical sectors. Focus: initial access, long-term persistence, intelligence gathering." },
      { type: "Hacktivism", risk: "M", trend: "↑↑", actor: "NoName057(16), Sector16, Overflame", detail: "Pro-Russia groups targeting EU/NATO energy infrastructure with DDoS and SCADA/OT sabotage attempts." },
      { type: "Ransomware", risk: "M", trend: "↑", actor: "Opportunistic groups", detail: "30% rise in incidents Q-over-Q in industrials. Victims are opportunistic — no targeted sector selection, but OT environments increasingly affected." },
    ],
    mitre: ["Initial-access: Exploit Public-Facing App (T1190)", "Command & Control: Application Layer Protocol (T1071)", "Exfiltration: Over C2 Channel (T1041)", "Discovery: System Information (T1082)"],
    keyInsight: "CER Directive resilience plans due July 2026. Regulators will ask what threat intelligence you had and whether you acted on it. This brief creates evidence.",
  },
  "dach-manufacturing": {
    title: "DACH Manufacturing — Threat Landscape Brief",
    quarter: "Q1 2026",
    threats: [
      { type: "Ransomware", risk: "H", trend: "↑", actor: "LockBit, Black Basta, Akira", detail: "Manufacturing is #1 ransomware target in DACH (BSI Lagebericht). Entry via Fortinet/Cisco VPN CVEs and infostealers. Avg 11 days production downtime." },
      { type: "Infostealers", risk: "H", trend: "↑", actor: "Lumma, Vidar, RedLine", detail: "Home PCs of IT admins compromised → corporate VPN credentials stolen → sold to Initial Access Brokers → ransomware deployment within weeks." },
      { type: "Espionage", risk: "M", trend: "→", actor: "China-nexus APTs", detail: "Industrial espionage targeting automotive supply chain and machinery IP. Less visible but persistent. Long-term access, intelligence gathering." },
    ],
    mitre: ["Initial-access: Valid Accounts (T1078)", "Initial-access: Phishing (T1566)", "Execution: Command & Scripting Interpreter (T1059)", "Impact: Data Encrypted (T1486)"],
    keyInsight: "This is the threat brief you send within 48 hours of the next ransomware incident hitting German manufacturing. Have it pre-built. Update the CVEs. Ship it.",
  },
};

// ─── SEGMENTS ───────────────────────────────────────────────────
const SEGMENTS = [
  {
    id: "dach-finance",
    name: "DACH Financial Services",
    icon: "🏦",
    regulation: "DORA + NIS2",
    headline: "DORA makes threat intelligence legally required for banks",
    accounts: 380,
    accountsSource: "~22,000 DORA-regulated entities EU-wide (European Commission, Jan 2023). DACH = ~16% of EU financial sector → ~3,500 entities. Filtered by employee count (500-10K) and entity type (banks, insurance, investment firms) → ~2,400 in-scope. Targetable with QI's ICP (need for external TI, not self-sufficient): ~16% of in-scope → 380.",
    deal: "€95K",
    dealSource: "QI's ENISA contract: €1.4M over 4 years = €350K/yr (Startbase, Feb 2025). Enterprise TI platforms range €40K-€200K ACV (Gartner Peer Insights, 2025). €95K positions Mercury mid-range for 500-10K employee segment. Cross-validated: Recorded Future enterprise deals avg €80-150K; CrowdStrike TI module €50-120K (industry estimates).",
    cycle: "7-10 mo",
    cycleSource: "Enterprise cybersecurity deals >€100K: 6-9 months (ScaleVP, 2025). Deals >€500K: 12-18 months. With DORA compliance urgency shortening evaluation, 7-10 months is realistic for this ACV range.",
    phase: "Q1-Q2 (launch first — DORA already enforced)",
    icp: "Banks, insurance, investment firms · 500-10K employees · DORA Art. 6 mandates board oversight of ICT risk",
    tam: "~2,400 entities in scope",
    entryPoint: "DORA compliance deadline anxiety + active threat targeting financial sector",
    committee: [
      { role: "CISO", tag: "Champion", bias: "statusQuo", msg: "Ask: did your current feeds catch the last financial-sector campaign before BSI published?", priority: "Detection coverage · SIEM integration (Splunk/Sentinel)" },
      { role: "Head of Operational Risk", tag: "DORA gate", bias: "lossAversion", msg: "DORA Art. 6 requires board-approved ICT risk management. Mercury maps threats to your register — that's your Article 5 obligation.", priority: "ICT risk framework (Art. 5-6) · Third-party vendor risk" },
      { role: "CFO", tag: "Budget approver", bias: "anchoring", msg: "Anchor on BaFin penalty + breach cost first. Then show Mercury annual license. The comparison does the work.", priority: "DORA penalties (BaFin) · ROI vs. non-compliance cost" },
      { role: "Head of SOC", tag: "End user", bias: "endowment", msg: "POV success metric: measure triage time before and after. Target 50%+ reduction. After POV, removing Mercury feels like a loss.", priority: "Analyst workload · Alert triage · Stack integration" },
      { role: "Legal / DPO", tag: "Contractual gate", bias: "reciprocity", msg: "Pre-send DORA-compliant ICT terms + GDPR DPA before they ask. Removes the blocker before it forms.", priority: "DORA Art. 28-30 · GDPR DPA · EU data residency" },
      { role: "Procurement", tag: "Process gate", bias: "authority", msg: "ENISA-contracted, EU-headquartered, Frankfurt-hosted. Pre-filled security questionnaire removes 2 weeks.", priority: "EU sovereignty · SOC 2 · Vendor risk questionnaire" },
    ],
    sequence: [
      { week: "1-2", phase: "Seed", action: "Threat brief with real IOCs targeting DACH financial services. Gated download. Multi-threaded: CISO + Ops Risk.", expect: "20-25% open · 8-10% engagement", bias: "reciprocity", biasNote: "Free threat brief with real IOCs — give value before any ask" },
      { week: "3-4", phase: "Activate", action: "SDR outbound to engaged accounts. Lead: 'Your ICT risk framework under Article 5 — how are you feeding it real-time threat data?'", expect: "18-22% meeting rate", bias: "lossAversion", biasNote: "Frame around compliance gap, not product features" },
      { week: "5-8", phase: "Qualify", action: "Joint CISO + Ops Risk call. 45-min discovery → 30-min Mercury demo. Financial-sector-specific intelligence.", expect: "60% advance to POV", bias: "socialProof", biasNote: "Reference similar-size banks already using Mercury" },
      { week: "9-14", phase: "Prove", action: "2-week POV embedded in SOC workflow. Parallel: DORA compliance mapping workshop with Ops Risk.", expect: "70% technical win", bias: "endowment", biasNote: "POV creates psychological ownership — removing it feels like a loss" },
      { week: "15-22", phase: "Close prep", action: "CFO business case: penalty cost vs. platform cost. Reference calls. Vendor risk package sent proactively.", expect: "75% close", bias: "anchoring", biasNote: "Lead with penalty/breach numbers, then show license cost" },
      { week: "23-30", phase: "Close", action: "Contract. Start with 1 module, expand clause for Y2. CSM handoff. Onboarding within 2 weeks.", expect: "Avg deal: €95K", bias: "commitmentConsistency", biasNote: "Land with 1 module — the small yes leads to expansion" },
    ],
    math: { accounts: 380, engaged: 38, meetings: 8, qualified: 5, pov: 4, closed: 3, revenue: "€285K", weeks: 30,
      note: "0.8% account-to-close · Enterprise benchmark: 0.5-1.2% (Gartner/MarketJoy)" },
  },
  {
    id: "eu-energy",
    name: "EU Energy & Critical Infrastructure",
    icon: "⚡",
    regulation: "NIS2 + CER Directive",
    headline: "CER resilience plans due July 2026 — energy companies need evidence of threat intelligence",
    accounts: 240,
    accountsSource: "NIS2 'essential entities' in energy: ~1,800 across DACH+Nordics+Benelux (ENISA NIS2 scope estimates, 2024). Filtered by employee count (200-5K), OT environment presence, and external TI need → ~240 targetable accounts.",
    deal: "€75K",
    dealSource: "Lower ACV than finance: energy companies have separate OT budgets, smaller IT security teams, and tighter procurement. €75K reflects entry-level TI engagement with OT add-on. Validated against Dragos/Claroty OT security deal ranges (€50-120K for mid-market energy).",
    cycle: "10-14 mo",
    cycleSource: "Energy sector adds 4-6 weeks for government-adjacent procurement (framework agreements, security clearance). Base enterprise cycle 6-9 months + procurement overhead + OT validation = 10-14 months.",
    phase: "Q3-Q4 (seed early — longest cycle)",
    icp: "Grid operators, LNG terminals, renewable energy · 200-5K employees · NIS2 essential entities · OT/IT convergence",
    tam: "~1,800 entities in scope",
    entryPoint: "Volt Typhoon disclosures + CER deadline July 2026 + NIS2 enforcement",
    committee: [
      { role: "CISO", tag: "Champion (shared with OT)", bias: "availabilityBias", msg: "Time outreach after next nation-state disclosure. ENISA flagged energy as most targeted sector — the event does the selling.", priority: "IT/OT convergence · Nation-state threats · NIS2 Art. 21" },
      { role: "OT Security Manager", tag: "Co-champion", bias: "authority", msg: "Mercury covers OT threat actors with ICS-specific TTPs and OT MITRE ATT&CK mapping. Not generic IT intelligence relabeled.", priority: "ICS/SCADA coverage · OT-specific TTPs" },
      { role: "Head of Compliance", tag: "Regulatory gate", bias: "scarcity", msg: "CER resilience plans due July 2026. The regulator will ask what threat intelligence you had. Mercury creates the evidence trail.", priority: "NIS2 Art. 21 · CER Art. 12 · Incident reporting (24h/72h)" },
      { role: "CFO", tag: "Budget approver", bias: "lossAversion", msg: "Board members personally liable under NIS2 Art. 20. This is the board's risk, not just IT's budget.", priority: "NIS2 penalties (€10M / 2% turnover) · Board liability" },
      { role: "Procurement", tag: "Process gate (slow)", bias: "reciprocity", msg: "ENISA-contracted. Pre-send security questionnaire and framework agreement compatibility. Government-adjacent procurement adds 4-6 weeks.", priority: "EU data sovereignty · Security clearance · Framework agreements" },
    ],
    sequence: [
      { week: "1-3", phase: "Seed", action: "Nation-state threat package (Volt Typhoon / Sandworm focus). Present at European Utility Week / ENCS events.", expect: "6-10% engage", bias: "reciprocity", biasNote: "Free OT-specific threat package with real IOCs" },
      { week: "4-8", phase: "Activate", action: "Multi-threaded SDR: CISO + OT Security. Lead: 'CER resilience plans due July 2026 — how are you documenting threat intelligence posture?'", expect: "18-22% meeting rate", bias: "scarcity", biasNote: "CER deadline creates natural urgency — no fake scarcity needed" },
      { week: "9-16", phase: "Qualify", action: "Joint IT + OT stakeholder call. OT threat landscape briefing for their vendor stack (Siemens, ABB, Schneider).", expect: "60% advance to POV", bias: "socialProof", biasNote: "Reference energy companies already using Mercury for OT coverage" },
      { week: "17-28", phase: "Prove", action: "4-week POV (energy cycles are longer). IT first, OT second. CER resilience plan mapping workshop.", expect: "65% technical win", bias: "endowment", biasNote: "Longer POV = deeper ownership. Harder to remove after 4 weeks in daily workflow" },
      { week: "29-40", phase: "Close prep", action: "Board-level resilience briefing. NIS2 Art. 20 personal liability. Procurement — may need framework agreement.", expect: "70% close", bias: "lossAversion", biasNote: "Personal liability for board members — most powerful loss aversion lever" },
      { week: "41-48", phase: "Close", action: "IT first, OT integration second. Phased deployment. CSM + dedicated analyst for onboarding.", expect: "Avg deal: €75K", bias: "commitmentConsistency", biasNote: "Phased deployment = multiple small yeses over time" },
    ],
    math: { accounts: 240, engaged: 18, meetings: 4, qualified: 3, pov: 2, closed: 2, revenue: "€150K", weeks: 48,
      note: "0.8% account-to-close · Sticky contracts — energy retention 90%+ · Start seeding Q1 for Q4 closes" },
  },
  {
    id: "dach-manufacturing",
    name: "DACH Manufacturing",
    icon: "🏭",
    regulation: "NIS2 + Cyber Resilience Act",
    headline: "Ransomware groups repeatedly hit German manufacturers — event-driven pipeline",
    accounts: 520,
    accountsSource: "Germany has ~270,000 manufacturing firms (Destatis). NIS2 'important entities' threshold: 50+ employees or €10M+ revenue. ~3,200 meet NIS2 criteria in DACH (BSI NIS2 impact assessment). Filtered by employee count (500-5K), OT exposure, and ransomware risk profile → ~520 targetable.",
    deal: "€55K",
    dealSource: "Mid-market = tighter budgets. Many use MSPs, not in-house SOC. €55K reflects entry-level annual TI subscription with partner-friendly pricing. Below the typical CFO approval threshold requiring board sign-off (~€75-100K). Validated against mid-market cybersecurity spend benchmarks (Gartner, 2025).",
    cycle: "4-8 mo",
    cycleSource: "Mid-market committees are smaller (4-7 people vs. 6-10 enterprise). Fewer procurement hoops. Event-driven urgency (ransomware incidents) compresses evaluation. 4-8 months is at the fast end of enterprise cybersecurity (ScaleVP: SMB 2-6mo, Enterprise 6-18mo).",
    phase: "Q2-Q3 (event-triggered — have playbook ready)",
    icp: "Mid-market manufacturers · 500-5K employees · Automotive, chemicals, machinery · OT + ransomware exposure",
    tam: "~3,200 entities in scope",
    entryPoint: "Ransomware attacks on German manufacturers (recurring trigger) + NIS2 board liability",
    committee: [
      { role: "IT Director / CISO", tag: "Champion", bias: "availabilityBias", msg: "BSI's Lagebericht confirms manufacturing as #1 ransomware target in DACH. Time outreach to the next incident — the event does the selling.", priority: "Ransomware early warning · Affordable · Small team friendly" },
      { role: "COO / Plant Manager", tag: "Production stakeholder", bias: "lossAversion", msg: "Don't talk cybersecurity. Talk production uptime. 'Last ransomware attack on a manufacturer your size = 11 days downtime.'", priority: "Production continuity · Downtime cost/hour · Insurance" },
      { role: "CFO", tag: "Budget owner", bias: "anchoring", msg: "Two anchors: NIS2 fines (€10M / 2% turnover) and cyber insurance premium. Mercury pays for itself through premium reduction.", priority: "Price sensitivity · Insurance premium reduction · NIS2 penalties" },
      { role: "External IT Provider", tag: "MSP evaluator", bias: "reciprocity", msg: "Partner program: MSP gets margin and looks good to their client. Position Mercury as an upgrade, not a replacement.", priority: "Integration with managed services · White-label · Partner margin" },
    ],
    sequence: [
      { week: "1-2", phase: "React", action: "Triggered by ransomware incident hitting German manufacturing. Threat brief with CVEs and IOCs. German-language.", expect: "10-14% engage (incident urgency)", bias: "availabilityBias", biasNote: "Recent incident makes the risk vivid and immediate — highest conversion window" },
      { week: "3-4", phase: "Blitz", action: "48-hour SDR response window. 'Your industry was hit this week. Your VPN vendor may be the entry point.'", expect: "18-22% meeting rate", bias: "lossAversion", biasNote: "The incident just happened to someone like them — loss feels imminent" },
      { week: "5-8", phase: "Qualify", action: "30-min discovery + 30-min demo. Manufacturing-specific. Ransomware early warning. Keep it simple.", expect: "50% advance to trial", bias: "socialProof", biasNote: "Name the manufacturer that was hit. 'They didn't have this. You could.'" },
      { week: "9-14", phase: "Trial", action: "2-week trial. If external IT provider involved, loop them in. Measure: did Mercury flag threats their current feeds missed?", expect: "65% convert", bias: "endowment", biasNote: "Trial creates ownership. Ask them to measure what Mercury caught that others missed." },
      { week: "15-20", phase: "Close", action: "CFO business case: insurance premium + NIS2 penalties. Annual contract with expansion clause.", expect: "Avg deal: €55K", bias: "anchoring", biasNote: "Show breach cost + insurance premium first, then Mercury price" },
    ],
    math: { accounts: 520, engaged: 62, meetings: 13, qualified: 7, pov: 5, closed: 4, revenue: "€220K", weeks: 20,
      note: "0.8% account-to-close · Event-driven: 48-72h urgency windows spike conversion 2-3x" },
  },
];

// ─── WIZARD STEPS ───────────────────────────────────────────────
const STEPS = [
  { id: "segment", label: "Choose Segment" },
  { id: "committee", label: "Buying Committee" },
  { id: "sequence", label: "Outreach Plan" },
  { id: "math", label: "Pipeline Math" },
  { id: "biases", label: "Psychology Playbook" },
];

// ─── DARK CYBERSECURITY THEME ───────────────────────────────────
const S = {
  bg: "#0a0a0f", surface: "#12121a", surfaceElevated: "#1a1a2e",
  border: "#1e293b", borderLight: "#2d3748",
  text: "#e2e8f0", muted: "#94a3b8", dim: "#64748b",
  accent: "#6366f1", accentLight: "#818cf8", accentDark: "#4f46e5",
  accentFaint: "#1e1b4b",
  cyan: "#06b6d4",
  red: "#ef4444", redLight: "#7f1d1d",
  green: "#10b981", greenLight: "#064e3b",
  orange: "#f59e0b", orangeLight: "#78350f",
  purple: "#a78bfa", purpleLight: "#1e1b4b",
};

// ─── INFO TOOLTIP ───────────────────────────────────────────────
function Info({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 4 }}>
      <span
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        style={{ cursor: "help", display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 16, height: 16, borderRadius: "50%", background: "rgba(99, 102, 241, 0.2)", color: S.cyan,
          fontSize: 10, fontWeight: 700, lineHeight: 1, border: `1px solid ${S.cyan}40` }}>?</span>
      {show && (
        <div style={{ position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
          background: S.surfaceElevated, color: S.text, padding: "8px 12px", borderRadius: 6, fontSize: 11,
          lineHeight: 1.5, width: 320, maxHeight: 300, overflowY: "auto", zIndex: 99, boxShadow: "0 4px 20px rgba(0,0,0,0.4)", border: `1px solid ${S.border}` }}>
          {text}
        </div>
      )}
    </span>
  );
}

// ─── BIAS CARD (full research panel) ────────────────────────────
function BiasCard({ biasKey, contextNote }) {
  const b = BIASES[biasKey];
  if (!b) return null;
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 8 }}>
      <div onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px",
          background: S.purpleLight, color: S.accent, borderRadius: 10, fontSize: 11,
          fontWeight: 600, cursor: "pointer", border: `1px solid ${S.accent}40` }}>
        🧠 {b.name} — {open ? "hide research" : "why this works →"}
      </div>
      {open && (
        <div onClick={(e) => e.stopPropagation()}
          style={{ marginTop: 8, border: `1px solid ${S.border}`, borderRadius: 8, overflow: "hidden", background: S.surface }}>
          {/* Disclaimer */}
          <div style={{ padding: "8px 12px", background: S.surfaceElevated, fontSize: 10, color: S.dim, lineHeight: 1.5, borderBottom: `1px solid ${S.border}` }}>
            {BIAS_DISCLAIMER}
          </div>
          {/* Source */}
          <div style={{ padding: "10px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: S.purple, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Source</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: S.text, marginBottom: 10 }}>{b.source}</div>

            <div style={{ fontSize: 10, fontWeight: 700, color: S.purple, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Research evidence</div>
            <div style={{ fontSize: 11, color: S.muted, lineHeight: 1.6, marginBottom: 10 }}>{b.evidence}</div>

            <div style={{ fontSize: 10, fontWeight: 700, color: S.purple, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>How it applies here</div>
            <div style={{ fontSize: 11, color: S.text, lineHeight: 1.6, marginBottom: contextNote ? 10 : 0 }}>{b.howItWorks}</div>

            {contextNote && (
              <>
                <div style={{ fontSize: 10, fontWeight: 700, color: S.cyan, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>In this specific context</div>
                <div style={{ fontSize: 11, color: S.text, lineHeight: 1.6 }}>{contextNote}</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BIAS TAG (inline label, no detail) ─────────────────────────
function BiasTag({ biasKey }) {
  const b = BIASES[biasKey];
  if (!b) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px",
      background: S.purpleLight, color: S.accent, borderRadius: 10, fontSize: 10,
      fontWeight: 600, border: `1px solid ${S.accent}40`,
    }}>🧠 {b.name}</span>
  );
}

// ─── THREAT BRIEF PREVIEW ───────────────────────────────────────
function ThreatBriefPreview({ segId }) {
  const brief = THREAT_BRIEFS[segId];
  if (!brief) return null;
  const [open, setOpen] = useState(false);
  const riskColors = { H: S.red, M: S.orange, L: S.green };
  const riskBg = { H: S.redLight, M: S.orangeLight, L: S.greenLight };

  return (
    <div style={{ marginTop: 10 }}>
      <div onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px",
          background: S.surfaceElevated, color: S.cyan, borderRadius: 10, fontSize: 11,
          fontWeight: 600, cursor: "pointer", border: `1px solid ${S.cyan}40` }}>
        📄 {open ? "Hide" : "Preview"}: What this threat brief looks like
      </div>
      {open && (
        <div onClick={(e) => e.stopPropagation()}
          style={{ marginTop: 8, borderRadius: 8, overflow: "hidden", border: `1px solid ${S.border}`, background: S.surface }}>
          {/* Header — QI brand style */}
          <div style={{ background: `linear-gradient(135deg, ${S.accentDark} 0%, ${S.accent} 100%)`, padding: "14px 16px", color: "#fff" }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", color: S.accentLight, textTransform: "uppercase", marginBottom: 4 }}>
              QUOINTELLIGENCE · THREAT LANDSCAPE REPORT · {brief.quarter}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{brief.title}</div>
          </div>

          {/* Threat rows */}
          <div style={{ background: S.surface }}>
            {brief.threats.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
                borderBottom: i < brief.threats.length - 1 ? `1px solid ${S.border}` : "none" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 36 }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: 4, fontWeight: 800, fontSize: 13, color: "#fff",
                    background: riskColors[t.risk] }}>{t.risk}</span>
                  <span style={{ fontSize: 10, color: t.trend.includes("↑") ? S.red : S.muted, marginTop: 2 }}>{t.trend}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: S.text }}>{t.type}</span>
                    <span style={{ fontSize: 10, color: S.muted }}>— {t.actor}</span>
                  </div>
                  <div style={{ fontSize: 11, color: S.muted, lineHeight: 1.5, marginTop: 2 }}>{t.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* MITRE ATT&CK strip */}
          <div style={{ background: S.surfaceElevated, padding: "8px 16px", borderTop: `1px solid ${S.border}` }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: S.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>MITRE ATT&CK Techniques Observed</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {brief.mitre.map((m, i) => (
                <span key={i} style={{ fontSize: 10, padding: "2px 6px", background: S.surface, border: `1px solid ${S.border}`,
                  borderRadius: 4, color: S.muted }}>{m}</span>
              ))}
            </div>
          </div>

          {/* Key insight */}
          <div style={{ background: S.surfaceElevated, padding: "10px 16px", borderTop: `1px solid ${S.border}` }}>
            <div style={{ fontSize: 11, color: S.muted, lineHeight: 1.5 }}>
              <strong style={{ color: S.orange }}>Why this brief is the reciprocity move:</strong> {brief.keyInsight}
            </div>
          </div>

          {/* Format note */}
          <div style={{ background: S.surface, padding: "8px 16px", borderTop: `1px solid ${S.border}`, fontSize: 10, color: S.dim, lineHeight: 1.5 }}>
            Format based on QuoIntelligence's actual Q4 2025 Industrials Threat Landscape Report. Includes: threat pyramid (common → industry → targeted), risk matrix (likelihood × impact), MITRE ATT&CK mapping, and trend analysis. QI tracks 150+ threat actor groups and 480+ attack tools.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── INTRO SCREEN ───────────────────────────────────────────────
function IntroScreen({ onBegin }) {
  const totalAccounts = SEGMENTS.reduce((a, s) => a + s.accounts, 0);
  const totalClosed = SEGMENTS.reduce((a, s) => a + s.math.closed, 0);
  const totalRevenue = SEGMENTS.reduce((a, s) => a + parseInt(s.math.revenue.replace(/[€K]/g, '')) * 1000, 0);

  const features = [
    { label: "Regulatory Mapping", icon: "⚖️" },
    { label: "Buying Committee Intelligence", icon: "👥" },
    { label: "Behavioral Science Layer", icon: "🧠" },
    { label: "Pipeline Mathematics", icon: "📊" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${S.bg} 0%, #0f0f16 100%)`, color: S.text, fontFamily: "'Inter', -apple-system, sans-serif", fontSize: 13, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "40px 20px" }}>

      {/* Top section */}
      <div></div>

      {/* Center content */}
      <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>

        {/* QI Label */}
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", color: S.accent, textTransform: "uppercase", marginBottom: 32 }}>
          QUOINTELLIGENCE
        </div>

        {/* Main title */}
        <div style={{ fontSize: 48, fontWeight: 800, color: S.text, marginBottom: 12, lineHeight: 1.1 }}>
          Pipeline Operations Plan
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 16, color: S.muted, marginBottom: 40, fontWeight: 500 }}>
          Regulated European Markets · H2 2025 – H1 2026
        </div>

        {/* Key metrics */}
        <div style={{ display: "flex", justifyContent: "center", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: S.cyan, marginBottom: 4 }}>{totalAccounts.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: S.dim, textTransform: "uppercase", letterSpacing: "0.05em" }}>Accounts</div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: S.cyan, marginBottom: 4 }}>{totalClosed}</div>
            <div style={{ fontSize: 11, color: S.dim, textTransform: "uppercase", letterSpacing: "0.05em" }}>Projected Deals</div>
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: S.cyan, marginBottom: 4 }}>€{(totalRevenue/1000).toFixed(0)}K</div>
            <div style={{ fontSize: 11, color: S.dim, textTransform: "uppercase", letterSpacing: "0.05em" }}>Year 1</div>
          </div>
        </div>

        {/* Description */}
        <div style={{ fontSize: 14, color: S.muted, lineHeight: 1.7, marginBottom: 48, maxWidth: 560, margin: "0 auto 48px" }}>
          EU regulations like DORA, NIS2, and CER are making threat intelligence mandatory — not optional. This creates predictable buying cycles across regulated industries. This tool maps every step: regulatory triggers, buying committees, behavioral principles, and pipeline mathematics for regulated European markets.
        </div>

        {/* Feature cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 48 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: S.surfaceElevated, border: `1px solid ${S.border}`, borderRadius: 8, padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: S.text }}>{f.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button onClick={onBegin}
          style={{
            padding: "14px 32px", background: S.accent, color: "#fff",
            border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700,
            cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.05em",
            boxShadow: `0 8px 20px rgba(99, 102, 241, 0.3)`,
            marginBottom: 48,
          }}
          onMouseEnter={(e) => e.target.style.boxShadow = `0 12px 28px rgba(99, 102, 241, 0.4)`}
          onMouseLeave={(e) => e.target.style.boxShadow = `0 8px 20px rgba(99, 102, 241, 0.3)`}>
          Begin Analysis →
        </button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", fontSize: 10, color: S.dim, lineHeight: 1.6 }}>
        <div>Prepared by Mohamed Ali Mohamed</div>
        <div>Built with research from Kahneman, Cialdini, Shotton, and enterprise cybersecurity benchmarks</div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────
export default function RegulatedPipeline() {
  const [showIntro, setShowIntro] = useState(true);
  const [step, setStep] = useState(0);
  const [segId, setSegId] = useState(null);
  const [expandedIdx, setExpandedIdx] = useState(null);

  const seg = SEGMENTS.find(s => s.id === segId);
  const currentStep = STEPS[step];

  const totalAccounts = SEGMENTS.reduce((a, s) => a + s.accounts, 0);
  const totalClosed = SEGMENTS.reduce((a, s) => a + s.math.closed, 0);
  const totalRevenue = SEGMENTS.reduce((a, s) => a + parseInt(s.math.revenue.replace(/[€K]/g, '')) * 1000, 0);

  const canAdvance = step === 0 ? !!segId : true;

  if (showIntro) {
    return <IntroScreen onBegin={() => setShowIntro(false)} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: S.bg, color: S.text, fontFamily: "'Inter', -apple-system, sans-serif", fontSize: 13 }}>

      {/* ─── HEADER ──────────────────────────────────────── */}
      <div style={{ borderBottom: `1px solid ${S.border}`, background: S.surface }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "14px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: S.text }}>QuoIntelligence — Pipeline Operations Plan</div>
              <div style={{ fontSize: 11, color: S.muted, marginTop: 1 }}>
                {totalAccounts.toLocaleString()} accounts · {totalClosed} projected deals · €{(totalRevenue/1000).toFixed(0)}K Year 1
                <Info text="Phased execution: Finance Q1-Q2, Manufacturing Q2-Q3, Energy Q3-Q4. Resourcing: 1 VP Marketing + 1-2 SDRs + content. Conversion benchmarked against Gartner, ScaleVP, MarketJoy enterprise cybersecurity data." />
              </div>
            </div>
            <div style={{ fontSize: 11, color: S.dim }}>Mohamed Ali Mohamed</div>
          </div>
        </div>
      </div>

      {/* ─── PROGRESS BAR ────────────────────────────────── */}
      <div style={{ background: S.surface, borderBottom: `1px solid ${S.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "10px 24px", display: "flex", gap: 2 }}>
          {STEPS.map((s, i) => (
            <button key={s.id} onClick={() => { if (i === 0 || segId) setStep(i); }}
              style={{
                flex: 1, padding: "6px 0", border: "none", cursor: (i === 0 || segId) ? "pointer" : "default",
                background: i === step ? S.accent : i < step ? S.accentDark : S.surfaceElevated,
                color: i === step ? "#fff" : i < step ? S.accentLight : S.dim,
                fontSize: 11, fontWeight: 600, borderRadius: i === 0 ? "4px 0 0 4px" : i === STEPS.length - 1 ? "0 4px 4px 0" : 0,
                transition: "all 0.15s",
              }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 24px" }}>

        {/* ═══ STEP 0: SEGMENT SELECT ═══════════════════════ */}
        {currentStep.id === "segment" && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: S.text }}>Which segment are you planning for?</div>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 20 }}>Three regulated verticals where threat intelligence is mandatory, not optional.</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SEGMENTS.map(seg => (
                <button key={seg.id} onClick={() => setSegId(seg.id)}
                  style={{
                    textAlign: "left", padding: "16px 20px", background: segId === seg.id ? S.surfaceElevated : S.surface,
                    border: `2px solid ${segId === seg.id ? S.accent : S.border}`, borderRadius: 8,
                    cursor: "pointer", transition: "all 0.15s", color: S.text,
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 16, marginRight: 8 }}>{seg.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{seg.name}</span>
                      <span style={{ fontSize: 11, color: S.muted, marginLeft: 8 }}>{seg.regulation}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12, fontSize: 12, color: S.muted }} onClick={e => e.stopPropagation()}>
                      <span>{seg.accounts} accounts<Info text={seg.accountsSource} /></span>
                      <span>{seg.deal} ACV<Info text={seg.dealSource} /></span>
                      <span>{seg.cycle}<Info text={seg.cycleSource} /></span>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: S.text, marginTop: 6, fontWeight: 500 }}>{seg.headline}</div>
                  <div style={{ fontSize: 11, color: S.dim, marginTop: 4 }}>{seg.phase}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ STEP 1: BUYING COMMITTEE ═════════════════════ */}
        {currentStep.id === "committee" && seg && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: S.text }}>Who's in the room?</div>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 4 }}>
              {seg.committee.length} stakeholders · Click any role to see messaging + psychology
              <Info text={`Enterprise cybersecurity purchases involve 6-10 stakeholders (Gartner). ${seg.name} committee mapped based on regulatory structure and buying authority.`} />
            </div>
            <div style={{ fontSize: 11, padding: "6px 10px", background: S.orangeLight, borderRadius: 4, color: S.orange, marginBottom: 16 }}>
              Entry point: {seg.entryPoint}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {seg.committee.map((p, i) => (
                <div key={i} onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                  style={{
                    background: S.surface, border: `1px solid ${expandedIdx === i ? S.accent : S.border}`,
                    borderRadius: 8, padding: "12px 16px", cursor: "pointer", transition: "all 0.15s", color: S.text,
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{p.role}</span>
                      <span style={{ fontSize: 10, padding: "1px 6px", background: S.accentFaint, color: S.accentLight, borderRadius: 8, fontWeight: 600 }}>{p.tag}</span>
                    </div>
                    <BiasTag biasKey={p.bias}  />
                  </div>

                  {expandedIdx === i && (
                    <div style={{ marginTop: 10, borderTop: `1px solid ${S.border}`, paddingTop: 10 }}>
                      <div style={{ fontSize: 11, color: S.dim, marginBottom: 6 }}>PRIORITIES: {p.priority}</div>
                      <div style={{ background: S.surfaceElevated, borderRadius: 6, padding: "10px 12px", marginBottom: 4, border: `1px solid ${S.border}` }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: S.cyan, marginBottom: 3 }}>WHAT TO SAY</div>
                        <div style={{ fontSize: 12, lineHeight: 1.6, color: S.text }}>{p.msg}</div>
                      </div>
                      <BiasCard biasKey={p.bias} contextNote={`For the ${p.role}: ${BIASES[p.bias]?.application}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ STEP 2: OUTREACH SEQUENCE ════════════════════ */}
        {currentStep.id === "sequence" && seg && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: S.text }}>Week-by-week outreach plan</div>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>
              {seg.sequence.length} phases over {seg.math.weeks} weeks · Each phase maps to a behavioral principle
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {seg.sequence.map((s, i) => (
                <div key={i} onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                  style={{ background: S.surface, border: `1px solid ${expandedIdx === i ? S.accent : S.border}`,
                    borderRadius: 8, padding: "12px 16px", cursor: "pointer", color: S.text }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: S.cyan, minWidth: 55 }}>Wk {s.week}</span>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{s.phase}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: S.green }}>{s.expect}</span>
                      <BiasTag biasKey={s.bias}  />
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: S.muted, lineHeight: 1.5 }}>{s.action}</div>

                  {expandedIdx === i && (
                    <div>
                      <BiasCard biasKey={s.bias} contextNote={s.biasNote} />
                      {i === 0 && <ThreatBriefPreview segId={seg.id} />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ STEP 3: PIPELINE MATH ═══════════════════════ */}
        {currentStep.id === "math" && seg && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: S.text }}>Pipeline conversion model</div>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>
              Conservative assumptions benchmarked against enterprise cybersecurity data
              <Info text="Enterprise cybersecurity: 0.5-1.2% account-to-close (MarketJoy/Gartner), 20-25% enterprise win rate (ScaleVP), 6-18 month cycles. Cybersecurity MQL-to-SQL: 15-18%." />
            </div>

            {/* Funnel */}
            <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 8, padding: 20 }}>
              {[
                { label: "Target Accounts", val: seg.math.accounts, pct: "100%", color: S.dim },
                { label: "Engaged", val: seg.math.engaged, pct: `${((seg.math.engaged/seg.math.accounts)*100).toFixed(1)}%`, color: S.muted },
                { label: "Meetings", val: seg.math.meetings, pct: `${((seg.math.meetings/seg.math.engaged)*100).toFixed(0)}%`, color: S.accent },
                { label: "Qualified", val: seg.math.qualified, pct: `${((seg.math.qualified/seg.math.meetings)*100).toFixed(0)}%`, color: S.accent },
                { label: "POV", val: seg.math.pov, pct: `${((seg.math.pov/seg.math.qualified)*100).toFixed(0)}%`, color: S.orange },
                { label: "Closed", val: seg.math.closed, pct: `${((seg.math.closed/seg.math.pov)*100).toFixed(0)}%`, color: S.green },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < 5 ? 8 : 0 }}>
                  <div style={{ width: 100, fontSize: 12, color: S.muted, textAlign: "right" }}>{row.label}</div>
                  <div style={{ flex: 1, background: S.surfaceElevated, borderRadius: 4, height: 24, position: "relative", overflow: "hidden", border: `1px solid ${S.border}` }}>
                    <div style={{
                      position: "absolute", left: 0, top: 0, height: "100%", borderRadius: 4,
                      width: `${Math.max(3, (row.val / seg.math.accounts) * 100)}%`,
                      background: `linear-gradient(90deg, ${row.color}, ${row.color}dd)`, opacity: 0.8,
                    }} />
                    <div style={{ position: "relative", padding: "0 8px", lineHeight: "24px", fontSize: 12, fontWeight: 600, color: S.text }}>
                      {row.val}
                    </div>
                  </div>
                  <div style={{ width: 50, fontSize: 11, color: S.dim, textAlign: "right" }}>{row.pct}</div>
                </div>
              ))}

              <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", padding: "12px 16px",
                background: `linear-gradient(135deg, ${S.greenLight} 0%, #0b3a2a 100%)`, borderRadius: 6, border: `1px solid ${S.green}40` }}>
                <div>
                  <span style={{ fontSize: 20, fontWeight: 800, color: S.green }}>{seg.math.revenue}</span>
                  <span style={{ fontSize: 12, color: S.muted, marginLeft: 8 }}>projected revenue</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: S.muted }}>{seg.math.weeks} weeks</div>
                  <div style={{ fontSize: 11, color: S.dim }}>{seg.deal} avg deal</div>
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: S.dim, lineHeight: 1.5 }}>{seg.math.note}</div>
            </div>

            {/* Total across all segments */}
            <div style={{ marginTop: 16, background: S.surface, border: `1px solid ${S.border}`, borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: S.muted, marginBottom: 8 }}>YEAR 1 TOTAL — ALL SEGMENTS</div>
              <div style={{ display: "flex", gap: 20 }}>
                <div><span style={{ fontSize: 20, fontWeight: 800, color: S.text }}>{totalAccounts.toLocaleString()}</span><span style={{ fontSize: 11, color: S.muted, marginLeft: 4 }}>accounts</span></div>
                <div><span style={{ fontSize: 20, fontWeight: 800, color: S.text }}>{totalClosed}</span><span style={{ fontSize: 11, color: S.muted, marginLeft: 4 }}>closed deals</span></div>
                <div><span style={{ fontSize: 20, fontWeight: 800, color: S.green }}>€{(totalRevenue/1000).toFixed(0)}K</span><span style={{ fontSize: 11, color: S.muted, marginLeft: 4 }}>revenue</span></div>
              </div>
              <div style={{ fontSize: 11, color: S.dim, marginTop: 8, lineHeight: 1.5 }}>
                Resourcing: 1 VP Marketing + 1-2 SDRs + content support. Phased: Finance first (DORA urgency), Manufacturing reacts to next ransomware event, Energy seeds early for long-cycle close.
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 4: PSYCHOLOGY PLAYBOOK ══════════════════ */}
        {currentStep.id === "biases" && seg && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: S.text }}>Psychology playbook for {seg.name}</div>
            <div style={{ fontSize: 12, color: S.muted, marginBottom: 16 }}>
              Behavioral principles mapped to each stage of the deal cycle
              <Info text="Sources: Cialdini (Influence, Pre-Suasion), Kahneman (Thinking Fast & Slow), Thaler/Sunstein (Nudge), Shotton (Choice Factory), Harhut (Behavioral Science in Marketing), + CISO-specific research from Gartner, Security Magazine, Computer Weekly." />
            </div>

            {/* Disclaimer */}
            <div style={{ padding: "10px 14px", background: S.purpleLight, borderRadius: 6, marginBottom: 16, fontSize: 11, lineHeight: 1.6, color: S.muted, border: `1px solid ${S.border}` }}>
              {BIAS_DISCLAIMER}
            </div>

            {/* Unique biases used in this segment */}
            {(() => {
              const usedBiases = [...new Set([
                ...seg.committee.map(c => c.bias),
                ...seg.sequence.map(s => s.bias),
              ])];
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {usedBiases.map(key => {
                    const b = BIASES[key];
                    if (!b) return null;
                    const committeeUses = seg.committee.filter(c => c.bias === key).map(c => c.role);
                    const sequenceUses = seg.sequence.filter(s => s.bias === key).map(s => `Wk ${s.week}: ${s.phase}`);
                    return (
                      <div key={key} style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 8, padding: "16px 18px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: S.text }}>🧠 {b.name}</span>
                          <span style={{ fontSize: 10, color: S.cyan, fontWeight: 600 }}>{b.source}</span>
                        </div>
                        <div style={{ fontSize: 12, color: S.text, lineHeight: 1.6, marginBottom: 8, fontWeight: 500 }}>→ {b.application}</div>

                        {/* Where it's used */}
                        <div style={{ display: "flex", gap: 12, fontSize: 11, marginBottom: 10 }}>
                          {committeeUses.length > 0 && (
                            <span style={{ padding: "2px 8px", background: S.accentFaint, color: S.accentLight, borderRadius: 8 }}>Committee: {committeeUses.join(", ")}</span>
                          )}
                          {sequenceUses.length > 0 && (
                            <span style={{ padding: "2px 8px", background: S.greenLight, color: S.green, borderRadius: 8 }}>Outreach: {sequenceUses.join(" → ")}</span>
                          )}
                        </div>

                        {/* Research evidence */}
                        <div style={{ padding: "10px 12px", background: S.surfaceElevated, borderRadius: 6, border: `1px solid ${S.border}` }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: S.purple, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Research evidence</div>
                          <div style={{ fontSize: 11, color: S.muted, lineHeight: 1.6, marginBottom: 8 }}>{b.evidence}</div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: S.purple, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>How it applies</div>
                          <div style={{ fontSize: 11, color: S.text, lineHeight: 1.6 }}>{b.howItWorks}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}</div>
        )}

        {/* ─── NAVIGATION ──────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 16, borderTop: `1px solid ${S.border}` }}>
          <button onClick={() => { setStep(Math.max(0, step - 1)); setExpandedIdx(null); }}
            disabled={step === 0}
            style={{
              padding: "8px 20px", border: `1px solid ${S.border}`, borderRadius: 6,
              background: S.surface, fontSize: 12, fontWeight: 600, cursor: step === 0 ? "default" : "pointer",
              color: step === 0 ? S.dim : S.text, opacity: step === 0 ? 0.5 : 1, transition: "all 0.2s",
            }}>← Back</button>

          {step < STEPS.length - 1 ? (
            <button onClick={() => { if (canAdvance) { setStep(step + 1); setExpandedIdx(null); } }}
              disabled={!canAdvance}
              style={{
                padding: "8px 20px", border: "none", borderRadius: 6,
                background: canAdvance ? S.accent : S.dim, color: "#fff",
                fontSize: 12, fontWeight: 600, cursor: canAdvance ? "pointer" : "default", transition: "all 0.2s",
              }}>{STEPS[step + 1]?.label} →</button>
          ) : (
            <div style={{ fontSize: 11, color: S.dim, padding: "8px 0" }}>
              Mohamed Ali Mohamed · Pipeline operations plan for QuoIntelligence VP Marketing role
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
