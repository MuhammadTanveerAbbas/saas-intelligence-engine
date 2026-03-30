import React, { useState, useRef, useEffect, useCallback } from "react";
import jsPDF from "jspdf";
import {
  Search, Save, Download, Mail, X, Loader2, Trash2, BarChart3, Zap, Target, Shield,
  TrendingUp, Users, Globe, MessageSquare, FileText, ArrowRight, Sparkles, Clock,
  Copy, Check, ChevronDown, ExternalLink, Layers, Eye, Award, AlertTriangle,
  Lightbulb, DollarSign, Rocket, Send, Hash, ThumbsUp, ThumbsDown, Star, Briefcase,
  MapPin, Calendar, CreditCard, Palette, Video, PenLine, Crosshair, Brain, Swords,
  ArrowUpRight, CircleDot, CheckCircle2, Circle, RotateCw, Activity, Gem, Crown, Medal,
  MousePointerClick, Megaphone, Lock, Cpu, ChevronRight, Box
} from "lucide-react";

// ═══════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════
const C = {
  bg: "#08090d", bg2: "#0d0e14", bg3: "#12141c", bg4: "#181b25",
  g: "#34d399", gDim: "#34d39944", gBg: "#34d3990a",
  b: "#60a5fa", bDim: "#60a5fa44", bBg: "#60a5fa0a",
  p: "#a78bfa", pDim: "#a78bfa44", pBg: "#a78bfa0a",
  y: "#fbbf24", yDim: "#fbbf2444",
  r: "#f87171", rDim: "#f8717144",
  text: "#e2e4e9", textMid: "#9ca3af", textDim: "#5b6270",
  border: "#1e2130", borderLight: "#2d3244",
  card: "#0e1017", cardHover: "#13151e",
  glass: "rgba(8,9,13,0.92)",
};
const F = { display: "'Bebas Neue', sans-serif", body: "'DM Sans', sans-serif", mono: "'Space Mono', monospace" };

// ═══════════════════════════════════════
// CSS KEYFRAMES & GLOBAL STYLES
// ═══════════════════════════════════════
const globalCSS = `
  @keyframes spin { to { transform: rotate(360deg) } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes dotPulse { 0%,100%{transform:scale(1);opacity:.4} 50%{transform:scale(1.3);opacity:1} }
  input::placeholder { color: #3d4150 }
  ::-webkit-scrollbar { width:5px; height:5px }
  ::-webkit-scrollbar-track { background:${C.bg2} }
  ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:3px }
  ::-webkit-scrollbar-thumb:hover { background:${C.borderLight} }
  * { box-sizing:border-box }
  ::selection { background:${C.g}33; color:${C.g} }

  /* Responsive */
  .si-header { display:flex; align-items:center; justify-content:space-between; padding:10px 28px; flex-wrap:wrap; gap:10px }
  .si-header-left { display:flex; align-items:center; gap:14px }
  .si-header-right { display:flex; align-items:center; gap:10px; flex-wrap:wrap }
  .si-header-brand-text { font-size:22px }
  .si-header-version { display:inline-block }
  .si-header-api-input { width:200px }
  .si-footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:40px; margin-bottom:40px }
  .si-footer-bottom { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px }
  .si-footer-bottom-left { display:flex; align-items:center; gap:16px; flex-wrap:wrap }
  .si-hero-title { font-size:58px }
  .si-search-bar { flex-direction:row }
  .si-empty-grid { grid-template-columns:repeat(3,1fr) }
  .si-compare-label { display:inline }

  @media (max-width: 768px) {
    .si-header { padding:10px 14px; gap:8px }
    .si-header-brand-text { font-size:16px }
    .si-header-version { display:none }
    .si-header-right { gap:6px }
    .si-header-api-input { width:130px }
    .si-compare-label { display:none }
    .si-footer-grid { grid-template-columns:1fr 1fr; gap:24px }
    .si-footer-bottom { flex-direction:column; align-items:center; text-align:center }
    .si-footer-bottom-left { justify-content:center }
    .si-hero-title { font-size:32px; letter-spacing:3px }
    .si-search-bar { flex-direction:column }
    .si-empty-grid { grid-template-columns:1fr }
  }
  @media (max-width: 480px) {
    .si-header { padding:8px 10px }
    .si-header-brand-text { font-size:14px }
    .si-header-right { width:100%; justify-content:flex-end }
    .si-header-api-input { width:110px; font-size:10px }
    .si-footer-grid { grid-template-columns:1fr; gap:20px }
    .si-hero-title { font-size:24px; letter-spacing:2px }
  }
`;

// ═══════════════════════════════════════
// TABS CONFIG
// ═══════════════════════════════════════
const TABS = ["Overview","Sources","ICP","Market","Competition","SWOT","Pricing","GTM","Ask AI","Full Report"] as const;
type TabName = typeof TABS[number];

const TAB_META: Record<string, { icon: React.ReactNode; color: string; desc: string }> = {
  Overview: { icon: <Eye size={14}/>, color: C.g, desc: "Executive summary & scores" },
  Sources: { icon: <Globe size={14}/>, color: C.b, desc: "Social & review signals" },
  ICP: { icon: <Users size={14}/>, color: C.p, desc: "Ideal customer profile" },
  Market: { icon: <TrendingUp size={14}/>, color: C.g, desc: "TAM/SAM/SOM & trends" },
  Competition: { icon: <BarChart3 size={14}/>, color: C.r, desc: "Competitive landscape" },
  SWOT: { icon: <Shield size={14}/>, color: C.y, desc: "Strategic analysis" },
  Pricing: { icon: <DollarSign size={14}/>, color: C.g, desc: "Pricing strategy" },
  GTM: { icon: <Rocket size={14}/>, color: C.b, desc: "Go-to-market plan" },
  "Ask AI": { icon: <MessageSquare size={14}/>, color: C.p, desc: "Chat with your data" },
  "Full Report": { icon: <FileText size={14}/>, color: C.textMid, desc: "Complete report" },
};

const EXAMPLES = [
  { label: "Notion competitor", icon: <PenLine size={14}/> },
  { label: "AI email writer", icon: <Mail size={14}/> },
  { label: "Loom alternative", icon: <Video size={14}/> },
  { label: "Stripe for devs", icon: <CreditCard size={14}/> },
  { label: "Linear for design", icon: <Palette size={14}/> },
];

// ═══════════════════════════════════════
// RESEARCH STEPS
// ═══════════════════════════════════════
const STEP_ICONS: React.ReactNode[] = [
  <Globe size={16}/>, <Hash size={16}/>, <MessageSquare size={16}/>, <MousePointerClick size={16}/>,
  <Briefcase size={16}/>, <Star size={16}/>, <Crosshair size={16}/>, <Activity size={16}/>,
  <Swords size={16}/>, <Brain size={16}/>,
];

const STEPS = [
  { name: "WEB CRAWL", color: C.b, useSearch: true, isCrawl: true, prompt: (q:string, _ctx?:any) => `You are researching "${q}" as a SaaS product. Your task is to find REAL, VERIFIABLE information. 

CRITICAL INSTRUCTIONS:
- If you cannot verify a fact, write "Unknown" instead of guessing
- Only include URLs you are confident actually exist
- Distinguish between the product being researched and its competitors
- If "${q}" is a concept (like "AI email writer"), research the LEADING product in that space

Think step by step:
1. What is the exact product name and official website?
2. What verifiable facts exist about funding, team size, founding year?
3. What is the actual pricing model and pricing page URL?

Return JSON only: {"product_name":"the exact product name","overview":"5-6 sentences with ONLY verifiable facts  be thorough and detailed","website":"official URL or Unknown","founded":"verified year or Unknown","pricing_model":"verified model or Unknown","pricing_url":"pricing page URL or Unknown","key_features":["exactly 8 features you can verify from the product's website  dig deep into feature pages, changelogs, and documentation"],"tagline":"exact tagline from website or Unknown","web_sentiment":"positive|negative|mixed","sources":["only URLs you are confident exist"],"funding_total":"verified amount or Unknown","last_funding_round":"verified round or Unknown","employee_estimate":"verified range or Unknown","tech_stack_hints":["only technologies you can verify"],"category":"SaaS category this belongs to"}` },
  { name: "X / TWITTER", color: C.b, useSearch: true, prompt: (q:string, ctx?:any) => {
    const productName = ctx?.web?.product_name || q;
    return `Search X/Twitter extensively for REAL discussions about "${productName}". Look across multiple time periods, search for the product name, its features, its founders, and related hashtags. Analyze sentiment deeply.

IMPORTANT: Only report information you can verify. Do NOT fabricate tweet URLs, usernames, or quotes. If you cannot find real data, say "Limited data available" for that field. Think step by step about what users love and hate.

${ctx?.web ? `Context: ${productName} is ${ctx.web.overview?.slice(0,300)||'a SaaS product'}. Key features: ${ctx.web.key_features?.join(', ')||'unknown'}` : ''}

Return JSON only: {"mention_volume":"verified estimate or Unknown","top_hashtags":["only real hashtags you can verify - find at least 5"],"sentiment":"detailed multi-paragraph analysis based on real signals","pain_points":["at least 5 specific complaints - only include if you can attribute them"],"praise_points":["at least 5 specific praise points - only include if you can attribute them"],"influencers":["real accounts that discussed this - only verified"],"notable_thread":"detailed summary of a real discussion or 'No verified thread found'","sources":["only verified URLs"]}`;
  }},
  { name: "REDDIT", color: C.r, useSearch: true, prompt: (q:string, ctx?:any) => {
    const productName = ctx?.web?.product_name || q;
    return `Search Reddit for REAL discussions about "${productName}". Search in subreddits like r/SaaS, r/startups, r/productivity, r/software, and product-specific subreddits.

CRITICAL: Only include subreddits and threads you can verify exist. Do NOT fabricate Reddit URLs.

${ctx?.web ? `Context: ${productName}  ${ctx.web.category||'SaaS'} product. ${ctx.web.overview?.slice(0,150)||''}` : ''}

Return JSON only: {"top_subreddits":["real subreddits where this is discussed"],"common_complaints":["specific complaints with context - verified only"],"common_praise":["specific praise with context - verified only"],"hot_thread_summary":"real thread summary or 'No verified thread found'","overall_sentiment":"nuanced analysis","user_count_estimate":"estimate or Unknown","alternative_suggestions":["products users actually suggest as alternatives"],"sources":["only verified Reddit URLs"]}`;
  }},
  { name: "PRODUCT HUNT", color: C.y, useSearch: true, prompt: (q:string, ctx?:any) => {
    const productName = ctx?.web?.product_name || q;
    return `Search Product Hunt for "${productName}". Find its REAL launch data.

CRITICAL: Only report verified data. If the product hasn't launched on PH, say launched=false and explain.

${ctx?.web ? `Product website: ${ctx.web.website||'Unknown'}` : ''}

Return JSON only: {"launched":"true or false - be honest","upvotes":"real number or Unknown","rank":"verified rank or Unknown","launch_date":"verified date or Unknown","hunter_comments":["real review summaries or state 'No verified reviews'"],"alternatives_on_ph":["real similar products on PH with verified data"],"maker_response":"verified or Unknown","category":"PH category or Unknown","sources":["only verified PH URLs"]}`;
  }},
  { name: "LINKEDIN INTEL", color: C.b, useSearch: true, prompt: (q:string, ctx?:any) => {
    const productName = ctx?.web?.product_name || q;
    const knownFacts = ctx?.web ? `Known: website=${ctx.web.website||'?'}, founded=${ctx.web.founded||'?'}, funding=${ctx.web.funding_total||'?'}, employees=${ctx.web.employee_estimate||'?'}` : '';
    return `Research "${productName}" company on LinkedIn and Crunchbase. ${knownFacts}

CRITICAL: Cross-reference with known facts above. Only report NEW verified information. Do NOT repeat or contradict known facts unless you have better data.

Return JSON only: {"employee_count":"verified or use known data","growth_rate":"verified or Unknown","key_hires":["only verified recent hires with real titles"],"tech_stack_signals":["technologies from real job postings"],"funding_stage":"verified stage","investors":["only verified real investor names"],"headquarters":"verified location","founding_team":["verified founders with real backgrounds"],"recent_news":["only verified recent news items with dates"],"sources":["only verified URLs"]}`;
  }},
  { name: "G2 & REVIEWS", color: C.g, useSearch: true, prompt: (q:string, ctx?:any) => {
    const productName = ctx?.web?.product_name || q;
    return `Search G2, Capterra, TrustRadius for "${productName}" reviews.

CRITICAL: Only report scores and reviews you can verify. Many products may not be on all platforms - say "Not listed" if so.

${ctx?.web ? `Product: ${productName}  ${ctx.web.overview?.slice(0,100)||''}` : ''}
${ctx?.twitter?.pain_points ? `Known user pain points from Twitter: ${ctx.twitter.pain_points.slice(0,2).join('; ')}` : ''}

Return JSON only: {"g2_score":"verified score or 'Not listed'","review_count":"verified count or Unknown","top_pros":["only from real reviews you can verify"],"top_cons":["only from real reviews you can verify"],"competitor_comparisons":["verified comparisons from review sites"],"nps_estimate":"data-based estimate or Unknown","review_trend":"based on verified data","notable_review":"real review summary or 'No verified review found'","sources":["only verified review site URLs"]}`;
  }},
  { name: "ICP ANALYSIS", color: C.p, useSearch: false, prompt: (q:string, ctx?:any) => {
    const productName = ctx?.web?.product_name || q;
    // Build a rich context from ALL previous steps
    const facts: string[] = [];
    if (ctx?.web) facts.push(`Product: ${productName}, ${ctx.web.pricing_model||'unknown pricing'}, features: ${ctx.web.key_features?.slice(0,4).join(', ')||'unknown'}`);
    if (ctx?.g2) facts.push(`Reviews: ${ctx.g2.g2_score||'?'} score, pros: ${ctx.g2.top_pros?.slice(0,2).join('; ')||'?'}, cons: ${ctx.g2.top_cons?.slice(0,2).join('; ')||'?'}`);
    if (ctx?.reddit) facts.push(`Reddit sentiment: ${ctx.reddit.overall_sentiment||'unknown'}, alternatives mentioned: ${ctx.reddit.alternative_suggestions?.join(', ')||'none'}`);
    if (ctx?.twitter) facts.push(`Twitter: ${ctx.twitter.sentiment||'unknown sentiment'}`);
    if (ctx?.linkedin) facts.push(`Company: ${ctx.linkedin.employee_count||'?'} employees, HQ: ${ctx.linkedin.headquarters||'?'}`);
    
    return `You are a SaaS go-to-market strategist. Define a PRECISE ideal customer profile for "${productName}" based ONLY on the evidence below. Do not invent data.

VERIFIED RESEARCH DATA:
${facts.join('\n')}

Think step by step:
1. Who currently uses this product? (based on review data and social signals)
2. What specific problems does it solve? (based on verified features and user praise)
3. Who would pay the most for it? (based on pricing model and company data)

Return JSON only: {"persona":"2-3 sentence buyer persona grounded in research data","company_size":"range based on evidence","industries":["5 verticals with reasoning from the data"],"job_titles":["5 decision-maker titles"],"budget_range":"range based on actual pricing data","pain_points":["4 pain points from user research"],"buying_triggers":["4 evidence-based triggers"],"geography":["4 markets based on data"],"tech_stack":["4 tools based on integration data"],"wtp_score":7,"deal_cycle":"based on pricing tier","expansion_signals":["3 signals from data"]}`;
  }},
  { name: "MARKET SIZING", color: C.g, useSearch: true, prompt: (q:string, ctx?:any) => {
    const productName = ctx?.web?.product_name || q;
    const category = ctx?.web?.category || 'SaaS';
    return `Research the market for "${productName}" (${category} category).

CRITICAL: Only cite market data from REAL research firms. If you cannot find a specific report, say "Estimated based on..." and explain your methodology. Do NOT fabricate research firm names or report titles.

${ctx?.icp ? `Target market: ${ctx.icp.industries?.slice(0,3).join(', ')||'unknown'}, company size: ${ctx.icp.company_size||'unknown'}` : ''}
${ctx?.competition?.competitors ? `Key competitors: ${ctx.competition?.competitors?.slice(0,3).map((c:any)=>c.name).join(', ')||'unknown'}` : ''}

Return JSON only: {"tam":"$ figure with source - cite real report or explain estimate","sam":"$ figure with clear reasoning","som":"$ figure with assumptions stated","cagr":"% with source or estimation basis","stage":"emerging|growing|mature|saturated","trends":["5 trends with data points - verified where possible"],"risks":["3 risks with evidence"],"score":7,"summary":"2-3 sentences referencing specific data","key_players_market_share":["top 3 with estimated share and basis"],"sources":["only verified report URLs"]}`;
  }},
  { name: "COMPETITORS", color: C.r, useSearch: true, prompt: (q:string, ctx?:any) => {
    const productName = ctx?.web?.product_name || q;
    // Gather all competitor mentions from previous steps
    const mentionedCompetitors: string[] = [];
    if (ctx?.g2?.competitor_comparisons) mentionedCompetitors.push(...ctx.g2.competitor_comparisons.map((c:string) => c.split(':')[0].trim()));
    if (ctx?.reddit?.alternative_suggestions) mentionedCompetitors.push(...ctx.reddit.alternative_suggestions);
    if (ctx?.producthunt?.alternatives_on_ph) mentionedCompetitors.push(...ctx.producthunt.alternatives_on_ph.map((a:any) => typeof a === 'string' ? a : a.name));
    const uniqueCompetitors = [...new Set(mentionedCompetitors)].filter(Boolean).slice(0, 8);
    
    return `Research REAL competitors of "${productName}" thoroughly. 

COMPETITORS IDENTIFIED FROM RESEARCH: ${uniqueCompetitors.length > 0 ? uniqueCompetitors.join(', ') : 'None identified yet - find the top competitors'}
${ctx?.web ? `Product context: ${ctx.web.overview?.slice(0,150)||''}` : ''}

CRITICAL: For EACH competitor, only include VERIFIED data:
- Real funding amounts from Crunchbase or press releases
- Actual pricing from their pricing pages  
- Real strengths/weaknesses from reviews, not assumptions

Return JSON only: {"competitors":[{"name":"real name","score":7,"description":"2 sentences with VERIFIED facts only","funding":"verified amount or Unknown","pricing":"actual pricing from their website or Unknown","strengths":["2 verified strengths"],"weaknesses":["2 verified weaknesses"],"website":"verified URL"}],"gap":"underserved need based on evidence from reviews and social signals","positioning":"strategy grounded in competitive data","threat_score":7,"moat_analysis":"defensibility analysis based on evidence"}. Include exactly 6 real competitors.`;
  }},
  { name: "SYNTHESIS", color: C.p, useSearch: false, prompt: (q:string, ctx?:any) => {
    // Build comprehensive context summary - prioritize key data points
    const highlights: string[] = [];
    if (ctx?.web) highlights.push(`PRODUCT: ${ctx.web.product_name||q} | ${ctx.web.website||'?'} | Founded: ${ctx.web.founded||'?'} | Funding: ${ctx.web.funding_total||'?'} | Pricing: ${ctx.web.pricing_model||'?'} | Sentiment: ${ctx.web.web_sentiment||'?'}`);
    if (ctx?.g2) highlights.push(`REVIEWS: G2=${ctx.g2.g2_score||'?'} | ${ctx.g2.review_count||'?'} reviews | NPS≈${ctx.g2.nps_estimate||'?'}`);
    if (ctx?.market) highlights.push(`MARKET: TAM=${ctx.market.tam||'?'} | CAGR=${ctx.market.cagr||'?'} | Stage=${ctx.market.stage||'?'} | Score=${ctx.market.score||'?'}/10`);
    if (ctx?.competition) highlights.push(`COMPETITION: ${ctx.competition.competitors?.length||0} competitors analyzed | Threat=${ctx.competition.threat_score||'?'}/10 | Gap: ${ctx.competition.gap?.slice(0,100)||'?'}`);
    if (ctx?.icp) highlights.push(`ICP: ${ctx.icp.company_size||'?'} employees | Budget: ${ctx.icp.budget_range||'?'} | WTP=${ctx.icp.wtp_score||'?'}/10`);
    if (ctx?.twitter) highlights.push(`SOCIAL: Twitter=${ctx.twitter.mention_volume||'?'} | Sentiment=${ctx.twitter.sentiment?.slice(0,80)||'?'}`);
    if (ctx?.linkedin) highlights.push(`COMPANY: ${ctx.linkedin.employee_count||'?'} employees | Growth: ${ctx.linkedin.growth_rate||'?'} | Stage: ${ctx.linkedin.funding_stage||'?'}`);

    return `You are a senior SaaS analyst at a top VC firm. Provide a RIGOROUS final assessment of "${ctx?.web?.product_name||q}".

VERIFIED RESEARCH DATA:
${highlights.join('\n')}

CRITICAL RULES:
1. Base EVERY claim on the data above  reference specific numbers
2. If data is "Unknown" for a field, acknowledge the gap in your assessment
3. Your verdict must logically follow from the evidence
4. Pricing recommendations must be based on competitor pricing data
5. GTM must reference actual channels that worked for similar products

Think step by step:
1. What does the evidence say about viability? (funding, reviews, market size)
2. What are the biggest risks? (competition level, market saturation, weaknesses)
3. What's the best opportunity? (market gaps, underserved needs, timing)

Return JSON only: {"verdict":"BUY|BUILD|WATCH|AVOID","viability":8,"differentiator":"specific advantage from the evidence","executive_summary":"4-5 sentences citing specific data points from above","recommendation":"3-4 sentences with specific actionable steps","biggest_risk":"specific risk citing evidence","top_opportunity":"specific opportunity citing evidence","ratings":{"innovation":8,"market_fit":8,"competition_level":5,"monetization":7,"timing":8},"swot":{"strengths":["4 from evidence"],"weaknesses":["4 from evidence"],"opportunities":["4 from evidence"],"threats":["4 from evidence"]},"pricing_strategy":{"model":"based on competitor pricing data","tiers":[{"name":"Starter","price":"$ based on competitor analysis","features":["3"]},{"name":"Pro","price":"$","features":["3"]},{"name":"Enterprise","price":"Custom","features":["3"]}],"freemium":true,"rationale":"citing competitor pricing"},"gtm":{"phase1":"0-3 months","phase2":"3-12 months","phase3":"12-24 months","channels":["5 channels based on where users were found"],"cac_estimate":"$ based on market data","ltv_estimate":"$ based on pricing","payback_period":"timeline","north_star_metric":"specific metric"}}`;
  }},
];
const STEP_KEYS = ["web","twitter","reddit","producthunt","linkedin","g2","icp","market","competition","synthesis"];

