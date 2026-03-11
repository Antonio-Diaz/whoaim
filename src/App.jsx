import { useState, useEffect, useRef, useCallback } from "react";
import { Github, Linkedin, Mail, Terminal } from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────

const CYAN        = "#00E5FF";
const GREEN       = "#4ade80";
const AMBER       = "#FFB300";
const MUTED       = "#4a5568";
const BG          = "#080c10";
const SURFACE     = "#0d1117";
const FONT        = "'JetBrains Mono', 'IBM Plex Mono', 'Fira Code', monospace";
const GLOW        = `0 0 8px #00E5FF55, 0 0 20px #00E5FF22`;
const GLOW_STRONG = `0 0 12px #00E5FF99, 0 0 30px #00E5FF44`;

// ─── Injected CSS ─────────────────────────────────────────────────────────────

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=IBM+Plex+Mono:wght@300;400;500;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body, #root {
      min-height: 100vh;
      background: ${BG};
      font-family: ${FONT};
      color: #c8d6e5;
    }

    /* CRT scanlines */
    body::after {
      content: '';
      position: fixed; inset: 0;
      background: repeating-linear-gradient(
        0deg, transparent, transparent 2px,
        rgba(0,0,0,0.13) 2px, rgba(0,0,0,0.13) 4px
      );
      pointer-events: none; z-index: 9999;
    }

    /* Vignette */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background: radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%);
      pointer-events: none; z-index: 9998;
    }

    @keyframes blink    { 0%,49%{opacity:1} 50%,100%{opacity:0} }
    @keyframes flicker  { 0%,97%,100%{opacity:1} 98%{opacity:.96} 99%{opacity:.99} }
    @keyframes boot-in  { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:none} }
    @keyframes pulse-glow {
      0%,100% { text-shadow: 0 0 8px #00E5FF55, 0 0 20px #00E5FF22; }
      50%      { text-shadow: 0 0 14px #00E5FFaa, 0 0 32px #00E5FF55; }
    }

    .terminal-root  { animation: flicker 12s infinite; }
    .boot-line      { animation: boot-in .28s ease both; }
    .blink-cursor   {
      display: inline-block; width: 9px; height: 1em;
      background: ${CYAN}; vertical-align: text-bottom;
      margin-left: 2px; animation: blink 1s step-end infinite;
      box-shadow: ${GLOW_STRONG};
    }

    .ln-accent  { color: ${CYAN};  text-shadow: ${GLOW}; }
    .ln-green   { color: ${GREEN}; text-shadow: 0 0 8px #4ade8055; }
    .ln-amber   { color: ${AMBER}; text-shadow: 0 0 8px #FFB30055; }
    .ln-dim     { color: #566474; }
    .ln-comment { color: ${MUTED}; font-style: italic; }
    .ln-output  { color: #a0b4c8; line-height: 1.65; }
    .ln-ascii   { color: ${CYAN}; text-shadow: ${GLOW}; animation: pulse-glow 4s ease-in-out infinite; }

    .prompt-user { color: ${GREEN}; text-shadow: 0 0 8px #4ade8055; }
    .prompt-host { color: ${GREEN}; text-shadow: 0 0 8px #4ade8055; }
    .prompt-path { color: ${CYAN};  text-shadow: ${GLOW}; }
    .prompt-dim  { color: #566474; }

    a {
      color: ${CYAN}; text-decoration: none; text-shadow: ${GLOW};
      transition: color .2s, text-shadow .2s;
    }
    a:hover { color: #fff; text-shadow: ${GLOW_STRONG}; }

    .input-field {
      background: transparent; border: none; outline: none;
      color: ${CYAN}; font-family: ${FONT}; font-size: 14px;
      caret-color: ${CYAN}; text-shadow: ${GLOW}; width: 100%;
    }
    .input-field::placeholder { color: #2a3a4a; }

    ::-webkit-scrollbar       { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #1a2535; border-radius: 2px; }

    @media (max-width: 640px) {
      .terminal-body { padding: 12px 14px 8px !important; }
      .input-bar     { padding: 10px 14px !important; }
    }
  `}</style>
);

// ─── Utilities ────────────────────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ─── Sub-components ───────────────────────────────────────────────────────────

const Cursor = () => <span className="blink-cursor" aria-hidden />;

const Prompt = ({ path = "~" }) => (
  <span className="select-none" style={{ fontFamily: FONT, whiteSpace: "nowrap" }}>
    <span className="prompt-user">visitor</span>
    <span className="prompt-dim">@</span>
    <span className="prompt-host">whoaim</span>
    <span className="prompt-dim">:</span>
    <span className="prompt-path">{path}</span>
    <span className="prompt-dim">$ </span>
  </span>
);

// ─── Typewriter Hook ──────────────────────────────────────────────────────────

function useTypewriter(lines, { charDelay = 20, lineDelay = 60, startDelay = 0 } = {}) {
  const [displayed, setDisplayed] = useState([]);
  const [done, setDone]           = useState(false);

  useEffect(() => {
    let cancelled = false;
    setDisplayed([]);
    setDone(false);

    (async () => {
      if (startDelay) await sleep(startDelay);
      for (let i = 0; i < lines.length; i++) {
        if (cancelled) return;
        const line = lines[i];
        if (line.instant) {
          setDisplayed(p => { const n = [...p]; n[i] = { ...line }; return n; });
          await sleep(lineDelay * 0.3);
        } else {
          for (let c = 0; c <= line.text.length; c++) {
            if (cancelled) return;
            setDisplayed(p => { const n = [...p]; n[i] = { ...line, text: line.text.slice(0, c) }; return n; });
            await sleep(charDelay + Math.random() * 12);
          }
          await sleep(lineDelay);
        }
      }
      if (!cancelled) setDone(true);
    })();

    return () => { cancelled = true; };
  }, [JSON.stringify(lines)]);

  return { displayed, done };
}

// ─── Line ────────────────────────────────────────────────────────────────────

const LINE_CLS = { accent: "ln-accent", green: "ln-green", amber: "ln-amber",
                   dim: "ln-dim", comment: "ln-comment", ascii: "ln-ascii" };

const Line = ({ text, type = "output", isLast, typingDone }) => (
  <div
    className={`boot-line ${LINE_CLS[type] ?? "ln-output"}`}
    style={{ fontFamily: FONT, fontSize: "14px", minHeight: "1.65em", whiteSpace: "pre-wrap" }}
  >
    {text}{isLast && !typingDone && <Cursor />}
  </div>
);

// ─── Block ────────────────────────────────────────────────────────────────────

const Block = ({ command, path = "~", lines, onDone }) => {
  const { displayed, done } = useTypewriter(lines);
  const calledRef = useRef(false);

  useEffect(() => {
    if (done && !calledRef.current) { calledRef.current = true; onDone?.(); }
  }, [done]);

  return (
    <div className="boot-line" style={{ marginBottom: "22px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "6px" }}>
        <Prompt path={path} />
        <span style={{ color: "#e2e8f0", fontWeight: 500, fontFamily: FONT }}>{command}</span>
      </div>
      <div>
        {displayed.map((line, i) => (
          <Line key={i} {...line} isLast={i === displayed.length - 1} typingDone={done} />
        ))}
      </div>
    </div>
  );
};

// ─── Section Definitions ──────────────────────────────────────────────────────

const SECTIONS = {
  whoami: {
    command: "whoami",
    path: "~",
    lines: [
      { text: "" },
      { text: "  ██╗    ██╗██╗  ██╗ ██████╗  █████╗ ██╗███╗   ███╗", type: "ascii", instant: true },
      { text: "  ██║    ██║██║  ██║██╔═══██╗██╔══██╗██║████╗ ████║", type: "ascii", instant: true },
      { text: "  ██║ █╗ ██║███████║██║   ██║███████║██║██╔████╔██║", type: "ascii", instant: true },
      { text: "  ██║███╗██║██╔══██║██║   ██║██╔══██║██║██║╚██╔╝██║", type: "ascii", instant: true },
      { text: "  ╚███╔███╔╝██║  ██║╚██████╔╝██║  ██║██║██║ ╚═╝ ██║", type: "ascii", instant: true },
      { text: "   ╚══╝╚══╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝", type: "ascii", instant: true },
      { text: "" },
      { text: "  Name     :  José Antonio Utrera Díaz", type: "green" },
      { text: "  Role     :  Senior Data Engineer", type: "green" },
      { text: "  Location :  Veracruz, MX  🌮", type: "green" },
      { text: "" },
      { text: "  Turning messy data into clean pipelines since 2019." },
      { text: "  I architect data systems that scale, breathe, and don't ping" },
      { text: "  you at 3am." },
      { text: "" },
      { text: "  Focus: batch + streaming ETL · data modeling · platform eng" },
      { text: "" },
      { text: "  [ session started — type 'help' to see available commands ]", type: "comment" },
    ],
  },

  skills: {
    command: "skills --list",
    path: "~",
    lines: [
      { text: "" },
      { text: "  Indexing skill matrix...", type: "dim", instant: true },
      { text: "" },
      { text: "  ┌─ LANGUAGES ─────────────────────────────────────────┐", type: "accent" },
      { text: "  │  Python  ·  SQL  ·  Bash  ·  Scala (basics)         │" },
      { text: "  └──────────────────────────────────────────────────────┘", type: "accent" },
      { text: "" },
      { text: "  ┌─ PROCESSING ─────────────────────────────────────────┐", type: "accent" },
      { text: "  │  Apache Spark  ·  Apache Kafka  ·  Flink             │" },
      { text: "  │  Pandas  ·  Polars  ·  Apache Arrow                  │" },
      { text: "  └──────────────────────────────────────────────────────┘", type: "accent" },
      { text: "" },
      { text: "  ┌─ ORCHESTRATION & TRANSFORM ─────────────────────────┐", type: "accent" },
      { text: "  │  Apache Airflow  ·  dbt  ·  Prefect  ·  Dagster      │" },
      { text: "  └──────────────────────────────────────────────────────┘", type: "accent" },
      { text: "" },
      { text: "  ┌─ STORAGE & WAREHOUSES ──────────────────────────────┐", type: "accent" },
      { text: "  │  Snowflake  ·  Redshift  ·  Delta Lake               │" },
      { text: "  │  PostgreSQL  ·  Redis  ·  Elasticsearch              │" },
      { text: "  └──────────────────────────────────────────────────────┘", type: "accent" },
      { text: "" },
      { text: "  ┌─ CLOUD & INFRA ─────────────────────────────────────┐", type: "accent" },
      { text: "  │  GCP  ·  AWS  ·  Terraform  ·  Docker  ·  k8s        │" },
      { text: "  │  GitHub Actions  ·  dbt Cloud                        │" },
      { text: "  └──────────────────────────────────────────────────────┘", type: "accent" },
      { text: "" },
      { text: "  status: all systems nominal ✓", type: "green" },
    ],
  },

  experience: {
    command: "cat experience.log",
    path: "~",
    lines: [
      { text: "" },
      { text: "  [INFO] Loading career history...", type: "dim", instant: true },
      { text: "" },
      { text: "  2023-01 → present  ────────────────────────────────────────", type: "accent" },
      { text: "  Senior Data Engineer  @  Rappicard MX, Remote", type: "green" },
      { text: "  ▸ Architected and maintained high-throughput ETL pipelines" },
      { text: "    processing transactional and behavioral data at scale using" },
      { text: "    PySpark and Airflow", type: "dim" },
      { text: "  ▸ Led data modeling initiatives to improve warehouse structure," },
      { text: "    query performance, and cross-team data reliability", type: "dim" },
      { text: "  ▸ Mentored data engineers and established standards for pipeline" },
      { text: "    development, testing, and documentation", type: "dim" },
      { text: "  ▸ Collaborated with product and analytics teams to translate" },
      { text: "    business requirements into robust data solutions", type: "dim" },
      { text: "" },
      { text: "  2021-03 → 2022-12  ────────────────────────────────────────", type: "accent" },
      { text: "  Analyst Data Engineer  @  Kimetrics, Remote", type: "green" },
      { text: "  ▸ Managed and maintained data in a retail data center, ensuring accuracy and integrity" },
      { text: "  ▸ Extracted, transformed, and loaded data using ETL processes to support data-driven initiatives" },
      { text: "  ▸ Developed and executed SQL queries and scripts to perform data analysis and generate reports" },
      { text: "  ▸ Collaborated with cross-functional teams to understand data requirements and provide technical solutions" },
      { text: "  ▸ Conducted data quality checks and implemented data cleansing techniques to improve data accuracy" },
      { text: "  ▸ Participated in the development and maintenance of data pipelines and workflows" },
      { text: "" },
      { text: "  2019-07 → 2021-02  ────────────────────────────────────────", type: "accent" },
      { text: "  Software Engineer  →  Data Engineer  @  GoNet, Remote", type: "green" },
      { text: "  ▸ Developed and maintained software applications, contributing to both backend and data engineering tasks" },
      { text: "  ▸ Built and optimized data pipelines to support analytics and reporting needs" },
      { text: "  ▸ Collaborated with cross-functional teams to gather requirements and deliver technical solutions" },
      { text: "  ▸ Implemented data processing workflows using Python and SQL, ensuring data quality and reliability" },
      { text: "" },
      { text: "  [EOF] experience.log — 3 entries parsed successfully", type: "dim" },
    ],
  },

  contact: {
    command: "ping contact --verbose",
    path: "~",
    lines: [
      { text: "" },
      { text: "  Initializing network probes...", type: "dim", instant: true },
      { text: "" },
      { text: "  PING github ─────────────────────────────────────────────", type: "dim" },
      { text: "  64 bytes  ·  icmp_seq=0  ·  ttl=64  ·  time=8ms", type: "green" },
      { text: "  ↳  github.com/antonio-diaz", type: "accent" },
      { text: "" },
      { text: "  PING linkedin ───────────────────────────────────────────", type: "dim" },
      { text: "  64 bytes  ·  icmp_seq=0  ·  ttl=64  ·  time=11ms", type: "green" },
      { text: "  ↳  linkedin.com/in/j-antonio-udiaz/", type: "accent" },
      { text: "" },
      { text: "  PING email ──────────────────────────────────────────────", type: "dim" },
      { text: "  64 bytes  ·  icmp_seq=0  ·  ttl=64  ·  time=4ms", type: "green" },
      { text: "  ↳  j.antonio.diaz@gmail.com", type: "accent" },
      { text: "" },
      { text: "  3/3 hosts reachable  ·  0% packet loss  ·  avg 7.7ms", type: "green" },
      { text: "" },
      { text: "  [ open to: senior roles · platform eng * AI Engineering ]", type: "amber" },
    ],
  },
};

const SECTION_ORDER = ["whoami", "skills", "experience", "contact"];

const HELP_LINES = [
  { text: "" },
  { text: "  Available commands:", type: "green" },
  { text: "" },
  { text: "  whoami              →  identity & tagline" },
  { text: "  skills --list       →  tech stack overview" },
  { text: "  cat experience      →  career timeline" },
  { text: "  ping contact        →  socials & email" },
  { text: "  clear               →  clear terminal" },
  { text: "  help                →  show this menu" },
  { text: "" },
  { text: "  tip: Ctrl+C for a surprise ;)", type: "comment" },
];

// ─── Boot Screen ──────────────────────────────────────────────────────────────

const BOOT_MSGS = [
  { text: "BIOS v2.4.1 — POST check... OK",          type: "dim",   delay: 0   },
  { text: "Loading kernel modules...",                 type: "dim",   delay: 220 },
  { text: "Mounting /dev/portfolio... OK",             type: "dim",   delay: 420 },
  { text: "Starting terminal session",                 type: "dim",   delay: 600 },
  { text: "Welcome to whoaim-terminal v1.0.0",        type: "accent",delay: 820 },
  { text: "─".repeat(54),                             type: "dim",   delay: 950 },
];

const BootScreen = ({ onDone }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const timers = BOOT_MSGS.map(({ text, type, delay }) =>
      setTimeout(() => setLines(p => [...p, { text, type }]), delay)
    );
    const t = setTimeout(onDone, 1100);
    return () => { timers.forEach(clearTimeout); clearTimeout(t); };
  }, []);

  return (
    <div style={{ padding: "0 0 16px", fontFamily: FONT, fontSize: "13px" }}>
      {lines.map((l, i) => (
        <div
          key={i}
          className={`boot-line ${l.type === "accent" ? "ln-accent" : "ln-dim"}`}
          style={{ lineHeight: 1.8 }}
        >
          {l.text}
        </div>
      ))}
    </div>
  );
};

// ─── System Message ───────────────────────────────────────────────────────────

const SysMsg = ({ text, type = "amber" }) => (
  <div
    className={`boot-line ln-${type}`}
    style={{ fontFamily: FONT, fontSize: "14px", lineHeight: 1.7, whiteSpace: "pre-wrap" }}
  >
    {text}
  </div>
);

// ─── Input Bar ────────────────────────────────────────────────────────────────

const InputBar = ({ onSubmit }) => {
  const [val, setVal] = useState("");
  const ref = useRef(null);

  useEffect(() => { ref.current?.focus(); }, []);

  const submit = () => {
    const cmd = val.trim();
    setVal("");
    if (cmd) onSubmit(cmd);
  };

  return (
    <div
      className="input-bar"
      style={{
        display: "flex", alignItems: "center",
        padding: "10px 28px", borderTop: `1px solid ${CYAN}15`,
        background: BG, position: "sticky", bottom: 0, zIndex: 100,
      }}
      onClick={() => ref.current?.focus()}
    >
      <Prompt />
      <input
        ref={ref}
        className="input-field"
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit()}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="type a command..."
        aria-label="Terminal input"
      />
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [booted,    setBooted]    = useState(false);
  const [queueIdx,  setQueueIdx]  = useState(0);  // how many auto-sections revealed
  const [userBlocks, setUserBlocks] = useState([]); // {id, command, path, lines}
  const [sysMsgs,  setSysMsgs]   = useState([]);   // extra messages (ctrl+c etc.)
  const bottomRef = useRef(null);

  // Auto-scroll on any change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [booted, queueIdx, userBlocks, sysMsgs]);

  // Ctrl+C easter egg
  useEffect(() => {
    let lock = false;
    const handler = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        e.preventDefault();
        if (lock) return;
        lock = true;
        const t = Date.now();
        setSysMsgs(p => [
          ...p,
          { id: t,   text: "^C" },
          { id: t+1, text: "" },
          { id: t+2, text: "  [SIGINT] Process interrupted by user." },
          { id: t+3, text: "  Nice try — pipelines don't die that easily 😄", type: "green" },
          { id: t+4, text: "  (╯°□°）╯︵ ┻━┻   ...resuming.", type: "amber" },
          { id: t+5, text: "" },
        ]);
        setTimeout(() => { lock = false; }, 2500);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Normalize typed commands to section keys
  const resolveKey = cmd => {
    const map = {
      "skills --list": "skills", "ls ./projects": "projects",
      "ls -la ./projects": "projects", "cat experience": "experience",
      "cat experience.log": "experience", "ping contact": "contact",
      "ping contact --verbose": "contact",
    };
    return map[cmd] ?? (SECTIONS[cmd] ? cmd : null);
  };

  const handleCommand = useCallback(raw => {
    const cmd = raw.toLowerCase().trim();

    if (cmd === "clear") {
      setUserBlocks([]); setSysMsgs([]);
      return;
    }

    if (cmd === "help") {
      setUserBlocks(p => [...p, { id: Date.now(), command: "help", path: "~", lines: HELP_LINES }]);
      return;
    }

    const key = resolveKey(cmd);
    if (key) {
      setUserBlocks(p => [...p, { id: Date.now(), ...SECTIONS[key] }]);
      return;
    }

    setUserBlocks(p => [...p, {
      id: Date.now(), command: raw, path: "~",
      lines: [
        { text: "" },
        { text: `  bash: ${raw}: command not found`, type: "amber" },
        { text: "  Type 'help' for available commands.", type: "dim" },
        { text: "" },
      ],
    }]);
  }, []);

  const autoSections = SECTION_ORDER.slice(0, queueIdx + 1);

  return (
    <>
      <GlobalStyles />
      <div className="terminal-root" style={{ background: BG, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Title bar */}
        <div style={{
          background: SURFACE, borderBottom: `1px solid ${CYAN}18`,
          padding: "8px 20px", display: "flex", alignItems: "center", gap: "8px",
          position: "sticky", top: 0, zIndex: 200,
        }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {["#ff5f57","#febc2e","#28c840"].map(c => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <span style={{ fontFamily: FONT, fontSize: "12px", color: MUTED }}>
              <span style={{ color: CYAN, textShadow: GLOW }}>whoaim</span>
              {" — bash — 120×38"}
            </span>
          </div>
          <Terminal size={14} color={CYAN} style={{ filter: `drop-shadow(0 0 4px ${CYAN})`, opacity: 0.85 }} />
        </div>

        {/* Body */}
        <div
          className="terminal-body"
          style={{ flex: 1, overflowY: "auto", padding: "24px 28px 8px", fontFamily: FONT, fontSize: "14px" }}
        >
          {!booted && <BootScreen onDone={() => setBooted(true)} />}

          {booted && (
            <>
              {autoSections.map((key, i) => (
                <Block
                  key={`auto-${key}`}
                  {...SECTIONS[key]}
                  onDone={() => {
                    if (i === queueIdx && queueIdx < SECTION_ORDER.length - 1) {
                      setQueueIdx(q => q + 1);
                    }
                  }}
                />
              ))}

              {userBlocks.map(b => (
                <Block key={b.id} command={b.command} path={b.path} lines={b.lines} />
              ))}

              {sysMsgs.map(m => (
                <SysMsg key={m.id} text={m.text} type={m.type ?? "amber"} />
              ))}
            </>
          )}

          <div ref={bottomRef} />
        </div>

        {booted && <InputBar onSubmit={handleCommand} />}
      </div>
    </>
  );
}