// ═══════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════

const ScoreRing = ({ score, max = 10, label, size = 90, color, showLabel = true }: { score: number; max?: number; label: string; size?: number; color?: string; showLabel?: boolean }) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(score / max, 1);
  const offset = animated ? circ * (1 - pct) : circ;
  const c = color || (pct >= 0.7 ? C.g : pct >= 0.4 ? C.y : C.r);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={3} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={3.5}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)", filter: `drop-shadow(0 0 8px ${c}55)` }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: F.mono, fontSize: size > 70 ? 22 : 16, color: c, fontWeight: 700 }}>{score}</span>
        </div>
      </div>
      {showLabel && <span style={{ fontFamily: F.body, fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1.2, textAlign: "center", maxWidth: size + 20 }}>{label}</span>}
    </div>
  );
};

const GlowCard = ({ children, style, color, hover = true, animate = false }: { children: React.ReactNode; style?: React.CSSProperties; color?: string; hover?: boolean; animate?: boolean }) => {
  const [hovered, setHovered] = useState(false);
  const borderColor = hovered && hover ? (color || C.g) + "44" : C.border;
  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered && hover ? C.cardHover : C.card,
        border: `1px solid ${borderColor}`,
        borderRadius: 16,
        padding: 24,
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        ...(animate ? { animation: "fadeUp 0.5s ease forwards" } : {}),
        ...style,
      }}
    >
      {color && (
        <div style={{
          position: "absolute", top: -1, left: -1, right: -1, height: 1,
          background: `linear-gradient(90deg, transparent, ${color}${hovered ? '44' : '18'}, transparent)`,
          transition: "all 0.3s",
        }} />
      )}
      {children}
    </div>
  );
};

const Tag = ({ children, color = C.g, size = "sm", icon }: { children: React.ReactNode; color?: string; size?: "sm" | "md"; icon?: React.ReactNode }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: size === "md" ? "5px 14px" : "3px 10px",
    borderRadius: 20,
    fontSize: size === "md" ? 12 : 11,
    fontFamily: F.mono,
    background: color + "12",
    color,
    border: `1px solid ${color}22`,
    transition: "all 0.2s",
  }}>{icon}{children}</span>
);

const SectionTitle = ({ children, color = C.g, icon, sub }: { children: React.ReactNode; color?: string; icon?: React.ReactNode; sub?: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 16px 0" }}>
    {icon && <span style={{ color, opacity: 0.7, display: "flex", alignItems: "center" }}>{icon}</span>}
    <div>
      <h3 style={{ fontFamily: F.body, fontSize: 14, color: C.text, margin: 0, fontWeight: 600, letterSpacing: 0.3 }}>{children}</h3>
      {sub && <p style={{ fontFamily: F.body, fontSize: 11, color: C.textDim, margin: "2px 0 0" }}>{sub}</p>}
    </div>
  </div>
);

const StatBlock = ({ label, value, color = C.g, icon }: { label: string; value: string | number; color?: string; icon?: React.ReactNode }) => (
  <div style={{ textAlign: "center" }}>
    {icon && <div style={{ color, marginBottom: 6, opacity: 0.6, display: "flex", justifyContent: "center" }}>{icon}</div>}
    <p style={{ fontFamily: F.mono, fontSize: 24, color, margin: "0 0 4px", fontWeight: 700 }}>{value}</p>
    <p style={{ fontFamily: F.body, fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1.5, margin: 0 }}>{label}</p>
  </div>
);

const ListItem = ({ children, color = C.g, icon }: { children: React.ReactNode; color?: string; icon?: React.ReactNode }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
    <span style={{ color, flexShrink: 0, marginTop: 3 }}>{icon || <ChevronRight size={12}/>}</span>
    <span>{children}</span>
  </div>
);

const Divider = () => <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)`, margin: "20px 0" }} />;

// ═══════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════
// AI Provider configs
type AIProvider = "anthropic" | "groq" | "gemini" | "openai" | "mistral";
const AI_PROVIDERS: Record<AIProvider, { label: string; icon: React.ReactNode; color: string; placeholder: string; url: string }> = {
  anthropic: { label: "Anthropic", icon: <Brain size={14}/>, color: "#d4a574", placeholder: "sk-ant-...", url: "https://api.anthropic.com/v1/messages" },
  groq: { label: "Groq", icon: <Cpu size={14}/>, color: "#f55036", placeholder: "gsk_...", url: "https://api.groq.com/openai/v1/chat/completions" },
  gemini: { label: "Gemini", icon: <Gem size={14}/>, color: "#4285f4", placeholder: "AIza...", url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent" },
  openai: { label: "ChatGPT", icon: <Sparkles size={14}/>, color: "#10a37f", placeholder: "sk-...", url: "https://api.openai.com/v1/chat/completions" },
  mistral: { label: "Mistral", icon: <Zap size={14}/>, color: "#ff7000", placeholder: "...", url: "https://api.mistral.ai/v1/chat/completions" },
};

const detectProvider = (key: string): AIProvider | null => {
  const k = key.trim();
  if (k.startsWith("sk-ant-")) return "anthropic";
  if (k.startsWith("gsk_")) return "groq";
  if (k.startsWith("AIza")) return "gemini";
  if (k.startsWith("sk-proj-") || k.startsWith("sk-")) return "openai";
  if (k.length > 20 && !k.startsWith("sk")) return "mistral"; // fallback heuristic
  return null;
};

const DEFAULT_GROQ_KEY = import.meta.env.VITE_DEFAULT_GROQ_API_KEY || "";

const SaaSIntelligenceEngine = () => {
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState<AIProvider>(DEFAULT_GROQ_KEY ? "groq" : "anthropic");

  // Effective key: user key takes priority, else default Groq key
  const effectiveApiKey = apiKey || DEFAULT_GROQ_KEY;
  const effectiveProvider: AIProvider = apiKey ? provider : (DEFAULT_GROQ_KEY ? "groq" : provider);

  const handleApiKeyChange = (val: string) => {
    setApiKey(val);
    const detected = detectProvider(val);
    if (detected) setProvider(detected);
  };
  const [showProviderMenu, setShowProviderMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabName>("Overview");
  const [isResearching, setIsResearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [failedSteps, setFailedSteps] = useState<boolean[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [data, setData] = useState<any>(null);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role:string;content:string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [researchStartTime, setResearchStartTime] = useState<number | null>(null);
  const [successCount, setSuccessCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const cancelRef = useRef(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const providerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  // Elapsed time tracker
  useEffect(() => {
    if (!researchStartTime) return;
    const interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - researchStartTime) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [researchStartTime]);

  const addLog = useCallback((msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]), []);

  // Close provider menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (providerRef.current && !providerRef.current.contains(e.target as Node)) setShowProviderMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Robust JSON extraction from AI responses
  const extractJSON = (raw: string): any => {
    // Try direct parse first
    try { return JSON.parse(raw); } catch {}
    // Remove code fences
    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    try { return JSON.parse(cleaned); } catch {}
    // Try to find JSON object in the text
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) { try { return JSON.parse(match[0]); } catch {} }
    throw new Error("Could not parse JSON from response");
  };

  const callAI = async (systemPrompt: string, userMsg: string, useSearch: boolean) => {
    if (effectiveProvider === "anthropic") {
      const body: any = {
        model: "claude-sonnet-4-20250514", max_tokens: 2500,
        system: systemPrompt,
        messages: [{ role: "user", content: userMsg }],
      };
      if (useSearch) body.tools = [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", "x-api-key": effectiveApiKey,
          "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const t = await res.text().catch(()=>""); throw new Error(`API ${res.status}: ${res.statusText}${t ? `  ${t.slice(0,200)}` : ""}`); }
      const json = await res.json();
      const raw = json.content.filter((b:any) => b.type === "text").map((b:any) => b.text).join("\n");
      return extractJSON(raw);
    } else if (effectiveProvider === "gemini") {
      const body: any = {
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userMsg }] }],
        generationConfig: { maxOutputTokens: 2500, temperature: 0.2 },
      };
      if (useSearch) {
        body.tools = [{ googleSearchRetrieval: { dynamicRetrievalConfig: { mode: "MODE_DYNAMIC", dynamicThreshold: 0.3 } } }];
      }
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${effectiveApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const t = await res.text().catch(()=>""); throw new Error(`API ${res.status}: ${res.statusText}${t ? `  ${t.slice(0,200)}` : ""}`); }
      const json = await res.json();
      const raw = json.candidates[0].content.parts[0].text;
      const result = extractJSON(raw);
      const groundingMeta = json.candidates[0]?.groundingMetadata;
      if (groundingMeta?.webSearchQueries) result._grounding_queries = groundingMeta.webSearchQueries;
      if (groundingMeta?.groundingChunks) result._grounding_sources = groundingMeta.groundingChunks.map((c:any) => c.web?.uri).filter(Boolean);
      return result;
    } else {
      const urlMap: Record<string, string> = { groq: "https://api.groq.com/openai/v1/chat/completions", openai: "https://api.openai.com/v1/chat/completions", mistral: "https://api.mistral.ai/v1/chat/completions" };
      const modelMap: Record<string, string> = { groq: "llama-3.3-70b-versatile", openai: "gpt-4o-mini", mistral: "mistral-small-latest" };
      const res = await fetch(urlMap[effectiveProvider], {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${effectiveApiKey}` },
        body: JSON.stringify({
          model: modelMap[effectiveProvider], max_tokens: 2500,
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMsg }],
          temperature: 0.2,
        }),
      });
      if (!res.ok) { const t = await res.text().catch(()=>""); throw new Error(`API ${res.status}: ${res.statusText}${t ? `  ${t.slice(0,200)}` : ""}`); }
      const json = await res.json();
      return extractJSON(json.choices[0].message.content);
    }
  };

  // Retry wrapper
  const callAIWithRetry = async (systemPrompt: string, userMsg: string, useSearch: boolean, stepName: string, retries = 2): Promise<any> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await callAI(systemPrompt, userMsg, useSearch);
      } catch (e: any) {
        if (attempt < retries) {
          addLog(`${stepName} attempt ${attempt + 1} failed, retrying...`);
          await new Promise(r => setTimeout(r, 1500 * (attempt + 1))); // backoff
        } else {
          throw e;
        }
      }
    }
  };

  const runResearch = async () => {
    if (!effectiveApiKey) { setErrorMsg(`Please enter your ${AI_PROVIDERS[effectiveProvider].label} API key in the header first`); setTimeout(() => setErrorMsg(""), 4000); return; }
    if (!query) { setErrorMsg("Please enter a SaaS product or idea to research"); setTimeout(() => setErrorMsg(""), 4000); return; }
    cancelRef.current = false;
    setIsResearching(true);
    setProgress(0);
    setLogs([]);
    setData(null);
    setActiveTab("Overview");
    setChatMessages([]);
    setCompletedSteps(new Array(STEPS.length).fill(false));
    setFailedSteps(new Array(STEPS.length).fill(false));
    setSuccessCount(0);
    setFailCount(0);
    setResearchStartTime(Date.now());
    setElapsedTime(0);
    const results: any = { query, date: new Date().toISOString(), provider: AI_PROVIDERS[provider].label };
    let sc = 0, fc = 0;

    for (let i = 0; i < STEPS.length; i++) {
      if (cancelRef.current) { addLog("⛔ Research cancelled by user"); break; }
      const step = STEPS[i];
      setCurrentStepIdx(i);
      addLog(`🔍 ${step.name}  searching...`);
      setProgress((i / STEPS.length) * 100);
      try {
        // Build cross-reference context from ALL previous successful steps
        const ctx: any = {};
        STEP_KEYS.forEach((key, ki) => { if (ki < i && results[key]) ctx[key] = results[key]; });
        const hasCtx = Object.keys(ctx).length > 0;
        const promptText = step.prompt(query, hasCtx ? ctx : undefined);
        
        // Adaptive system prompt based on provider capabilities
        const hasRealSearch = provider === "anthropic" || provider === "gemini";
        const sysPrompt = hasRealSearch 
          ? "You are a world-class SaaS research analyst with web search access. Search the web thoroughly for each data point. Return ONLY valid JSON. Every fact must be verifiable  if you cannot find or verify something, write 'Unknown'. Never fabricate URLs, company data, or statistics."
          : `You are a world-class SaaS research analyst. You do NOT have web search access, so be EXTRA careful:
- Only state facts you are confident about from your training data
- For ANY data point you are unsure about, write "Unknown" or "Unverified"  
- Do NOT fabricate URLs  only include URLs you are highly confident exist
- Do NOT make up funding amounts, employee counts, or review scores
- It is better to say "Unknown" than to guess wrong
Return ONLY valid JSON.`;

        // Run AI call with minimum 2s per step to ensure deep research (≥20s total)
        const stepStart = Date.now();
        results[STEP_KEYS[i]] = await callAIWithRetry(sysPrompt, promptText, step.useSearch, step.name);
        const elapsed = Date.now() - stepStart;
        if (elapsed < 2000) await new Promise(r => setTimeout(r, 2000 - elapsed));
        
        // Log key findings for visibility
        const r = results[STEP_KEYS[i]];
        if (i === 0 && r?.product_name) addLog(`📋 Identified: ${r.product_name}`);
        if (i === 0 && r?.website) addLog(`🌐 Website: ${r.website}`);
        
        addLog(`✅ ${step.name} complete`);
        setCompletedSteps(prev => { const n = [...prev]; n[i] = true; return n; });
        sc++;
        setSuccessCount(sc);
      } catch (e: any) {
        addLog(`❌ ${step.name} failed: ${e.message}`);
        results[STEP_KEYS[i]] = null;
        setFailedSteps(prev => { const n = [...prev]; n[i] = true; return n; });
        fc++;
        setFailCount(fc);
      }
      setProgress(((i + 1) / STEPS.length) * 100);
    }
    addLog(`Research complete: ${sc} succeeded, ${fc} failed in ${Math.floor((Date.now() - (researchStartTime || Date.now())) / 1000)}s`);
    setData(results);
    setIsResearching(false);
    setCurrentStepIdx(-1);
    setResearchStartTime(null);
  };

  const saveReport = () => { if (data) setSavedReports(prev => [...prev, { ...data, savedAt: new Date().toISOString() }]); };
  const loadReport = (r: any) => { setData(r); setShowCompare(false); setActiveTab("Overview"); };
  const deleteReport = (idx: number) => setSavedReports(prev => prev.filter((_, i) => i !== idx));

  const exportHTML = () => {
    if (!data) return;
    const s = data.synthesis;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>SaaS Intel: ${data.query}</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans&family=Space+Mono&display=swap" rel="stylesheet">
<style>body{background:#05050f;color:#e8e8f0;font-family:'DM Sans',sans-serif;padding:40px;max-width:900px;margin:0 auto}h1{font-family:'Bebas Neue';color:#00ffa3;font-size:48px;letter-spacing:3px}h2{font-family:'Bebas Neue';color:#00c8ff;font-size:28px;border-bottom:1px solid #1e1e38;padding-bottom:8px;letter-spacing:2px}h3{font-family:'Bebas Neue';color:#b06fff;font-size:20px}.card{background:#0c0c1e;border:1px solid #1e1e38;border-radius:14px;padding:22px;margin:12px 0}.tag{display:inline-block;padding:3px 12px;border-radius:20px;font-size:12px;font-family:'Space Mono';background:rgba(0,255,163,0.08);color:#00ffa3;margin:3px}.verdict{font-family:'Bebas Neue';font-size:72px;letter-spacing:4px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}ul{padding-left:20px}li{margin:6px 0;line-height:1.5}</style></head><body>
<h1>SaaS Intelligence Report: ${data.query}</h1>
<p style="color:#666680;font-family:'Space Mono';font-size:12px">Generated ${new Date(data.date).toLocaleDateString()} | Powered by SaaS Intel Engine</p>
${s ? `<div class="card" style="border-left:3px solid ${s.verdict==='BUY'?'#00ffa3':s.verdict==='BUILD'?'#00c8ff':s.verdict==='WATCH'?'#ffd166':'#ff5577'}"><p class="verdict" style="color:${s.verdict==='BUY'?'#00ffa3':s.verdict==='BUILD'?'#00c8ff':s.verdict==='WATCH'?'#ffd166':'#ff5577'};margin:0">${s.verdict}</p><p style="font-size:15px;line-height:1.7">${s.executive_summary||''}</p><p><strong style="color:#00c8ff">Viability:</strong> ${s.viability}/10 | <strong style="color:#b06fff">Differentiator:</strong> ${s.differentiator||''}</p></div>` : ''}
${data.web ? `<h2>Overview</h2><div class="card"><p style="font-size:15px;line-height:1.7">${data.web.overview||''}</p><p><strong>Website:</strong> ${data.web.website||''} | <strong>Founded:</strong> ${data.web.founded||''} | <strong>Pricing:</strong> ${data.web.pricing_model||''}</p><p><strong>Key Features:</strong></p><ul>${(data.web.key_features||[]).map((f:string)=>`<li>${f}</li>`).join('')}</ul></div>` : ''}
${s?.swot ? `<h2>SWOT Analysis</h2><div class="grid"><div class="card" style="border-top:3px solid #00ffa3"><h3 style="color:#00ffa3">Strengths</h3><ul>${s.swot.strengths.map((i:string)=>`<li>${i}</li>`).join('')}</ul></div><div class="card" style="border-top:3px solid #ff5577"><h3 style="color:#ff5577">Weaknesses</h3><ul>${s.swot.weaknesses.map((i:string)=>`<li>${i}</li>`).join('')}</ul></div><div class="card" style="border-top:3px solid #00c8ff"><h3 style="color:#00c8ff">Opportunities</h3><ul>${s.swot.opportunities.map((i:string)=>`<li>${i}</li>`).join('')}</ul></div><div class="card" style="border-top:3px solid #ffd166"><h3 style="color:#ffd166">Threats</h3><ul>${s.swot.threats.map((i:string)=>`<li>${i}</li>`).join('')}</ul></div></div>` : ''}
${s?.pricing_strategy ? `<h2>Pricing Strategy</h2><div class="card"><p><strong>Model:</strong> ${s.pricing_strategy.model} | <strong>Freemium:</strong> ${s.pricing_strategy.freemium?'Yes':'No'}</p><p style="line-height:1.7">${s.pricing_strategy.rationale||''}</p></div>` : ''}
${s?.gtm ? `<h2>Go-To-Market</h2><div class="card"><p><strong>Phase 1:</strong> ${s.gtm.phase1}</p><p><strong>Phase 2:</strong> ${s.gtm.phase2}</p><p><strong>Phase 3:</strong> ${s.gtm.phase3}</p><p style="margin-top:12px"><strong>CAC:</strong> ${s.gtm.cac_estimate} | <strong>LTV:</strong> ${s.gtm.ltv_estimate} | <strong>Payback:</strong> ${s.gtm.payback_period} | <strong>North Star:</strong> ${s.gtm.north_star_metric}</p></div>` : ''}
<p style="text-align:center;margin-top:40px;color:#44445a;font-size:11px;font-family:'Space Mono'">Generated by SaaS Intelligence Engine</p>
</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `saas-intel-${data.query.replace(/\s+/g,"-").toLowerCase()}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!data) return;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentW = w - margin * 2;
    let y = 0;
    const s = data.synthesis;
    const web = data.web;

    const addPage = () => { doc.addPage(); y = margin; };
    const checkPage = (needed: number) => { if (y + needed > h - 20) addPage(); };

    const drawText = (text: string, x: number, yPos: number, opts: { size?: number; color?: [number, number, number]; bold?: boolean; maxW?: number; lineH?: number } = {}) => {
      const { size = 10, color = [232, 232, 240], bold = false, maxW = contentW, lineH = 5 } = opts;
      doc.setFontSize(size);
      doc.setTextColor(...color);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, maxW);
      doc.text(lines, x, yPos);
      return lines.length * lineH;
    };

    const drawLine = (yPos: number, color: [number, number, number] = [26, 26, 50]) => {
      doc.setDrawColor(...color);
      doc.setLineWidth(0.3);
      doc.line(margin, yPos, w - margin, yPos);
    };

    const hex2rgb = (hex: string): [number, number, number] => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };

    // ═══ COVER PAGE ═══
    doc.setFillColor(5, 5, 15);
    doc.rect(0, 0, w, h, "F");

    // Accent bar
    const gfx = doc.context2d;
    doc.setFillColor(0, 255, 163);
    doc.rect(0, 0, 6, h, "F");

    // Title block
    y = 60;
    drawText("SAAS INTELLIGENCE", margin + 4, y, { size: 36, color: [0, 255, 163], bold: true });
    y += 16;
    drawText("REPORT", margin + 4, y, { size: 36, color: [0, 200, 255], bold: true });
    y += 24;
    drawLine(y, [0, 255, 163]);
    y += 12;
    drawText((data.web?.product_name || data.query).toUpperCase(), margin + 4, y, { size: 28, color: [232, 232, 240], bold: true });
    y += 16;

    if (s?.verdict) {
      const vc = s.verdict === "BUY" ? [0, 255, 163] : s.verdict === "BUILD" ? [0, 200, 255] : s.verdict === "WATCH" ? [255, 209, 102] : [255, 85, 119];
      drawText(`VERDICT: ${s.verdict}`, margin + 4, y, { size: 22, color: vc as [number, number, number], bold: true });
      y += 10;
      drawText(`Viability Score: ${s.viability}/10`, margin + 4, y, { size: 14, color: [0, 255, 163] });
      y += 14;
    }

    if (s?.executive_summary) {
      const lh = drawText(s.executive_summary, margin + 4, y, { size: 11, color: [160, 160, 184], maxW: contentW - 8, lineH: 5.5 });
      y += lh + 8;
    }

    // Meta info
    y = h - 50;
    drawLine(y, [26, 26, 50]);
    y += 8;
    drawText(`Generated: ${new Date(data.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, margin + 4, y, { size: 9, color: [102, 102, 128] });
    y += 5;
    drawText(`AI Provider: ${data.provider || "Unknown"}`, margin + 4, y, { size: 9, color: [102, 102, 128] });
    y += 5;
    drawText("Powered by SaaS Intelligence Engine v1.0", margin + 4, y, { size: 9, color: [0, 255, 163] });

    // ═══ TABLE OF CONTENTS ═══
    addPage();
    doc.setFillColor(5, 5, 15);
    doc.rect(0, 0, w, h, "F");
    drawText("TABLE OF CONTENTS", margin, y, { size: 20, color: [0, 200, 255], bold: true });
    y += 12;
    drawLine(y, [0, 200, 255]);
    y += 10;

    const tocItems = [
      { label: "Executive Summary & Verdict", has: !!s },
      { label: "Product Overview", has: !!web },
      { label: "Social & Community Signals", has: !!(data.twitter || data.reddit || data.producthunt) },
      { label: "Company Intelligence (LinkedIn)", has: !!data.linkedin },
      { label: "Reviews & Ratings (G2)", has: !!data.g2 },
      { label: "Ideal Customer Profile", has: !!data.icp },
      { label: "Market Sizing & Trends", has: !!data.market },
      { label: "Competitive Landscape", has: !!data.competition },
      { label: "SWOT Analysis", has: !!s?.swot },
      { label: "Pricing Strategy", has: !!s?.pricing_strategy },
      { label: "Go-To-Market Plan", has: !!s?.gtm },
      { label: "Sources & Citations", has: true },
    ];
    tocItems.forEach((item, i) => {
      const col: [number, number, number] = item.has ? [232, 232, 240] : [80, 80, 100];
      drawText(`${String(i + 1).padStart(2, "0")}  ${item.label}`, margin + 4, y, { size: 11, color: col });
      if (!item.has) drawText(" No data", margin + 120, y, { size: 9, color: [80, 80, 100] });
      y += 7;
    });

    // ═══ HELPER: Section Header ═══
    const sectionHeader = (title: string, color: [number, number, number] = [0, 255, 163]) => {
      addPage();
      doc.setFillColor(5, 5, 15);
      doc.rect(0, 0, w, h, "F");
      drawText(title.toUpperCase(), margin, y, { size: 18, color, bold: true });
      y += 10;
      drawLine(y, color);
      y += 8;
    };

    const bulletList = (items: string[], color: [number, number, number] = [0, 255, 163]) => {
      (items || []).forEach(item => {
        checkPage(12);
        drawText("▸", margin + 2, y, { size: 8, color });
        const lh = drawText(item, margin + 8, y, { size: 10, color: [200, 200, 220], maxW: contentW - 12, lineH: 5 });
        y += Math.max(lh, 5) + 2;
      });
    };

    const kvPair = (label: string, value: string, color: [number, number, number] = [0, 200, 255]) => {
      checkPage(10);
      drawText(label + ":", margin + 2, y, { size: 9, color, bold: true });
      const lh = drawText(value, margin + 50, y, { size: 10, color: [200, 200, 220], maxW: contentW - 54, lineH: 5 });
      y += Math.max(lh, 5) + 2;
    };

    // ═══ EXECUTIVE SUMMARY ═══
    if (s) {
      sectionHeader("Executive Summary", [0, 255, 163]);
      if (s.executive_summary) { const lh = drawText(s.executive_summary, margin + 2, y, { size: 11, color: [220, 220, 235], maxW: contentW - 4, lineH: 5.5 }); y += lh + 8; }
      if (s.recommendation) { kvPair("Recommendation", s.recommendation); y += 3; }
      if (s.differentiator) { kvPair("Key Differentiator", s.differentiator, [176, 111, 255]); }
      if (s.biggest_risk) { kvPair("Biggest Risk", s.biggest_risk, [255, 85, 119]); }
      if (s.top_opportunity) { kvPair("Top Opportunity", s.top_opportunity, [0, 255, 163]); }
      if (s.ratings) {
        y += 6;
        drawText("INTELLIGENCE SCORES", margin + 2, y, { size: 12, color: [176, 111, 255], bold: true }); y += 8;
        Object.entries(s.ratings).forEach(([k, v]) => {
          checkPage(7);
          const label = k.replace(/_/g, " ").toUpperCase();
          drawText(`${label}: ${v}/10`, margin + 4, y, { size: 10, color: [200, 200, 220] });
          // Score bar
          doc.setFillColor(26, 26, 50); doc.rect(margin + 60, y - 3, 60, 4, "F");
          doc.setFillColor(0, 255, 163); doc.rect(margin + 60, y - 3, 60 * ((v as number) / 10), 4, "F");
          y += 7;
        });
      }
    }

    // ═══ PRODUCT OVERVIEW ═══
    if (web) {
      sectionHeader("Product Overview", [0, 200, 255]);
      if (web.overview) { const lh = drawText(web.overview, margin + 2, y, { size: 11, color: [220, 220, 235], maxW: contentW - 4, lineH: 5.5 }); y += lh + 6; }
      if (web.website) kvPair("Website", web.website);
      if (web.founded) kvPair("Founded", web.founded);
      if (web.pricing_model) kvPair("Pricing Model", web.pricing_model);
      if (web.funding_total) kvPair("Total Funding", web.funding_total);
      if (web.employee_estimate) kvPair("Team Size", web.employee_estimate);
      if (web.key_features?.length) { y += 4; drawText("KEY FEATURES", margin + 2, y, { size: 11, color: [0, 255, 163], bold: true }); y += 7; bulletList(web.key_features); }
    }

    // ═══ SOCIAL SIGNALS ═══
    if (data.twitter || data.reddit || data.producthunt) {
      sectionHeader("Social & Community Signals", [0, 200, 255]);
      if (data.twitter) {
        drawText("X / TWITTER", margin + 2, y, { size: 12, color: [0, 200, 255], bold: true }); y += 7;
        if (data.twitter.sentiment) kvPair("Sentiment", data.twitter.sentiment);
        if (data.twitter.mention_volume) kvPair("Volume", data.twitter.mention_volume);
        if (data.twitter.pain_points?.length) { drawText("Pain Points:", margin + 2, y, { size: 9, color: [255, 85, 119], bold: true }); y += 6; bulletList(data.twitter.pain_points, [255, 85, 119]); }
        if (data.twitter.praise_points?.length) { drawText("Praise:", margin + 2, y, { size: 9, color: [0, 255, 163], bold: true }); y += 6; bulletList(data.twitter.praise_points); }
        y += 4;
      }
      if (data.reddit) {
        checkPage(20);
        drawText("REDDIT", margin + 2, y, { size: 12, color: [255, 85, 119], bold: true }); y += 7;
        if (data.reddit.overall_sentiment) kvPair("Sentiment", data.reddit.overall_sentiment);
        if (data.reddit.common_complaints?.length) { drawText("Complaints:", margin + 2, y, { size: 9, color: [255, 85, 119], bold: true }); y += 6; bulletList(data.reddit.common_complaints, [255, 85, 119]); }
        if (data.reddit.common_praise?.length) { drawText("Praise:", margin + 2, y, { size: 9, color: [0, 255, 163], bold: true }); y += 6; bulletList(data.reddit.common_praise); }
        y += 4;
      }
      if (data.producthunt) {
        checkPage(20);
        drawText("PRODUCT HUNT", margin + 2, y, { size: 12, color: [255, 209, 102], bold: true }); y += 7;
        if (data.producthunt.upvotes) kvPair("Upvotes", String(data.producthunt.upvotes));
        if (data.producthunt.rank) kvPair("Rank", data.producthunt.rank);
        if (data.producthunt.launch_date) kvPair("Launch Date", data.producthunt.launch_date);
      }
    }

    // ═══ LINKEDIN ═══
    if (data.linkedin) {
      sectionHeader("Company Intelligence", [0, 200, 255]);
      const li = data.linkedin;
      if (li.employee_count) kvPair("Employees", li.employee_count);
      if (li.growth_rate) kvPair("Growth Rate", li.growth_rate);
      if (li.funding_stage) kvPair("Funding Stage", li.funding_stage);
      if (li.headquarters) kvPair("Headquarters", li.headquarters);
      if (li.investors?.length) { y += 3; drawText("INVESTORS", margin + 2, y, { size: 10, color: [176, 111, 255], bold: true }); y += 6; bulletList(li.investors, [176, 111, 255]); }
      if (li.key_hires?.length) { drawText("KEY HIRES", margin + 2, y, { size: 10, color: [0, 200, 255], bold: true }); y += 6; bulletList(li.key_hires, [0, 200, 255]); }
    }

    // ═══ G2 REVIEWS ═══
    if (data.g2) {
      sectionHeader("Reviews & Ratings", [0, 255, 163]);
      const g = data.g2;
      if (g.g2_score) kvPair("G2 Score", String(g.g2_score));
      if (g.review_count) kvPair("Total Reviews", String(g.review_count));
      if (g.nps_estimate) kvPair("NPS Estimate", String(g.nps_estimate));
      if (g.top_pros?.length) { y += 3; drawText("TOP PROS", margin + 2, y, { size: 10, color: [0, 255, 163], bold: true }); y += 6; bulletList(g.top_pros); }
      if (g.top_cons?.length) { drawText("TOP CONS", margin + 2, y, { size: 10, color: [255, 85, 119], bold: true }); y += 6; bulletList(g.top_cons, [255, 85, 119]); }
    }

    // ═══ ICP ═══
    if (data.icp) {
      sectionHeader("Ideal Customer Profile", [176, 111, 255]);
      const icp = data.icp;
      if (icp.persona) { const lh = drawText(icp.persona, margin + 2, y, { size: 11, color: [220, 220, 235], maxW: contentW - 4, lineH: 5.5 }); y += lh + 6; }
      if (icp.company_size) kvPair("Company Size", icp.company_size);
      if (icp.budget_range) kvPair("Budget Range", icp.budget_range);
      if (icp.industries?.length) { y += 3; drawText("TARGET INDUSTRIES", margin + 2, y, { size: 10, color: [0, 200, 255], bold: true }); y += 6; bulletList(icp.industries, [0, 200, 255]); }
      if (icp.job_titles?.length) { drawText("DECISION MAKERS", margin + 2, y, { size: 10, color: [176, 111, 255], bold: true }); y += 6; bulletList(icp.job_titles, [176, 111, 255]); }
      if (icp.pain_points?.length) { drawText("PAIN POINTS", margin + 2, y, { size: 10, color: [255, 85, 119], bold: true }); y += 6; bulletList(icp.pain_points, [255, 85, 119]); }
    }

    // ═══ MARKET ═══
    if (data.market) {
      sectionHeader("Market Sizing & Trends", [0, 255, 163]);
      const m = data.market;
      if (m.tam) kvPair("TAM", m.tam);
      if (m.sam) kvPair("SAM", m.sam);
      if (m.som) kvPair("SOM", m.som);
      if (m.cagr) kvPair("CAGR", m.cagr);
      if (m.stage) kvPair("Market Stage", m.stage);
      if (m.summary) { y += 4; const lh = drawText(m.summary, margin + 2, y, { size: 10, color: [200, 200, 220], maxW: contentW - 4, lineH: 5 }); y += lh + 4; }
      if (m.trends?.length) { drawText("KEY TRENDS", margin + 2, y, { size: 10, color: [0, 255, 163], bold: true }); y += 6; bulletList(m.trends); }
      if (m.risks?.length) { drawText("MARKET RISKS", margin + 2, y, { size: 10, color: [255, 85, 119], bold: true }); y += 6; bulletList(m.risks, [255, 85, 119]); }
    }

    // ═══ COMPETITORS ═══
    if (data.competition?.competitors?.length) {
      sectionHeader("Competitive Landscape", [255, 85, 119]);
      data.competition.competitors.forEach((c: any, i: number) => {
        checkPage(30);
        drawText(`#${i + 1} ${c.name}`, margin + 2, y, { size: 13, color: [0, 200, 255], bold: true });
        if (c.score != null) drawText(`${c.score}/10`, w - margin - 15, y, { size: 12, color: (c.score >= 7 ? [0, 255, 163] : c.score >= 4 ? [255, 209, 102] : [255, 85, 119]) as [number, number, number], bold: true });
        y += 7;
        if (c.description) { const lh = drawText(c.description, margin + 4, y, { size: 9, color: [180, 180, 200], maxW: contentW - 8, lineH: 4.5 }); y += lh + 3; }
        if (c.funding) { drawText(`Funding: ${c.funding}`, margin + 4, y, { size: 9, color: [176, 111, 255] }); y += 5; }
        if (c.pricing) { drawText(`Pricing: ${c.pricing}`, margin + 4, y, { size: 9, color: [255, 209, 102] }); y += 5; }
        if (c.strengths?.length) c.strengths.forEach((s2: string) => { checkPage(6); drawText(`✓ ${s2}`, margin + 4, y, { size: 9, color: [0, 255, 163] }); y += 5; });
        if (c.weaknesses?.length) c.weaknesses.forEach((w2: string) => { checkPage(6); drawText(`✗ ${w2}`, margin + 4, y, { size: 9, color: [255, 85, 119] }); y += 5; });
        y += 4;
      });
      if (data.competition.gap) { y += 2; kvPair("Market Gap", data.competition.gap); }
      if (data.competition.positioning) kvPair("Positioning", data.competition.positioning);
    }

    // ═══ SWOT ═══
    if (s?.swot) {
      sectionHeader("SWOT Analysis", [255, 209, 102]);
      const quads = [
        { t: "STRENGTHS", items: s.swot.strengths, c: [0, 255, 163] as [number, number, number] },
        { t: "WEAKNESSES", items: s.swot.weaknesses, c: [255, 85, 119] as [number, number, number] },
        { t: "OPPORTUNITIES", items: s.swot.opportunities, c: [0, 200, 255] as [number, number, number] },
        { t: "THREATS", items: s.swot.threats, c: [255, 209, 102] as [number, number, number] },
      ];
      quads.forEach(q => {
        checkPage(20);
        drawText(q.t, margin + 2, y, { size: 11, color: q.c, bold: true }); y += 7;
        bulletList(q.items, q.c);
        y += 4;
      });
    }

    // ═══ PRICING ═══
    if (s?.pricing_strategy) {
      sectionHeader("Pricing Strategy", [0, 255, 163]);
      const ps = s.pricing_strategy;
      kvPair("Model", ps.model);
      kvPair("Freemium", ps.freemium ? "Yes" : "No");
      if (ps.rationale) { y += 3; const lh = drawText(ps.rationale, margin + 2, y, { size: 10, color: [200, 200, 220], maxW: contentW - 4, lineH: 5 }); y += lh + 6; }
      (ps.tiers || []).forEach((tier: any, i: number) => {
        checkPage(20);
        const tc: [number, number, number] = i === 0 ? [160, 160, 184] : i === 1 ? [0, 255, 163] : [255, 209, 102];
        drawText(`${tier.name}  ${tier.price}`, margin + 2, y, { size: 12, color: tc, bold: true }); y += 7;
        (tier.features || []).forEach((f: string) => { checkPage(6); drawText(`• ${f}`, margin + 6, y, { size: 9, color: [180, 180, 200] }); y += 5; });
        y += 4;
      });
    }

    // ═══ GTM ═══
    if (s?.gtm) {
      sectionHeader("Go-To-Market Plan", [0, 200, 255]);
      const g = s.gtm;
      const phases = [
        { l: "Phase 1  Launch (0-3 mo)", v: g.phase1, c: [0, 255, 163] as [number, number, number] },
        { l: "Phase 2  Scale (3-12 mo)", v: g.phase2, c: [0, 200, 255] as [number, number, number] },
        { l: "Phase 3  Dominate (12-24 mo)", v: g.phase3, c: [176, 111, 255] as [number, number, number] },
      ];
      phases.forEach(p => {
        checkPage(15);
        drawText(p.l, margin + 2, y, { size: 11, color: p.c, bold: true }); y += 6;
        const lh = drawText(p.v, margin + 4, y, { size: 10, color: [200, 200, 220], maxW: contentW - 8, lineH: 5 }); y += lh + 5;
      });
      y += 4;
      drawText("UNIT ECONOMICS", margin + 2, y, { size: 12, color: [0, 255, 163], bold: true }); y += 8;
      if (g.cac_estimate) kvPair("CAC", g.cac_estimate, [255, 85, 119]);
      if (g.ltv_estimate) kvPair("LTV", g.ltv_estimate, [0, 255, 163]);
      if (g.payback_period) kvPair("Payback Period", g.payback_period, [255, 209, 102]);
      if (g.north_star_metric) kvPair("North Star Metric", g.north_star_metric, [0, 200, 255]);
      if (g.channels?.length) { y += 4; drawText("CHANNELS", margin + 2, y, { size: 10, color: [0, 200, 255], bold: true }); y += 6; bulletList(g.channels, [0, 200, 255]); }
    }

    // ═══ SOURCES & CITATIONS ═══
    sectionHeader("Sources & Citations", [0, 200, 255]);
    const allSources: string[] = [];
    const collectSources = (obj: any) => {
      if (!obj) return;
      if (obj.sources) allSources.push(...obj.sources);
      if (obj._grounding_sources) allSources.push(...obj._grounding_sources);
    };
    STEP_KEYS.forEach(k => collectSources(data[k]));
    const uniqueSources = [...new Set(allSources)].filter(Boolean);

    if (uniqueSources.length > 0) {
      drawText(`${uniqueSources.length} sources cited across research`, margin + 2, y, { size: 10, color: [160, 160, 184] }); y += 8;
      uniqueSources.forEach((src, i) => {
        checkPage(7);
        drawText(`[${i + 1}]`, margin + 2, y, { size: 8, color: [0, 200, 255], bold: true });
        const lh = drawText(src, margin + 12, y, { size: 8, color: [140, 140, 170], maxW: contentW - 16, lineH: 4 });
        y += Math.max(lh, 4) + 2;
      });
    } else {
      drawText("No explicit source URLs were returned by the AI provider.", margin + 2, y, { size: 10, color: [102, 102, 128] });
      y += 6;
      drawText("For best source citation, use Anthropic (Claude) with web search enabled.", margin + 2, y, { size: 9, color: [102, 102, 128] });
    }

    // ═══ FOOTER ON LAST PAGE ═══
    y = h - 20;
    drawLine(y, [26, 26, 50]); y += 6;
    drawText("Generated by SaaS Intelligence Engine v1.0  Confidential", margin, y, { size: 8, color: [80, 80, 100] });

    doc.save(`saas-intel-${data.query.replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };
  const getEmailText = () => {
    if (!data?.synthesis) return "";
    const s = data.synthesis;
    return `SaaS Intelligence Report: ${data.query}\n${"=".repeat(40)}\n\nVerdict: ${s.verdict} (Viability: ${s.viability}/10)\n\n${s.executive_summary}\n\nRecommendation: ${s.recommendation}\nBiggest Risk: ${s.biggest_risk}\nTop Opportunity: ${s.top_opportunity}\nDifferentiator: ${s.differentiator}\n\n${"=".repeat(40)}\nGenerated by SaaS Intelligence Engine`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);
    const sysPrompt = `You are an expert SaaS analyst assistant. The user has researched "${data?.query}". Here is the complete research data:\n${JSON.stringify(data, null, 2)}\n\nAnswer questions based on this data. Be concise, insightful, and actionable. Use specific numbers and facts from the data. Respond in plain text, not JSON.`;
    try {
      if (effectiveProvider === "anthropic") {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": effectiveApiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
          body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: sysPrompt, messages: [{ role: "user", content: userMsg }] }),
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const json = await res.json();
        setChatMessages(prev => [...prev, { role: "assistant", content: json.content.filter((b:any)=>b.type==="text").map((b:any)=>b.text).join("\n") }]);
      } else if (effectiveProvider === "gemini") {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${effectiveApiKey}`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ system_instruction: { parts: [{ text: sysPrompt }] }, contents: [{ parts: [{ text: userMsg }] }], generationConfig: { maxOutputTokens: 1000 } }),
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const json = await res.json();
        setChatMessages(prev => [...prev, { role: "assistant", content: json.candidates[0].content.parts[0].text }]);
      } else {
        const urlMap: Record<string, string> = { groq: "https://api.groq.com/openai/v1/chat/completions", openai: "https://api.openai.com/v1/chat/completions", mistral: "https://api.mistral.ai/v1/chat/completions" };
        const modelMap: Record<string, string> = { groq: "llama-3.3-70b-versatile", openai: "gpt-4o-mini", mistral: "mistral-small-latest" };
        const res = await fetch(urlMap[effectiveProvider], {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${effectiveApiKey}` },
          body: JSON.stringify({ model: modelMap[effectiveProvider], max_tokens: 1000, messages: [{ role: "system", content: sysPrompt }, { role: "user", content: userMsg }] }),
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const json = await res.json();
        setChatMessages(prev => [...prev, { role: "assistant", content: json.choices[0].message.content }]);
      }
    } catch (e: any) {
      setChatMessages(prev => [...prev, { role: "assistant", content: `Error: ${e.message}. Check your ${AI_PROVIDERS[effectiveProvider].label} API key and try again.` }]);
    }
    setChatLoading(false);
  };

  const cancelResearch = () => { cancelRef.current = true; };

  const retryFailedSteps = async () => {
    if (!data || !effectiveApiKey) return;
    setIsResearching(true);
    setResearchStartTime(Date.now());
    const results = { ...data };
    const failed = failedSteps.map((f, i) => f ? i : -1).filter(i => i >= 0);
    addLog(`Retrying ${failed.length} failed steps...`);
    for (const i of failed) {
      if (cancelRef.current) break;
      const step = STEPS[i];
      setCurrentStepIdx(i);
      addLog(`🔄 Retrying ${step.name}...`);
      try {
        const ctx: any = {};
        STEP_KEYS.forEach((key, ki) => { if (ki < i && results[key]) ctx[key] = results[key]; });
        const promptText = step.prompt(query, Object.keys(ctx).length > 0 ? ctx : undefined);
        const hasRealSearch = provider === "anthropic" || provider === "gemini";
        const sysPrompt = hasRealSearch 
          ? "You are a world-class SaaS research analyst with web search. Return ONLY valid JSON. Every fact must be verifiable  write 'Unknown' if unsure."
          : "You are a world-class SaaS research analyst WITHOUT web search. Only state facts you are confident about. Write 'Unknown' for anything uncertain. Return ONLY valid JSON.";
        results[STEP_KEYS[i]] = await callAIWithRetry(sysPrompt, promptText, step.useSearch, step.name, 1);
        addLog(`✅ ${step.name} retry succeeded`);
        setCompletedSteps(prev => { const n = [...prev]; n[i] = true; return n; });
        setFailedSteps(prev => { const n = [...prev]; n[i] = false; return n; });
      } catch (e: any) {
        addLog(`❌ ${step.name} retry failed: ${e.message}`);
      }
    }
    setData(results);
    setIsResearching(false);
    setCurrentStepIdx(-1);
    setResearchStartTime(null);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const verdictColor = (v: string) => v === "BUY" ? C.g : v === "BUILD" ? C.b : v === "WATCH" ? C.y : C.r;

  // ═══════════════════════════════════════
  // TAB RENDERERS
  // ═══════════════════════════════════════

  const renderOverview = () => {
    const w = data?.web; const s = data?.synthesis;
    if (!w) return <EmptyState text="No overview data available" />;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Product Header */}
        <div style={{ background: C.bg2, borderRadius: 12, padding: "24px 28px", border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <h2 style={{ fontFamily: F.display, fontSize: 28, color: C.text, margin: 0, letterSpacing: 1 }}>{(w.product_name || data.query).toUpperCase()}</h2>
            {w.web_sentiment && <Tag color={w.web_sentiment === "positive" ? C.g : w.web_sentiment === "negative" ? C.r : C.y}>{w.web_sentiment}</Tag>}
          </div>
          {w.tagline && <p style={{ color: C.textMid, fontSize: 13, margin: "0 0 12px", fontStyle: "italic" }}>"{w.tagline}"</p>}
          <p style={{ color: C.text, lineHeight: 1.75, fontSize: 14, margin: "0 0 16px" }}>{w.overview}</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
            {w.website && <QuickFact icon={<Globe size={12}/>} label="Website" value={w.website} />}
            {w.founded && <QuickFact icon={<Calendar size={12}/>} label="Founded" value={w.founded} />}
            {w.pricing_model && <QuickFact icon={<DollarSign size={12}/>} label="Pricing" value={w.pricing_model} />}
            {w.funding_total && <QuickFact icon={<DollarSign size={12}/>} label="Funding" value={w.funding_total} />}
            {w.employee_estimate && <QuickFact icon={<Users size={12}/>} label="Team" value={w.employee_estimate} />}
            {data.linkedin?.headquarters && <QuickFact icon={<MapPin size={12}/>} label="HQ" value={data.linkedin.headquarters} />}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: C.border, borderRadius: 10, overflow: "hidden" }}>
          {[
            data.linkedin?.employee_count && { label: "Employees", value: data.linkedin.employee_count, color: C.b },
            data.linkedin?.funding_stage && { label: "Stage", value: data.linkedin.funding_stage, color: C.p },
            data.g2?.g2_score != null && { label: "G2 Score", value: `${data.g2.g2_score}/5`, color: C.g },
            data.g2?.review_count != null && { label: "Reviews", value: data.g2.review_count, color: C.y },
          ].filter(Boolean).map((s: any, i: number) => (
            <div key={i} style={{ background: C.card, padding: "14px 18px" }}>
              <p style={{ fontFamily: F.body, fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>{s.label}</p>
              <p style={{ fontFamily: F.mono, fontSize: 16, color: s.color, margin: 0, fontWeight: 600 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Key Features */}
        <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}` }}>
          <SectionTitle color={C.g} icon={<Zap size={14}/>}>Key Features</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
            {(w.key_features || []).map((f: string, i: number) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: C.bg3, borderRadius: 8, fontSize: 13, color: C.text }}>
                <Check size={12} style={{ color: C.g, flexShrink: 0 }} /> {f}
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        {s && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.g}` }}>
              <SectionTitle color={C.g} icon={<Lightbulb size={14}/>}>Top Opportunity</SectionTitle>
              <p style={{ color: C.text, lineHeight: 1.7, fontSize: 13, margin: 0 }}>{s.top_opportunity}</p>
            </div>
            <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.r}` }}>
              <SectionTitle color={C.r} icon={<AlertTriangle size={14}/>}>Biggest Risk</SectionTitle>
              <p style={{ color: C.text, lineHeight: 1.7, fontSize: 13, margin: 0 }}>{s.biggest_risk}</p>
            </div>
          </div>
        )}

        {/* Scores */}
        {s?.ratings && (
          <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}` }}>
            <SectionTitle color={C.p} icon={<BarChart3 size={14}/>}>Intelligence Scores</SectionTitle>
            <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 14, padding: "8px 0" }}>
              {Object.entries(s.ratings).map(([k, v]) => (
                <ScoreRing key={k} score={v as number} label={k.replace(/_/g, " ")} />
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        {s?.recommendation && (
          <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}` }}>
            <SectionTitle color={C.b} icon={<Target size={14}/>}>Recommendation</SectionTitle>
            <p style={{ color: C.text, lineHeight: 1.75, fontSize: 14, margin: 0 }}>{s.recommendation}</p>
          </div>
        )}

        {/* Sources */}
        {w.sources?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {w.sources.slice(0, 6).map((src: string, i: number) => {
              try { return (
                <a key={i} href={src} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: F.mono, fontSize: 10, color: C.textDim, textDecoration: "none",
                  border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 8px",
                  display: "flex", alignItems: "center", gap: 4, transition: "color 0.15s",
                }}>
                  <ExternalLink size={8}/> {new URL(src).hostname.replace('www.','')}
                </a>
              ); } catch { return null; }
            })}
          </div>
        )}
      </div>
    );
  };

  const renderSources = () => {
    const sources = [
      { key: "twitter", label: "X / Twitter", icon: <Hash size={14}/>, color: C.b, fields: ["mention_volume","sentiment","notable_thread"], lists: { "Top Hashtags": "top_hashtags", "Pain Points": "pain_points", "Praise Points": "praise_points", "Influencers": "influencers" } },
      { key: "reddit", label: "Reddit", icon: <MessageSquare size={14}/>, color: C.r, fields: ["overall_sentiment","hot_thread_summary"], lists: { "Top Subreddits": "top_subreddits", "Complaints": "common_complaints", "Praise": "common_praise" } },
      { key: "producthunt", label: "Product Hunt", icon: <MousePointerClick size={14}/>, color: C.y, fields: ["launched","upvotes","rank","launch_year"], lists: { "Hunter Comments": "hunter_comments", "Alternatives": "alternatives_on_ph" } },
      { key: "g2", label: "G2 Reviews", icon: <Star size={14}/>, color: C.g, fields: ["g2_score","review_count","nps_estimate"], lists: { "Top Pros": "top_pros", "Top Cons": "top_cons", "Comparisons": "competitor_comparisons" } },
      { key: "linkedin", label: "LinkedIn Intel", icon: <Briefcase size={14}/>, color: C.b, fields: ["employee_count","growth_rate","funding_stage","headquarters"], lists: { "Key Hires": "key_hires", "Tech Stack": "tech_stack_signals", "Investors": "investors" } },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sources.map(s => {
          const d = data?.[s.key];
          if (!d) return (
            <div key={s.key} style={{ background: C.bg2, borderRadius: 10, padding: "16px 20px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10, color: C.textDim, fontSize: 13 }}>
              <span style={{ color: s.color, opacity: 0.4 }}>{s.icon}</span> {s.label}: No data collected
            </div>
          );
          return (
            <div key={s.key} style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}`, borderLeft: `3px solid ${s.color}` }}>
              <SectionTitle color={s.color} icon={s.icon}>{s.label}</SectionTitle>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                {s.fields.map(f => d[f] != null && (
                  <div key={f} style={{ padding: "8px 14px", background: C.bg3, borderRadius: 8 }}>
                    <span style={{ fontFamily: F.body, fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1 }}>{f.replace(/_/g, " ")}</span>
                    <p style={{ fontFamily: F.mono, fontSize: 13, color: C.text, margin: "3px 0 0", fontWeight: 600 }}>{String(d[f])}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                {Object.entries(s.lists).map(([label, field]) => {
                  const items = d[field as string];
                  if (!items || !Array.isArray(items) || !items.length) return null;
                  return (
                    <div key={label} style={{ padding: "12px 14px", background: C.bg3, borderRadius: 10 }}>
                      <p style={{ fontFamily: F.body, fontSize: 11, color: C.textDim, fontWeight: 600, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</p>
                      {items.map((item: any, i: number) => <ListItem key={i} color={s.color}>{typeof item === 'object' && item !== null ? (item.name ? `${item.name}${item.upvotes ? ` (${item.upvotes} upvotes)` : ''}${item.price ? `  ${item.price}` : ''}` : JSON.stringify(item)) : String(item)}</ListItem>)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderICP = () => {
    const icp = data?.icp;
    if (!icp) return <EmptyState text="No ICP data available" />;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
          <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}` }}>
            <SectionTitle color={C.p} icon={<Users size={14}/>}>Ideal Customer Persona</SectionTitle>
            <p style={{ color: C.text, lineHeight: 1.75, fontSize: 14, margin: "0 0 14px" }}>{icp.persona}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {icp.company_size && <div style={{ padding: "8px 14px", background: C.bg3, borderRadius: 8 }}>
                <span style={{ fontFamily: F.body, fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1 }}>Company Size</span>
                <p style={{ fontFamily: F.mono, fontSize: 13, color: C.text, margin: "3px 0 0", fontWeight: 600 }}>{icp.company_size}</p>
              </div>}
              {icp.budget_range && <div style={{ padding: "8px 14px", background: C.bg3, borderRadius: 8 }}>
                <span style={{ fontFamily: F.body, fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1 }}>Budget</span>
                <p style={{ fontFamily: F.mono, fontSize: 13, color: C.text, margin: "3px 0 0", fontWeight: 600 }}>{icp.budget_range}</p>
              </div>}
              {icp.deal_cycle && <div style={{ padding: "8px 14px", background: C.bg3, borderRadius: 8 }}>
                <span style={{ fontFamily: F.body, fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1 }}>Deal Cycle</span>
                <p style={{ fontFamily: F.mono, fontSize: 13, color: C.text, margin: "3px 0 0", fontWeight: 600 }}>{icp.deal_cycle}</p>
              </div>}
            </div>
          </div>
          <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ScoreRing score={icp.wtp_score} label="Willingness to Pay" size={100} color={C.g} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { t: "Industries", d: icp.industries, c: C.b },
            { t: "Job Titles", d: icp.job_titles, c: C.p },
            { t: "Geography", d: icp.geography, c: C.y },
          ].map(s => (
            <div key={s.t} style={{ background: C.bg2, borderRadius: 12, padding: "18px 20px", border: `1px solid ${C.border}` }}>
              <p style={{ fontFamily: F.body, fontSize: 11, color: C.textDim, fontWeight: 600, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.5 }}>{s.t}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {(s.d||[]).map((i:string,idx:number) => <Tag key={idx} color={s.c}>{i}</Tag>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { t: "Pain Points", d: icp.pain_points, c: C.r },
            { t: "Buying Triggers", d: icp.buying_triggers, c: C.g },
            { t: "Tech Stack", d: icp.tech_stack, c: C.b },
          ].map(s => (
            <div key={s.t} style={{ background: C.bg2, borderRadius: 12, padding: "18px 20px", border: `1px solid ${C.border}` }}>
              <p style={{ fontFamily: F.body, fontSize: 11, color: C.textDim, fontWeight: 600, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.5 }}>{s.t}</p>
              {(s.d||[]).map((i:string,idx:number) => <ListItem key={idx} color={s.c}>{i}</ListItem>)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMarket = () => {
    const m = data?.market;
    if (!m) return <EmptyState text="No market data available" />;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: C.border, borderRadius: 10, overflow: "hidden" }}>
          {[
            { l: "Total Addressable Market", s: "TAM", v: m.tam, c: C.g },
            { l: "Serviceable Addressable Market", s: "SAM", v: m.sam, c: C.b },
            { l: "Serviceable Obtainable Market", s: "SOM", v: m.som, c: C.p },
          ].map(i => (
            <div key={i.s} style={{ background: C.card, textAlign: "center", padding: "24px 20px" }}>
              <p style={{ fontFamily: F.body, fontSize: 10, color: C.textDim, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>{i.l}</p>
              <p style={{ fontFamily: F.display, fontSize: 14, color: C.textDim, letterSpacing: 2, margin: "4px 0" }}>{i.s}</p>
              <p style={{ fontFamily: F.mono, fontSize: 24, color: i.c, margin: "6px 0 0", fontWeight: 700 }}>{i.v}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}` }}>
            <SectionTitle color={C.g} icon={<BarChart3 size={14}/>}>Growth Metrics</SectionTitle>
            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "8px 0" }}>
              <ScoreRing score={m.score} label="Market Score" size={90} />
              <div>
                <p style={{ fontFamily: F.body, fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>CAGR</p>
                <p style={{ fontFamily: F.mono, fontSize: 20, color: C.g, margin: "4px 0 8px", fontWeight: 700 }}>{m.cagr}</p>
                <Tag color={m.stage==="emerging"?C.g:m.stage==="growing"?C.b:m.stage==="mature"?C.y:C.r}>{m.stage}</Tag>
              </div>
            </div>
          </div>
          <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}` }}>
            <SectionTitle color={C.b} icon={<FileText size={14}/>}>Market Summary</SectionTitle>
            <p style={{ color: C.text, lineHeight: 1.75, fontSize: 13, margin: 0 }}>{m.summary}</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}` }}>
            <SectionTitle color={C.g} icon={<TrendingUp size={14}/>}>Key Trends</SectionTitle>
            {(m.trends||[]).map((t:string,i:number) => <ListItem key={i} color={C.g} icon={<ArrowUpRight size={12}/>}>{t}</ListItem>)}
          </div>
          <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}` }}>
            <SectionTitle color={C.r} icon={<AlertTriangle size={14}/>}>Market Risks</SectionTitle>
            {(m.risks||[]).map((r:string,i:number) => <ListItem key={i} color={C.r}>{r}</ListItem>)}
          </div>
        </div>
      </div>
    );
  };

  const renderCompetition = () => {
    const comp = data?.competition;
    if (!comp) return <EmptyState text="No competition data available" />;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}` }}>
          <SectionTitle color={C.r} icon={<Swords size={14}/>}>Competitive Landscape</SectionTitle>
          {(comp.competitors||[]).map((c:any,i:number) => (
            <div key={i} style={{ padding: "16px 0", borderBottom: i < (comp.competitors.length-1) ? `1px solid ${C.border}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textDim }}>{i+1}.</span>
                <span style={{ fontFamily: F.body, fontSize: 15, color: C.text, fontWeight: 600 }}>{c.name}</span>
                {c.funding && c.funding !== "Unknown" && <span style={{ fontFamily: F.mono, fontSize: 11, color: C.textDim }}>{c.funding}</span>}
                <div style={{ marginLeft: "auto", fontFamily: F.mono, fontSize: 15, fontWeight: 700, color: c.score >= 7 ? C.g : c.score >= 4 ? C.y : C.r }}>{c.score}<span style={{ fontSize: 10, color: C.textDim }}>/10</span></div>
              </div>
              <div style={{ height: 3, background: C.bg3, borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(c.score/10)*100}%`, background: c.score >= 7 ? C.g : c.score >= 4 ? C.y : C.r, borderRadius: 2, transition: "width 0.8s ease" }} />
              </div>
              <p style={{ fontSize: 13, color: C.textMid, margin: "0 0 8px", lineHeight: 1.6 }}>{c.description}</p>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  {(c.strengths||[]).map((s:string, si:number) => (
                    <div key={si} style={{ fontSize: 12, color: C.g, padding: "2px 0", display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <Check size={10} style={{ marginTop: 3, flexShrink: 0 }}/> {s}
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1 }}>
                  {(c.weaknesses||[]).map((w:string, wi:number) => (
                    <div key={wi} style={{ fontSize: 12, color: C.r, padding: "2px 0", display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <X size={10} style={{ marginTop: 3, flexShrink: 0 }}/> {w}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ScoreRing score={comp.threat_score} label="Threat Level" size={90} color={C.r} />
          </div>
          <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}` }}>
            <SectionTitle color={C.g} icon={<Lightbulb size={14}/>}>Market Gap</SectionTitle>
            <p style={{ color: C.text, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{comp.gap}</p>
          </div>
          <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}` }}>
            <SectionTitle color={C.b} icon={<Target size={14}/>}>Positioning</SectionTitle>
            <p style={{ color: C.text, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{comp.positioning}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderSWOT = () => {
    const sw = data?.synthesis?.swot;
    if (!sw) return <EmptyState text="No SWOT data available" />;
    const quads = [
      { t: "Strengths", items: sw.strengths, c: C.g },
      { t: "Weaknesses", items: sw.weaknesses, c: C.r },
      { t: "Opportunities", items: sw.opportunities, c: C.b },
      { t: "Threats", items: sw.threats, c: C.y },
    ];
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {quads.map(q => (
          <div key={q.t} style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}`, borderTop: `3px solid ${q.c}` }}>
            <p style={{ fontFamily: F.body, fontSize: 13, color: q.c, fontWeight: 600, margin: "0 0 12px" }}>{q.t}</p>
            {(q.items||[]).map((item:string, i:number) => <ListItem key={i} color={q.c}>{item}</ListItem>)}
          </div>
        ))}
      </div>
    );
  };

  const renderPricing = () => {
    const ps = data?.synthesis?.pricing_strategy;
    if (!ps) return <EmptyState text="No pricing data available" />;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}` }}>
          <SectionTitle color={C.g} icon={<DollarSign size={14}/>}>Pricing Strategy</SectionTitle>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Tag color={C.b}>{ps.model}</Tag>
            {ps.freemium && <Tag color={C.g}>Freemium</Tag>}
          </div>
          {ps.rationale && <p style={{ color: C.text, lineHeight: 1.75, fontSize: 14, margin: 0 }}>{ps.rationale}</p>}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {(ps.tiers||[]).map((tier:any, i:number) => {
            const tc = i === 0 ? C.textMid : i === 1 ? C.g : C.y;
            return (
            <div key={i} style={{ background: C.bg2, borderRadius: 12, padding: "24px 20px", border: `1px solid ${C.border}`, borderTop: `3px solid ${tc}`, textAlign: "center" }}>
              {i === 1 && <span style={{ fontFamily: F.mono, fontSize: 9, color: C.g, background: C.g + "14", padding: "2px 8px", borderRadius: 4, letterSpacing: 1 }}>POPULAR</span>}
              <h3 style={{ fontFamily: F.body, fontSize: 16, color: C.text, margin: "8px 0", fontWeight: 600 }}>{tier.name}</h3>
              <p style={{ fontFamily: F.mono, fontSize: 22, color: tc, margin: "8px 0 16px", fontWeight: 700 }}>{tier.price}</p>
              <div style={{ height: 1, background: C.border, margin: "0 0 12px" }} />
              {(tier.features||[]).map((f:string,fi:number) => (
                <div key={fi} style={{ fontSize: 12, color: C.textMid, padding: "5px 0", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                  <Check size={11} style={{ color: tc }} /> {f}
                </div>
              ))}
            </div>
          );})}
        </div>
      </div>
    );
  };

  const renderGTM = () => {
    const g = data?.synthesis?.gtm;
    if (!g) return <EmptyState text="No GTM data available" />;
    const phases = [
      { l: "Phase 1  Launch", v: g.phase1, c: C.g },
      { l: "Phase 2  Scale", v: g.phase2, c: C.b },
      { l: "Phase 3  Expand", v: g.phase3, c: C.p },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {phases.map((p, i) => (
            <div key={p.l} style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}`, borderTop: `3px solid ${p.c}` }}>
              <p style={{ fontFamily: F.body, fontSize: 13, color: p.c, fontWeight: 600, margin: "0 0 10px" }}>{p.l}</p>
              <p style={{ color: C.text, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{p.v}</p>
            </div>
          ))}
        </div>
        <div style={{ background: C.bg2, borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}` }}>
          <SectionTitle color={C.b} icon={<Megaphone size={14}/>}>Channels</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(g.channels||[]).map((c:string,i:number) => <Tag key={i} color={C.b}>{c}</Tag>)}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: C.border, borderRadius: 10, overflow: "hidden" }}>
          {[
            { l: "CAC", v: g.cac_estimate, c: C.r },
            { l: "LTV", v: g.ltv_estimate, c: C.g },
            { l: "Payback", v: g.payback_period, c: C.y },
            { l: "North Star", v: g.north_star_metric, c: C.b },
          ].map(m => (
            <div key={m.l} style={{ background: C.card, padding: "16px 18px", textAlign: "center" }}>
              <p style={{ fontFamily: F.body, fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 6px" }}>{m.l}</p>
              <p style={{ fontFamily: F.mono, fontSize: 16, color: m.c, margin: 0, fontWeight: 700 }}>{m.v}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderChat = () => {
    const quickPrompts = [
      "What's the strongest competitive advantage?",
      "Is the pricing strategy optimal?",
      "Summarize the top 3 risks",
      "What would you change about the GTM?",
      "Rate this opportunity 1-10 and explain",
    ];
    return (
      <GlowCard color={C.p} style={{ display: "flex", flexDirection: "column", height: 540 }}>
        <SectionTitle color={C.p} icon={<MessageSquare size={16}/>}>ASK AI ANALYST</SectionTitle>
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {chatMessages.length === 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 16, padding: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: C.p + "14", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.p}22` }}>
                <Brain size={24} style={{ color: C.p }} />
              </div>
              <p style={{ color: C.textMid, fontSize: 14, textAlign: "center", maxWidth: 300 }}>
                Ask anything about the research data  I have full context on all findings
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 500 }}>
                {quickPrompts.map(p => (
                  <button key={p} onClick={() => setChatInput(p)} style={{
                    background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 20, padding: "8px 16px",
                    color: C.p, fontSize: 12, fontFamily: F.body, cursor: "pointer", transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { (e.target as any).style.borderColor = C.p + "44"; (e.target as any).style.background = C.p + "0a"; }}
                    onMouseLeave={e => { (e.target as any).style.borderColor = C.border; (e.target as any).style.background = C.bg3; }}
                  >{p}</button>
                ))}
              </div>
            </div>
          )}
          {chatMessages.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%",
              background: m.role === "user" ? C.p + "14" : C.bg3,
              border: `1px solid ${m.role === "user" ? C.p + "22" : C.border}`,
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              padding: "12px 16px", color: C.text, fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap",
              animation: "fadeUp 0.3s ease",
            }}>
              {m.role === "assistant" && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: F.mono, fontSize: 10, color: C.p, marginBottom: 6, letterSpacing: 1 }}>
                  <Brain size={10}/> AI ANALYST
                </div>
              )}
              {m.content}
            </div>
          ))}
          {chatLoading && (
            <div style={{ alignSelf: "flex-start", padding: "12px 16px", background: C.bg3, borderRadius: "16px 16px 16px 4px", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.p, animation: `dotPulse 1.4s ${i * 0.2}s infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()}
            placeholder="Ask about the research..."
            style={{ flex: 1, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px", color: C.text, fontFamily: F.body, fontSize: 13, outline: "none", transition: "border-color 0.2s" }}
            onFocus={e => (e.target as any).style.borderColor = C.p + "44"}
            onBlur={e => (e.target as any).style.borderColor = C.border}
          />
          <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} style={{
            background: chatInput.trim() ? C.p : C.bg3, color: chatInput.trim() ? C.bg : C.textDim,
            border: "none", borderRadius: 12, padding: "12px 18px", cursor: chatInput.trim() ? "pointer" : "default",
            transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
          }}>
            <Send size={16} />
          </button>
        </div>
      </GlowCard>
    );
  };

  const renderFullReport = () => {
    if (!data) return <EmptyState text="No data available" />;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <ActionButton onClick={exportPDF} icon={<Download size={14}/>} label="Export PDF" color={C.g} />
          <ActionButton onClick={exportHTML} icon={<Download size={14}/>} label="Export HTML" color={C.b} />
        </div>
        {renderOverview()}
        <Divider />
        {renderSources()}
        <Divider />
        {renderICP()}
        <Divider />
        {renderMarket()}
        <Divider />
        {renderCompetition()}
        <Divider />
        {renderSWOT()}
        <Divider />
        {renderPricing()}
        <Divider />
        {renderGTM()}
        {data.synthesis?.ratings && (
          <>
            <Divider />
            <GlowCard color={C.g}>
              <SectionTitle color={C.g} icon={<Award size={16}/>}>ALL INTELLIGENCE SCORES</SectionTitle>
              <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 20, padding: "12px 0" }}>
                {Object.entries(data.synthesis.ratings).map(([k, v]) => <ScoreRing key={k} score={v as number} label={k.replace(/_/g, " ")} />)}
                {data.synthesis.viability != null && <ScoreRing score={data.synthesis.viability} label="Viability" color={C.g} />}
                {data.market?.score != null && <ScoreRing score={data.market.score} label="Market" color={C.b} />}
                {data.competition?.threat_score != null && <ScoreRing score={data.competition.threat_score} label="Threat" color={C.r} />}
              </div>
            </GlowCard>
          </>
        )}
      </div>
    );
  };

  const tabContent: Record<TabName, () => React.ReactNode> = {
    Overview: renderOverview, Sources: renderSources, ICP: renderICP, Market: renderMarket,
    Competition: renderCompetition, SWOT: renderSWOT, Pricing: renderPricing, GTM: renderGTM,
    "Ask AI": renderChat, "Full Report": renderFullReport,
  };

  // ═══════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: F.body }}>
      <style>{globalCSS}</style>

      {/* Subtle noise texture */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0, opacity: 0.015, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: C.glass, backdropFilter: "blur(24px) saturate(1.2)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, gap: 12 }}>
          {/* Left: Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <img src="/favicon.svg" alt="SaaS Intel Logo" width={30} height={30} style={{ borderRadius: 8 }} />
            <span style={{ fontFamily: F.display, fontSize: 18, color: C.text, letterSpacing: 2 }}>SAAS INTEL</span>
            <span style={{ fontFamily: F.mono, fontSize: 9, color: C.textDim, background: C.bg3, padding: "2px 7px", borderRadius: 4, border: `1px solid ${C.border}`, letterSpacing: 1 }}>v1.0</span>
          </div>

          {/* Center: Nav Links (when report is loaded) */}
          {data && !isResearching && (
            <div style={{ display: "flex", alignItems: "center", gap: 2, background: C.bg2, borderRadius: 10, padding: 3, border: `1px solid ${C.border}`, overflow: "hidden" }}>
              {(["Overview", "Sources", "Market", "Competition"] as TabName[]).map(tab => {
                const isActive = activeTab === tab;
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    background: isActive ? C.g + "14" : "transparent",
                    border: "none", borderRadius: 7, padding: "5px 12px",
                    color: isActive ? C.g : C.textDim,
                    fontFamily: F.mono, fontSize: 10, cursor: "pointer",
                    transition: "all 0.2s", letterSpacing: 0.5, whiteSpace: "nowrap",
                  }}>
                    {tab}
                  </button>
                );
              })}
            </div>
          )}

          {/* Right: Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {savedReports.length > 0 && (
              <button onClick={() => setShowCompare(!showCompare)} style={{
                background: showCompare ? C.b + "14" : C.bg3,
                border: `1px solid ${showCompare ? C.b + "44" : C.border}`,
                borderRadius: 8, padding: "6px 12px", color: C.b, fontFamily: F.mono, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s",
              }}>
                <Layers size={12}/> ({savedReports.length})
              </button>
            )}
            {/* Provider Selector */}
            <div ref={providerRef} style={{ position: "relative" }}>
              <button onClick={() => setShowProviderMenu(!showProviderMenu)} style={{
                background: AI_PROVIDERS[provider].color + "10",
                border: `1px solid ${AI_PROVIDERS[provider].color}28`,
                borderRadius: 8, padding: "6px 12px", color: AI_PROVIDERS[provider].color,
                fontFamily: F.mono, fontSize: 10, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
              }}>
                {AI_PROVIDERS[provider].icon}
                {AI_PROVIDERS[provider].label}
                <ChevronDown size={10} style={{ transition: "transform 0.2s", transform: showProviderMenu ? "rotate(180deg)" : "rotate(0)" }} />
              </button>
              {showProviderMenu && (
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 200,
                  background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12,
                  padding: 6, minWidth: 180, animation: "fadeUp 0.2s ease",
                  boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
                }}>
                  {(Object.keys(AI_PROVIDERS) as AIProvider[]).map(p => (
                    <button key={p} onClick={() => { setProvider(p); setShowProviderMenu(false); }} style={{
                      width: "100%", background: provider === p ? AI_PROVIDERS[p].color + "14" : "transparent",
                      border: "none", borderRadius: 8, padding: "9px 14px",
                      color: provider === p ? AI_PROVIDERS[p].color : C.textMid,
                      fontFamily: F.mono, fontSize: 12, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 10, transition: "all 0.15s",
                    }}
                      onMouseEnter={e => { if (provider !== p) (e.currentTarget.style.background = AI_PROVIDERS[p].color + "0a"); }}
                      onMouseLeave={e => { if (provider !== p) (e.currentTarget.style.background = "transparent"); }}
                    >
                      <span style={{ color: AI_PROVIDERS[p].color }}>{AI_PROVIDERS[p].icon}</span>
                      {AI_PROVIDERS[p].label}
                      {provider === p && <Check size={12} style={{ marginLeft: "auto" }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Divider */}
            <div style={{ width: 1, height: 24, background: C.border }} />
            {/* API Key Input */}
            <div style={{ position: "relative" }}>
              <Lock size={12} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: apiKey ? AI_PROVIDERS[provider].color + "88" : C.textDim }} />
              <input value={apiKey} onChange={e => handleApiKeyChange(e.target.value)} placeholder={AI_PROVIDERS[provider].placeholder}
                type={showApiKey ? "text" : "password"}
                style={{ width: 160, background: C.bg2, border: `1px solid ${apiKey ? AI_PROVIDERS[provider].color + "28" : C.border}`, borderRadius: 8, padding: "6px 30px 6px 28px", color: C.text, fontFamily: F.mono, fontSize: 10, outline: "none", transition: "border-color 0.2s" }} />
              <button onClick={() => setShowApiKey(!showApiKey)} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.textDim, cursor: "pointer", padding: 2 }}>
                <Eye size={12} />
              </button>
            </div>
            {/* Provider Status Indicator */}
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "4px 10px", borderRadius: 20,
              background: AI_PROVIDERS[effectiveProvider].color + "12",
              border: `1px solid ${AI_PROVIDERS[effectiveProvider].color}22`,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: effectiveApiKey ? C.g : C.r, boxShadow: effectiveApiKey ? `0 0 6px ${C.g}88` : "none" }} />
              <span style={{ color: AI_PROVIDERS[effectiveProvider].color, fontSize: 10, fontFamily: F.mono }}>
                {AI_PROVIDERS[effectiveProvider].label}
              </span>
              {!apiKey && effectiveApiKey && (
                <span style={{ fontSize: 9, color: C.textDim, fontFamily: F.mono }}>(default)</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* COMPARE PANEL */}
      {showCompare && (
        <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border}`, padding: "20px 28px", animation: "fadeUp 0.3s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Layers size={18} style={{ color: C.b }} />
              <span style={{ fontFamily: F.display, fontSize: 20, color: C.b, letterSpacing: 2 }}>SAVED REPORTS</span>
            </div>
            <button onClick={() => setShowCompare(false)} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim, cursor: "pointer" }}><X size={14}/></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {savedReports.map((r, i) => (
              <GlowCard key={i} color={r.synthesis?.verdict ? verdictColor(r.synthesis.verdict) : C.b}>
                <p style={{ fontFamily: F.display, fontSize: 20, color: C.b, margin: "0 0 4px", letterSpacing: 1 }}>{r.query.toUpperCase()}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: F.mono, fontSize: 10, color: C.textDim, margin: "0 0 10px" }}>
                  <Clock size={10} />
                  {new Date(r.savedAt).toLocaleDateString()}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                  {r.synthesis?.verdict && <Tag color={verdictColor(r.synthesis.verdict)} size="md">{r.synthesis.verdict}</Tag>}
                  {r.synthesis?.viability != null && <span style={{ fontFamily: F.mono, fontSize: 13, color: C.g }}>{r.synthesis.viability}/10</span>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => loadReport(r)} style={{ flex: 1, background: C.g + "14", border: `1px solid ${C.g}22`, borderRadius: 8, padding: "6px 0", color: C.g, fontSize: 11, fontFamily: F.mono, cursor: "pointer", transition: "all 0.2s" }}>Load</button>
                  <button onClick={() => deleteReport(i)} style={{ background: C.r + "14", border: `1px solid ${C.r}22`, borderRadius: 8, padding: "6px 12px", color: C.r, fontSize: 11, fontFamily: F.mono, cursor: "pointer" }}>
                    <Trash2 size={12}/>
                  </button>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "36px 24px", position: "relative", zIndex: 1 }}>
        {/* HERO / SEARCH */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <p style={{ fontFamily: F.mono, fontSize: 11, color: C.textDim, letterSpacing: 3, marginBottom: 20, textTransform: "uppercase" }}>
            Competitive intelligence in seconds
          </p>
          <h1 className="si-hero-title" style={{
            fontFamily: F.display, color: C.text, letterSpacing: 4, margin: "0 0 14px",
            lineHeight: 1.05,
          }}>
            RESEARCH ANY <span style={{ color: C.g }}>SAAS</span> PRODUCT
          </h1>
          <p style={{ color: C.textMid, fontSize: 14, margin: "0 0 36px", lineHeight: 1.7, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            10-step analysis pipeline covering market sizing, competition, pricing strategy, and go-to-market planning.
          </p>

          {/* Search Bar */}
          <div className="si-search-bar" style={{ display: "flex", gap: 8, maxWidth: 580, margin: "0 auto", position: "relative" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: C.textDim }} />
              <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && !isResearching && runResearch()}
                placeholder="e.g. Notion, Linear, Figma..."
                style={{
                  width: "100%", background: C.bg2, border: `1px solid ${query ? C.g + "33" : C.border}`,
                  borderRadius: 10, padding: "14px 16px 14px 42px", color: C.text, fontFamily: F.body, fontSize: 14,
                  outline: "none", transition: "border-color 0.2s",
                }} />
            </div>
            <button onClick={runResearch} disabled={isResearching}
              style={{
                background: isResearching ? C.bg3 : C.g,
                color: isResearching ? C.textDim : C.bg, border: "none", borderRadius: 10, padding: "14px 24px",
                fontFamily: F.display, fontSize: 16, letterSpacing: 2, cursor: isResearching ? "default" : "pointer",
                display: "flex", alignItems: "center", gap: 8,
                transition: "all 0.2s",
              }}>
              {isResearching ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> SCANNING</> : <><Search size={16}/> RESEARCH</>}
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14,
              color: C.r, fontSize: 13, fontFamily: F.mono, animation: "fadeUp 0.3s ease",
              background: C.r + "11", border: `1px solid ${C.r}33`, borderRadius: 10, padding: "10px 20px",
              maxWidth: 500, margin: "14px auto 0",
            }}>
              <AlertTriangle size={14}/> {errorMsg}
            </div>
          )}

          {/* Quick Start Examples */}
          {!data && !isResearching && (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
              {EXAMPLES.map(ex => (
                <button key={ex.label} onClick={() => setQuery(ex.label)} style={{
                  background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 14px",
                  color: C.textDim, fontSize: 12, fontFamily: F.body, cursor: "pointer", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 6,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderLight; e.currentTarget.style.color = C.textMid; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}
                >{ex.label}</button>
              ))}
            </div>
          )}

          {/* API Key Hint */}
          {!effectiveApiKey && !isResearching && !data && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: C.textDim, fontSize: 12, marginTop: 18, fontFamily: F.mono }}>
              <Lock size={11}/> Enter your API key in the header to get started
            </div>
          )}
          {!apiKey && effectiveApiKey && !isResearching && !data && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: C.g, fontSize: 12, marginTop: 18, fontFamily: F.mono, opacity: 0.7 }}>
              <Zap size={11}/> Using default Groq API  or enter your own key for a different provider
            </div>
          )}
        </div>

        {/* RESEARCH PROGRESS */}
        {isResearching && (
          <GlowCard color={C.g} style={{ marginBottom: 28, animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
              <SectionTitle color={C.g} icon={<Loader2 size={16} style={{ animation: "spin 1s linear infinite" }}/>}>RESEARCH IN PROGRESS</SectionTitle>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Clock size={12} style={{ color: C.textDim }} />
                  <span style={{ fontFamily: F.mono, fontSize: 12, color: C.textMid }}>{formatTime(elapsedTime)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontFamily: F.mono, fontSize: 11, color: C.g }}>{successCount}</span>
                  <Check size={10} style={{ color: C.g }} />
                  {failCount > 0 && <>
                    <span style={{ fontFamily: F.mono, fontSize: 11, color: C.r, marginLeft: 6 }}>{failCount}</span>
                    <X size={10} style={{ color: C.r }} />
                  </>}
                </div>
                <span style={{ fontFamily: F.mono, fontSize: 14, color: C.g, fontWeight: 700 }}>{Math.round(progress)}%</span>
                <button onClick={cancelResearch} style={{
                  background: C.r + "14", border: `1px solid ${C.r}33`, borderRadius: 8,
                  padding: "5px 14px", color: C.r, fontFamily: F.mono, fontSize: 10,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                  transition: "all 0.2s", letterSpacing: 0.5,
                }}>
                  <X size={11}/> CANCEL
                </button>
              </div>
            </div>
            {/* Progress Bar */}
            <div style={{ height: 6, background: C.bg2, borderRadius: 3, marginBottom: 20, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${C.g}, ${C.b}, ${C.p})`, borderRadius: 3, transition: "width 0.5s ease", boxShadow: `0 0 12px ${C.g}33` }} />
            </div>
            {/* Step Timeline */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 16 }}>
              {STEPS.map((step, i) => {
                const isActive = i === currentStepIdx;
                const isDone = completedSteps[i];
                const isFailed = failedSteps[i];
                const isPending = i > currentStepIdx;
                return (
                  <div key={i} style={{
                    padding: "12px 8px", borderRadius: 12, textAlign: "center",
                    background: isActive ? step.color + "10" : isFailed ? C.r + "08" : C.bg2,
                    border: `1px solid ${isActive ? step.color + "44" : isDone ? C.g + "18" : isFailed ? C.r + "22" : C.border}`,
                    transition: "all 0.3s",
                    opacity: isPending ? 0.35 : 1,
                  }}>
                    <div style={{ color: isActive ? step.color : isDone ? C.g : isFailed ? C.r : C.textDim, display: "flex", justifyContent: "center", marginBottom: 4 }}>
                      {isDone ? <CheckCircle2 size={16}/> : isFailed ? <AlertTriangle size={16}/> : isActive ? <RotateCw size={16} style={{ animation: "spin 2s linear infinite" }}/> : STEP_ICONS[i]}
                    </div>
                    <p style={{ fontFamily: F.mono, fontSize: 8, color: isActive ? step.color : isDone ? C.g : isFailed ? C.r : C.textDim, margin: "4px 0 0", letterSpacing: 0.5 }}>
                      {step.name}
                    </p>
                  </div>
                );
              })}
            </div>
            {/* Log */}
            <div style={{ maxHeight: 100, overflowY: "auto", background: C.bg2, borderRadius: 10, padding: 12, border: `1px solid ${C.border}` }}>
              {logs.map((l, i) => (
                <div key={i} style={{
                  fontFamily: F.mono, fontSize: 11, padding: "3px 0",
                  color: l.includes("failed") ? C.r : l.includes("complete") || l.includes("succeeded") ? C.g : l.includes("retrying") ? C.y : C.textDim,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  {l.includes("failed") ? <X size={10}/> : l.includes("complete") || l.includes("succeeded") ? <Check size={10}/> : l.includes("retrying") ? <RotateCw size={10}/> : <ChevronRight size={10}/>}
                  {l}
                </div>
              ))}
            </div>
          </GlowCard>
        )}

        {/* VERDICT BANNER */}
        {data?.synthesis && !isResearching && (
          <div style={{
            marginBottom: 28, padding: 28, borderRadius: 14,
            background: C.bg2,
            border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${verdictColor(data.synthesis.verdict)}`,
            animation: "fadeUp 0.4s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontFamily: F.mono, fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: 2, margin: "0 0 6px" }}>Verdict</p>
                <span style={{
                  fontFamily: F.display, fontSize: 56, color: verdictColor(data.synthesis.verdict),
                  lineHeight: 1, letterSpacing: 3,
                }}>
                  {data.synthesis.verdict}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{data.synthesis.executive_summary}</p>
                {data.synthesis.differentiator && (
                  <div style={{ marginTop: 10 }}>
                    <Tag color={C.p} size="md" icon={<Target size={10}/>}>{data.synthesis.differentiator}</Tag>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 18 }}>
                <ScoreRing score={data.synthesis.viability} label="Viability" size={75} color={C.g} />
                {data.synthesis.ratings?.market_fit != null && <ScoreRing score={data.synthesis.ratings.market_fit} label="Market Fit" size={75} color={C.b} />}
                {data.synthesis.ratings?.timing != null && <ScoreRing score={data.synthesis.ratings.timing} label="Timing" size={75} color={C.p} />}
              </div>
            </div>

            <Divider />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <ActionButton onClick={saveReport} icon={<Save size={14}/>} label="Save Report" color={C.g} />
              <ActionButton onClick={exportPDF} icon={<Download size={14}/>} label="Export PDF" color={C.g} />
              <ActionButton onClick={exportHTML} icon={<Download size={14}/>} label="Export HTML" color={C.b} />
              <ActionButton onClick={() => setShowEmailModal(true)} icon={<Mail size={14}/>} label="Email Summary" color={C.p} />
              {failedSteps.some(f => f) && (
                <ActionButton onClick={retryFailedSteps} icon={<RotateCw size={14}/>} label={`Retry ${failedSteps.filter(f=>f).length} Failed`} color={C.y} />
              )}
              {data?.provider && (
                <span style={{ marginLeft: "auto", fontFamily: F.mono, fontSize: 10, color: C.textDim, display: "flex", alignItems: "center", gap: 6 }}>
                  <Cpu size={10}/> Powered by {data.provider}
                </span>
              )}
            </div>
          </div>
        )}

        {/* EMAIL MODAL */}
        {showEmailModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }}
            onClick={() => setShowEmailModal(false)}>
            <div onClick={e => e.stopPropagation()} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, maxWidth: 520, width: "90%", animation: "fadeUp 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <SectionTitle color={C.p} icon={<Mail size={16}/>}>EMAIL SUMMARY</SectionTitle>
                <button onClick={() => setShowEmailModal(false)} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim, cursor: "pointer" }}><X size={16}/></button>
              </div>
              <pre style={{ background: C.bg3, borderRadius: 12, padding: 18, color: C.text, fontSize: 12, fontFamily: F.mono, whiteSpace: "pre-wrap", maxHeight: 320, overflowY: "auto", border: `1px solid ${C.border}`, lineHeight: 1.6 }}>{getEmailText()}</pre>
              <button onClick={() => { copyToClipboard(getEmailText()); setTimeout(() => setShowEmailModal(false), 800); }}
                style={{
                  marginTop: 14, width: "100%", background: copied ? C.g : `linear-gradient(135deg, ${C.p}, ${C.b})`,
                  color: C.bg, border: "none", borderRadius: 12, padding: "12px 0",
                  fontFamily: F.display, fontSize: 16, letterSpacing: 2, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.3s",
                }}>
                {copied ? <><Check size={16}/> COPIED</> : <><Copy size={16}/> COPY TO CLIPBOARD</>}
              </button>
            </div>
          </div>
        )}

        {/* TABS */}
        {data && !isResearching && (
          <>
            <div style={{
              display: "flex", gap: 2, overflowX: "auto", marginBottom: 20, paddingBottom: 4,
              borderBottom: `1px solid ${C.border}`,
            }}>
              {TABS.map(tab => {
                const isActive = activeTab === tab;
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{
                      background: "transparent",
                      border: "none",
                      borderBottom: `2px solid ${isActive ? C.g : "transparent"}`,
                      padding: "10px 14px",
                      color: isActive ? C.text : C.textDim,
                      fontFamily: F.body, fontSize: 12, fontWeight: isActive ? 600 : 400,
                      cursor: "pointer", whiteSpace: "nowrap",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = C.textMid; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = C.textDim; }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
            <div>{tabContent[activeTab]()}</div>
          </>
        )}

        {/* Empty State (when no data and not searching) */}
        {!data && !isResearching && (
          <div className="si-empty-grid" style={{ display: "grid", gap: 1, marginTop: 24, background: C.border, borderRadius: 14, overflow: "hidden", animation: "fadeUp 0.4s ease 0.2s both" }}>
            {[
              { icon: <Globe size={18}/>, title: "Web Intelligence", desc: "Pricing, features, funding, and tech stack", color: C.b },
              { icon: <Users size={18}/>, title: "Social Signals", desc: "Twitter, Reddit, Product Hunt, and G2 reviews", color: C.g },
              { icon: <TrendingUp size={18}/>, title: "Market Sizing", desc: "TAM/SAM/SOM with growth rate analysis", color: C.p },
              { icon: <Swords size={18}/>, title: "Competitive Intel", desc: "6-competitor deep dive with gap analysis", color: C.r },
              { icon: <Shield size={18}/>, title: "SWOT Analysis", desc: "Strengths, weaknesses, opportunities, threats", color: C.y },
              { icon: <Rocket size={18}/>, title: "GTM Strategy", desc: "Go-to-market plan with unit economics", color: C.b },
            ].map((item, i) => (
              <div key={i} style={{ background: C.card, padding: "20px 22px", display: "flex", alignItems: "flex-start", gap: 14, transition: "background 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = C.cardHover)}
                onMouseLeave={e => (e.currentTarget.style.background = C.card)}
              >
                <div style={{ color: item.color, flexShrink: 0, marginTop: 1 }}>{item.icon}</div>
                <div>
                  <h3 style={{ fontFamily: F.body, fontSize: 13, color: C.text, margin: "0 0 4px", fontWeight: 600 }}>{item.title}</h3>
                  <p style={{ color: C.textDim, fontSize: 12, lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.border}`, marginTop: 60, position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "36px 24px 32px" }}>

          {/* Top row: brand + provider icons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src="/favicon.svg" alt="logo" width={20} height={20} style={{ borderRadius: 5 }} />
              <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textDim, letterSpacing: 1 }}>
                SAAS INTEL v1.0  10-step research pipeline
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {(Object.keys(AI_PROVIDERS) as AIProvider[]).map(p => (
                <span key={p} style={{ fontFamily: F.mono, fontSize: 9, color: C.textDim, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: AI_PROVIDERS[p].color, opacity: 0.5 }}>{AI_PROVIDERS[p].icon}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)`, marginBottom: 24 }} />

          {/* Made by */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontFamily: F.body, fontSize: 12, color: C.textDim, margin: "0 0 6px" }}>
                Made by{" "}
                <a href="https://themvpguy.vercel.app/" target="_blank" rel="noopener noreferrer"
                  style={{ color: C.g, textDecoration: "none", fontWeight: 600 }}>
                  Muhammad Tanveer Abbas
                </a>
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                {/* X / Twitter */}
                <a href="https://x.com/m_tanveerabbas" target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 5, color: C.textDim, textDecoration: "none", fontSize: 11, fontFamily: F.mono, transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.textDim)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  @m_tanveerabbas
                </a>
                {/* LinkedIn */}
                <a href="https://linkedin.com/in/muhammadtanveerabbas" target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 5, color: C.textDim, textDecoration: "none", fontSize: 11, fontFamily: F.mono, transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.b)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.textDim)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  muhammadtanveerabbas
                </a>
                {/* GitHub */}
                <a href="https://github.com/muhammadtanveerabbas" target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 5, color: C.textDim, textDecoration: "none", fontSize: 11, fontFamily: F.mono, transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.textDim)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  muhammadtanveerabbas
                </a>
              </div>
            </div>

            {/* Repo link */}
            <a href="https://github.com/MuhammadTanveerAbbas/saas-intelligence-engine" target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 6, color: C.textDim, textDecoration: "none", fontSize: 11, fontFamily: F.mono, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 14px", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderLight; e.currentTarget.style.color = C.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              View Source
            </a>
          </div>

        </div>
      </footer>
    </div>
  );
};

// ═══════════════════════════════════════
// SMALL HELPER COMPONENTS
// ═══════════════════════════════════════
const QuickFact = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <span style={{ color: C.b, display: "flex", alignItems: "center" }}>{icon}</span>
    <span style={{ fontFamily: F.body, fontSize: 11, color: C.textDim }}>{label}:</span>
    <span style={{ fontFamily: F.mono, fontSize: 12, color: C.text }}>{value}</span>
  </div>
);

const MiniStat = ({ label, value, color, icon }: { label: string; value: string | number; color: string; icon?: React.ReactNode }) => (
  <div style={{ padding: "10px 14px", background: C.bg3, borderRadius: 10, border: `1px solid ${C.border}` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      {icon && <span style={{ color, opacity: 0.6 }}>{icon}</span>}
      <p style={{ fontFamily: F.body, fontSize: 9, color: C.textDim, textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>{label}</p>
    </div>
    <p style={{ fontFamily: F.mono, fontSize: 15, color, margin: "4px 0 0", fontWeight: 700 }}>{value}</p>
  </div>
);

const ActionButton = ({ onClick, icon, label, color }: { onClick: () => void; icon: React.ReactNode; label: string; color: string }) => (
  <button onClick={onClick} style={{
    background: color + "10", border: `1px solid ${color}22`, borderRadius: 10,
    padding: "9px 18px", color, fontFamily: F.mono, fontSize: 12, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s", letterSpacing: 0.5,
  }}
    onMouseEnter={e => { (e.target as any).style.background = color + "1a"; (e.target as any).style.borderColor = color + "44"; }}
    onMouseLeave={e => { (e.target as any).style.background = color + "10"; (e.target as any).style.borderColor = color + "22"; }}
  >{icon} {label}</button>
);

const EmptyState = ({ text }: { text: string }) => (
  <div style={{ textAlign: "center", padding: 48, color: C.textDim }}>
    <Search size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
    <p style={{ fontFamily: F.body, fontSize: 14 }}>{text}</p>
  </div>
);

export default SaaSIntelligenceEngine;
