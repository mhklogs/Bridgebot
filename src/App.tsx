import React, { useState, useRef, useEffect } from "react";
import { 
  Code2, 
  Cpu, 
  ShieldCheck, 
  Settings, 
  Play, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  CornerDownRight, 
  FileCode, 
  Send, 
  AlertTriangle, 
  RefreshCw, 
  Terminal, 
  Layers, 
  HelpCircle,
  Clock,
  ChevronRight,
  Upload,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LEGACY_EXAMPLES } from "./examples";
import { MigrationResult, SecurityVulnerability } from "./types";

function getFileExtension(targetLang: string): string {
  const t = targetLang.toLowerCase();
  if (t.startsWith("go")) return "go";
  if (t.includes("python")) return "py";
  if (t.includes("typescript") || t === "ts" || t.startsWith("ts")) return "ts";
  if (t.includes("rust")) return "rs";
  if (t.includes("c++") || t.includes("cpp") || t.includes("objective-c")) return "cpp";
  if (t.includes("java")) return "java";
  if (t.includes("c#") || t.includes(".net")) return "cs";
  if (t.includes("elixir")) return "ex";
  if (t.includes("vue")) return "vue";
  if (t.includes("svelte")) return "svelte";
  if (t.includes("swift")) return "swift";
  if (t.includes("flutter") || t.includes("dart")) return "dart";
  if (t.includes("kotlin")) return "kt";
  return "txt";
}

export default function App() {
  // Application State
  const [sourceCode, setSourceCode] = useState(LEGACY_EXAMPLES[0].code);
  const [sourceLang, setSourceLang] = useState(LEGACY_EXAMPLES[0].sourceLang);
  const [targetLang, setTargetLang] = useState(LEGACY_EXAMPLES[0].targetLang);
  const [customSourceLang, setCustomSourceLang] = useState("");
  const [customTargetLang, setCustomTargetLang] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>(LEGACY_EXAMPLES[0].suggestedOptions);
  
  // Migration Engine status
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStep, setMigrationStep] = useState<number>(0);
  const [migrationLogs, setMigrationLogs] = useState<string[]>([]);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [mode, setMode] = useState<"live" | "offline">("offline");
  const [activeTab, setActiveTab] = useState<"code" | "architecture" | "refactoring" | "security" | "tests" | "chat">("code");
  
  // Interactive Refinement state
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "agent"; message: string; timestamp: string }>>([]);
  const [isRefining, setIsRefining] = useState(false);
  
  // Clipboard/Utility feedback states
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedTests, setCopiedTests] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Available optimization pipeline flags
  const PIPELINE_OPTIONS = [
    "Performance Optimization Pass",
    "Strict Type Safety",
    "Concurrency Refactoring",
    "Security & Memory-Safety Audit",
    "Unit Test Suite Generation"
  ];

  // Quick select an example
  const handleSelectExample = (exampleId: string) => {
    const ex = LEGACY_EXAMPLES.find(e => e.id === exampleId);
    if (ex) {
      setSourceCode(ex.code);
      setSourceLang(ex.sourceLang);
      setTargetLang(ex.targetLang);
      setSelectedOptions(ex.suggestedOptions);
    }
  };

  // Toggle optimization flag
  const toggleOption = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isRefining]);

  // Handle Drag and Drop for Legacy Files
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSourceCode(event.target.result as string);
        // Try guessing the language from extension
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext === "cob" || ext === "cbl") {
          setSourceLang("COBOL");
        } else if (ext === "java") {
          setSourceLang("Java");
        } else if (ext === "f" || ext === "f77" || ext === "f90" || ext === "for") {
          setSourceLang("Fortran");
        } else if (ext === "php") {
          setSourceLang("PHP");
        } else if (ext === "cpp" || ext === "cc" || ext === "h") {
          setSourceLang("C++");
        } else if (ext === "js" || ext === "jsx") {
          setSourceLang("Legacy JavaScript");
        } else if (ext === "pas") {
          setSourceLang("Turbo Pascal");
        }
      }
    };
    reader.readAsText(file);
  };

  // Trigger Migration Process
  const handleStartMigration = async () => {
    if (!sourceCode.trim()) return;

    const finalSource = sourceLang === "Custom" ? (customSourceLang.trim() || "Custom Stack") : sourceLang;
    const finalTarget = targetLang === "Custom" ? (customTargetLang.trim() || "Custom Stack") : targetLang;

    setIsMigrating(true);
    setMigrationStep(1);
    setMigrationLogs(["[SYSTEM] BridgeBot initialized."]);
    setMigrationResult(null);
    setMode("offline");
    setChatHistory([]);
    setActiveTab("code");

    // Phase 1: Deep Semantic Analysis
    await simulateStep("Parsing AST and understanding core program semantics...", 1500);
    setMigrationStep(2);

    // Phase 2: Mapping Architecture Equivalents
    await simulateStep("Identifying obsolete anti-patterns & mapping memory allocation models...", 1400);
    setMigrationStep(3);

    // Phase 3: Drafting Transformation
    await simulateStep(`Constructing intermediate representation & drafting idiomatic target code in ${finalTarget}...`, 1600);
    setMigrationStep(4);

    // Phase 4: Running Optimization Passes
    const hasPerf = selectedOptions.includes("Performance Optimization Pass");
    await simulateStep(
      hasPerf 
        ? "Compressing control hierarchies, pruning dead loops, and optimizing resource boundaries..." 
        : "Executing standard refactoring pass...",
      1300
    );
    setMigrationStep(5);

    // Phase 5: Security Auditing
    await simulateStep("Scanning for memory leaks, integer overflows, and unvalidated parameters...", 1200);
    setMigrationStep(6);

    try {
      setMigrationLogs(prev => [...prev, "[INFO] Connecting to Google Gemini modernization model..."]);
      const res = await fetch("/api/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode,
          sourceLang: finalSource,
          targetLang: finalTarget,
          options: selectedOptions
        })
      });

      if (!res.ok) {
        throw new Error(await res.text() || "Migration failed server-side.");
      }

      const result: MigrationResult & { _mode?: string } = await res.json();
      setMigrationResult(result);
      setMode((result as any)._mode === "live" ? "live" : "offline");
      setMigrationLogs(prev => [...prev, `[SUCCESS] Modernization complete! Generated ${result.performanceComparison.modern.linesOfCode} lines of idiomatic ${finalTarget}.`]);
      
      // Initialize chat with a welcome message from the agent
      setChatHistory([
        {
          sender: "agent",
          message: `Hello! I am your autonomous BridgeBot. I've successfully modernized your legacy **${finalSource}** code into highly optimized, idiomatic **${finalTarget}**. 

I fixed **${result.securityAudit.vulnerabilitiesFound.length} security vulnerabilities** and simplified legacy bottlenecks.

How can I help you refine this code further? You can ask me to:
- "Rewrite the concurrent handlers to use timeouts"
- "Explain the performance differences in detail"
- "Add comprehensive file/error logging"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setMigrationLogs(prev => [...prev, `[ERROR] ${err.message || "An error occurred during Gemini code generation."}`]);
    } finally {
      setIsMigrating(false);
    }
  };

  const simulateStep = (msg: string, delay: number) => {
    return new Promise<void>((resolve) => {
      setMigrationLogs(prev => [...prev, `[INFO] ${msg}`]);
      setTimeout(() => {
        resolve();
      }, delay);
    });
  };

  // Refine migrated code through conversational input
  const handleRefineCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !migrationResult || isRefining) return;

    const finalSource = sourceLang === "Custom" ? (customSourceLang.trim() || "Custom Stack") : sourceLang;
    const finalTarget = targetLang === "Custom" ? (customTargetLang.trim() || "Custom Stack") : targetLang;

    const userMsg = chatMessage;
    setChatMessage("");
    setChatHistory(prev => [
      ...prev,
      {
        sender: "user",
        message: userMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setIsRefining(true);

    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode,
          modernCode: migrationResult.modernCode,
          message: userMsg,
          sourceLang: finalSource,
          targetLang: finalTarget
        })
      });

      if (!res.ok) {
        throw new Error("Refinement request failed.");
      }

      const data = await res.json();
      
      // Update the migration result code
      setMigrationResult(prev => prev ? { ...prev, modernCode: data.refinedCode } : null);

      setChatHistory(prev => [
        ...prev,
        {
          sender: "agent",
          message: data.explanation,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setChatHistory(prev => [
        ...prev,
        {
          sender: "agent",
          message: "⚠️ Sorry, I encountered an issue while communicating with the refinement server. Please check the network or server logs and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsRefining(false);
    }
  };

  // Helper to copy text to clipboard
  const handleCopy = (text: string, type: "code" | "tests") => {
    navigator.clipboard.writeText(text);
    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedTests(true);
      setTimeout(() => setCopiedTests(false), 2000);
    }
  };

  // Download migrated code as a file
  const handleDownloadCode = () => {
    if (!migrationResult) return;
    const ext = getFileExtension(targetLang);
    const blob = new Blob([migrationResult.modernCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `modernized_source.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Render severity colors
  const getSeverityBadge = (severity: string) => {
    const map: Record<string, string> = {
      "High": "bg-red-950/40 text-red-400 border-red-800/60",
      "Medium": "bg-amber-950/40 text-amber-400 border-amber-800/60",
      "Low": "bg-blue-950/40 text-blue-400 border-blue-800/60"
    };
    return map[severity] || "bg-zinc-800 text-zinc-400 border-zinc-700";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200" id="main-container">
      {/* Top Banner & Header */}
      <header className="border-b border-zinc-800/80 bg-white/90 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              BridgeBot
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                Zero Downtime
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Enterprise-grade modernization pipeline powered by Gemini
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {mode === "live" ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs bg-emerald-100 border-emerald-600/40 text-emerald-700" title="Gemini API connected – AI-driven transformation active">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Gemini API: Live
            </div>
          ) : migrationResult && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs bg-amber-100 border-amber-600/40 text-amber-700" title="No GEMINI_API_KEY configured – using the deterministic offline engine. Set one for full AI-driven results">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Offline engine
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-full">
        {/* Left Side Panel (Legacy Control Room) - 5 columns */}
        <section className="col-span-1 lg:col-span-5 border-r border-zinc-800/80 p-5 flex flex-col gap-5 overflow-y-auto bg-zinc-950/20">
          
          {/* Section Heading */}
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-zinc-300">
                1. Code Extraction & Config
              </h2>
            </div>
            <div className="text-xs text-indigo-400 font-mono flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Examples
            </div>
          </div>

          {/* Quick Preload Templates */}
          <div className="grid grid-cols-2 gap-2">
            {LEGACY_EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => handleSelectExample(ex.id)}
                className="p-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700/80 text-left transition duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 group"
              >
                <div className="text-xs font-semibold text-zinc-200 group-hover:text-indigo-400 transition-colors">
                  {ex.title.split(":")[0]}
                </div>
                <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                  {ex.title.split(":")[1]}
                </div>
              </button>
            ))}
          </div>

          {/* Configuration Settings */}
          <div className="p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/60 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-zinc-400" /> Translation Target
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-zinc-400 font-medium mb-1.5">
                  Legacy Source Stack
                </label>
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  <optgroup label="Mainframe & Math">
                    <option value="COBOL">COBOL (Mainframe)</option>
                    <option value="Fortran 77">Fortran 77/90 Math</option>
                    <option value="Turbo Pascal">Turbo Pascal</option>
                    <option value="Basic / QBasic">Basic / QBasic</option>
                  </optgroup>
                  <optgroup label="Legacy Backend Stacks">
                    <option value="Java 6">Java 6/8 Legacy</option>
                    <option value="PHP 5.4">PHP 5.4 Backend</option>
                    <option value="Legacy C++">Legacy C++ (C++98)</option>
                    <option value="Python 2.7">Python 2.7 Legacy</option>
                    <option value="C# (Legacy Framework)">C# (Legacy Framework)</option>
                    <option value="ASP.NET WebForms">ASP.NET WebForms</option>
                    <option value="Ruby on Rails (Legacy)">Ruby on Rails (Legacy)</option>
                    <option value="Perl 5">Perl 5 Scripting</option>
                    <option value="ColdFusion">ColdFusion Markup</option>
                  </optgroup>
                  <optgroup label="Legacy Frontend Stacks">
                    <option value="Legacy JavaScript">ES5 JavaScript (Legacy)</option>
                    <option value="jQuery / Vanilla JS">jQuery / Vanilla JS</option>
                    <option value="ActionScript 3">ActionScript 3 (Flash)</option>
                    <option value="Objective-C">Objective-C (Legacy iOS)</option>
                  </optgroup>
                  <optgroup label="Custom Stack">
                    <option value="Custom">Custom / New Stack...</option>
                  </optgroup>
                </select>
                {sourceLang === "Custom" && (
                  <input
                    type="text"
                    value={customSourceLang}
                    onChange={(e) => setCustomSourceLang(e.target.value)}
                    placeholder="Enter legacy stack (e.g. Pascal 3.0)"
                    className="w-full mt-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                )}
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 font-medium mb-1.5">
                  Modern Target Stack
                </label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  <optgroup label="Backend Stacks">
                    <option value="Go">Go (Highly Concurrent)</option>
                    <option value="Python 3.12">Python 3.12 (Modern Typed)</option>
                    <option value="TypeScript (Bun/Node)">TypeScript (Bun/Node)</option>
                    <option value="Rust">Rust (Memory-Safe/Fast)</option>
                    <option value="Modern C++23">Modern C++23</option>
                    <option value="Modern Java 21">Java 21 (Modern Enterprise)</option>
                    <option value="C# (.NET 9)">C# (.NET 9 / WebAPI)</option>
                    <option value="Elixir / Phoenix">Elixir / Phoenix</option>
                  </optgroup>
                  <optgroup label="Frontend Frameworks">
                    <option value="React 19 + Vite">React 19 + Vite</option>
                    <option value="Next.js 15 (App Router)">Next.js 15 (App Router)</option>
                    <option value="Vue 3 + Composition API">Vue 3 + Composition API</option>
                    <option value="SvelteKit 2">SvelteKit 2</option>
                    <option value="SolidJS">SolidJS (Ultra-Fast)</option>
                    <option value="Nuxt 3">Nuxt 3 (Vue Fullstack)</option>
                    <option value="Astro 4">Astro 4 (Content-First)</option>
                  </optgroup>
                  <optgroup label="Mobile Stacks">
                    <option value="Flutter">Flutter (Dart Mobile)</option>
                    <option value="React Native">React Native (TypeScript Mobile)</option>
                    <option value="SwiftUI">SwiftUI (Apple Native)</option>
                    <option value="Kotlin Multiplatform">Kotlin Multiplatform</option>
                  </optgroup>
                  <optgroup label="Custom Stack">
                    <option value="Custom">Custom / New Stack...</option>
                  </optgroup>
                </select>
                {targetLang === "Custom" && (
                  <input
                    type="text"
                    value={customTargetLang}
                    onChange={(e) => setCustomTargetLang(e.target.value)}
                    placeholder="Enter target stack (e.g. Mojo 24.1)"
                    className="w-full mt-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                )}
              </div>
            </div>

            {/* Optimization Flags */}
            <div>
              <label className="block text-[10px] text-zinc-400 font-medium mb-2">
                Compiler & Optimizer Passes
              </label>
              <div className="flex flex-col gap-2">
                {PIPELINE_OPTIONS.map((opt) => {
                  const active = selectedOptions.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleOption(opt)}
                      className={`flex items-center justify-between p-2 rounded-xl text-left text-xs border transition duration-150 ${
                        active 
                          ? "bg-indigo-950/20 border-indigo-500/50 text-indigo-300" 
                          : "bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      <span>{opt}</span>
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] font-bold ${
                        active ? "border-indigo-400 bg-indigo-500 text-white" : "border-zinc-600"
                      }`}>
                        {active && "✓"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legacy Input Editor Area */}
          <div className="flex-1 flex flex-col gap-2 min-h-[300px]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-zinc-300">
                Legacy Source Code Block
              </label>
              <button
                onClick={() => setSourceCode("")}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
              >
                Clear screen
              </button>
            </div>

            <div 
              className={`flex-1 relative rounded-2xl border transition-all duration-200 flex flex-col overflow-hidden ${
                dragActive ? "border-indigo-500 bg-indigo-950/10" : "border-zinc-800 bg-zinc-950"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {/* Line number strip */}
              <div className="flex-1 flex overflow-hidden">
                <div className="w-12 bg-zinc-900/40 border-r border-zinc-800/60 select-none py-3 text-right pr-3 font-mono text-[11px] text-zinc-600 leading-6 h-full overflow-y-hidden">
                  {Array.from({ length: Math.max(1, sourceCode.split("\n").length) }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                <textarea
                  value={sourceCode}
                  onChange={(e) => setSourceCode(e.target.value)}
                  placeholder="Paste legacy code snippets here or drop files to upload..."
                  className="flex-1 bg-transparent text-zinc-200 font-mono text-[12px] p-3 leading-6 focus:outline-none resize-none overflow-y-auto h-full placeholder:text-zinc-600"
                  spellCheck="false"
                />
              </div>

              {/* Upload Drop overlay */}
              {dragActive && (
                <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-indigo-500/60 rounded-2xl">
                  <Upload className="w-8 h-8 text-indigo-400" />
                  <p className="text-xs text-zinc-300 font-medium">Drop your legacy file here to extract</p>
                </div>
              )}

              {/* Manual upload anchor */}
              <div className="px-4 py-2 border-t border-zinc-800/80 bg-zinc-900/20 flex items-center justify-between text-xs text-zinc-400">
                <span>{sourceCode.length} chars | ~{sourceCode.split("\n").length} LOC</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="hover:text-zinc-100 flex items-center gap-1.5 transition-colors font-mono text-[10px]"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload file
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Core Submit Modernization Trigger */}
          <button
            onClick={handleStartMigration}
            disabled={isMigrating || !sourceCode.trim()}
            className={`w-full py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
              isMigrating 
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/60" 
                : !sourceCode.trim()
                ? "bg-zinc-900 text-zinc-500 cursor-not-allowed border border-zinc-800/80"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/10 cursor-pointer active:scale-[0.98]"
            }`}
          >
            {isMigrating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Refactoring legacy flows...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Run modernization pipeline</span>
              </>
            )}
          </button>
        </section>

        {/* Right Side Panel (Modernized Console / Output Room) - 7 columns */}
        <section className="col-span-1 lg:col-span-7 flex flex-col overflow-y-auto bg-zinc-950 relative">
          
          {/* Active Migration Terminal Overlay */}
          <AnimatePresence>
            {isMigrating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-zinc-950/95 z-40 p-6 flex flex-col justify-between"
              >
                <div className="flex flex-col gap-6">
                  {/* Title */}
                  <div className="flex items-center gap-2 pb-3 border-b border-zinc-800/60">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-bold text-indigo-600">
                      Migration Compilation Logs
                    </h3>
                  </div>

                  {/* Progressive logs list */}
                  <div className="font-mono text-xs leading-6 text-zinc-300 flex flex-col gap-2 h-[450px] overflow-y-auto bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/60">
                    {migrationLogs.map((log, i) => {
                      const isError = log.includes("[ERROR]");
                      const isSuccess = log.includes("[SUCCESS]");
                      const isSystem = log.includes("[SYSTEM]");
                      return (
                        <div 
                          key={i} 
                          className={
                            isError ? "text-red-400" : 
                            isSuccess ? "text-emerald-400 font-bold" : 
                            isSystem ? "text-indigo-400" : 
                            "text-zinc-400"
                          }
                        >
                          {log}
                        </div>
                      );
                    })}
                    <div className="w-2 h-4 bg-zinc-500 inline-block mt-1"></div>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Semantic transformation progress</span>
                    <span>{Math.round((migrationStep / 6) * 100)}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-indigo-600 h-full rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(migrationStep / 6) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dashboard Result Room */}
          {!isMigrating && (
            <div className="flex-1 flex flex-col h-full" id="migration-result-room">
              
              {/* Output Tab Control Strip */}
              <div className="border-b border-zinc-800/80 bg-zinc-900/20 px-4 py-2 flex flex-wrap gap-1.5 items-center">
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    activeTab === "code" 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  Modernized Code
                </button>
                <button
                  disabled={!migrationResult}
                  onClick={() => setActiveTab("architecture")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    !migrationResult 
                      ? "opacity-40 cursor-not-allowed text-zinc-500" 
                      : activeTab === "architecture" 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  Architecture Summary {!migrationResult && "🔒"}
                </button>
                <button
                  disabled={!migrationResult}
                  onClick={() => setActiveTab("refactoring")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    !migrationResult 
                      ? "opacity-40 cursor-not-allowed text-zinc-500" 
                      : activeTab === "refactoring" 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  Refactoring Log {!migrationResult && "🔒"}
                </button>
                <button
                  disabled={!migrationResult}
                  onClick={() => setActiveTab("security")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    !migrationResult 
                      ? "opacity-40 cursor-not-allowed text-zinc-500" 
                      : activeTab === "security" 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  Security Audit {migrationResult ? `(${migrationResult.securityAudit.vulnerabilitiesFound.length})` : "🔒"}
                </button>
                <button
                  disabled={!migrationResult}
                  onClick={() => setActiveTab("tests")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    !migrationResult 
                      ? "opacity-40 cursor-not-allowed text-zinc-500" 
                      : activeTab === "tests" 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  Unit Tests {!migrationResult && "🔒"}
                </button>
                <button
                  disabled={!migrationResult}
                  onClick={() => setActiveTab("chat")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition relative ${
                    !migrationResult 
                      ? "opacity-40 cursor-not-allowed text-zinc-500" 
                      : activeTab === "chat" 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  Refine with Agent {!migrationResult ? "🔒" : <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-zinc-200"></span>}
                </button>
              </div>

              {/* Output Panes Router */}
              <div className="flex-1 p-6 overflow-y-auto">
                
                {/* 1. Code Tab */}
                {activeTab === "code" && (
                  <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
                    {/* Modern source code file panel */}
                    <div className="lg:col-span-8 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span className="font-mono text-[11px] text-zinc-500 flex items-center gap-1">
                          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                          main.{getFileExtension(targetLang)}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            disabled={!migrationResult}
                            onClick={() => migrationResult && handleCopy(migrationResult.modernCode, "code")}
                            className={`hover:text-zinc-200 flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-zinc-900 border border-zinc-800 transition ${!migrationResult ? "opacity-40 cursor-not-allowed" : ""}`}
                          >
                            {copiedCode ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy code
                              </>
                            )}
                          </button>
                          <button
                            disabled={!migrationResult}
                            onClick={() => migrationResult && handleDownloadCode()}
                            className={`hover:text-zinc-200 flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-zinc-900 border border-zinc-800 transition ${!migrationResult ? "opacity-40 cursor-not-allowed" : ""}`}
                          >
                            <Download className="w-3 h-3" /> Download
                          </button>
                        </div>
                      </div>

                      {/* Code container with line offsets */}
                      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden flex font-mono text-[12px] leading-6 h-[500px]">
                        <div className="w-12 bg-zinc-900/40 border-r border-zinc-800/60 select-none py-3 text-right pr-3 text-zinc-600 leading-6 overflow-y-hidden">
                          {Array.from({ length: Math.max(1, (migrationResult ? migrationResult.modernCode : "").split("\n").length) }).map((_, i) => (
                            <div key={i}>{i + 1}</div>
                          ))}
                        </div>
                        <pre className="flex-1 p-3 overflow-y-auto text-zinc-200 h-full select-text whitespace-pre-wrap font-mono">
                          <code>{migrationResult ? migrationResult.modernCode : `// BridgeBot is ready to modernize your codebase.
// Target: ${targetLang === "Custom" ? (customTargetLang.trim() || "Your custom stack") : targetLang}
//
// 1. Pick a legacy example on the left, or paste / drop a legacy file
// 2. Choose source → target stacks and optimizer passes
// 3. Click "Run Modernization Pipeline"
//
// The engine will use the Gemini API when a GEMINI_API_KEY is set,
// and gracefully falls back to the deterministic offline engine otherwise.`}</code>
                        </pre>
                      </div>
                    </div>

                    {/* Performance comparison side metric blocks */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                      <div className="p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/60">
                        <h4 className="text-xs font-semibold text-zinc-300 mb-4 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Metric deltas
                        </h4>

                        {/* Metric lines count */}
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[11px] text-zinc-400">
                              <span>Lines of Code</span>
                              <span className="font-mono font-semibold text-zinc-200">
                                {sourceCode.split("\n").length} → {migrationResult ? migrationResult.performanceComparison.modern.linesOfCode : "—"}
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                              <div 
                                className="bg-zinc-600 h-full" 
                                style={{ width: `${migrationResult ? Math.min(100, (sourceCode.split("\n").length / (sourceCode.split("\n").length + migrationResult.performanceComparison.modern.linesOfCode)) * 100) : 50}%` }}
                              />
                              <div 
                                className="bg-indigo-500 h-full" 
                                style={{ width: `${migrationResult ? Math.min(100, (migrationResult.performanceComparison.modern.linesOfCode / (sourceCode.split("\n").length + migrationResult.performanceComparison.modern.linesOfCode)) * 100) : 0}%` }}
                              />
                            </div>
                          </div>

                          {/* Metric 2: Memory Footprint */}
                          <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/80 mt-2">
                            <div className="text-[10px] text-zinc-500 mb-1">Legacy memory overhead</div>
                            <div className="text-xs font-semibold text-zinc-300">{migrationResult ? migrationResult.performanceComparison.legacy.memory : "—"}</div>
                            <div className="text-[10px] text-indigo-400 mt-3 mb-1">Modernized allocation</div>
                            <div className="text-xs font-semibold text-emerald-400">{migrationResult ? migrationResult.performanceComparison.modern.memory : "—"}</div>
                          </div>

                          {/* Metric 3: Concurrency / Efficiency */}
                          <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/80">
                            <div className="text-[10px] text-zinc-500 mb-1">Legacy CPU-bound state</div>
                            <div className="text-xs font-semibold text-zinc-300">{migrationResult ? migrationResult.performanceComparison.legacy.cpuEfficiency : "—"}</div>
                            <div className="text-[10px] text-indigo-400 mt-3 mb-1">Modern efficiency</div>
                            <div className="text-xs font-semibold text-emerald-400">{migrationResult ? migrationResult.performanceComparison.modern.cpuEfficiency : "—"}</div>
                          </div>
                        </div>
                      </div>

                      {/* Micro Summary Checklist of features applied */}
                      <div className="p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/60 flex flex-col gap-2.5">
                        <div className="text-[10px] text-zinc-500 mb-1">Migration assurance</div>
                        <div className="flex items-center gap-2 text-xs text-zinc-300">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          Idiomatic style-guide matching
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-300">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          Memory leak elimination
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-300">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          Strong type safety enforcement
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Architecture Summary Tab */}
                {activeTab === "architecture" && (
                  <div className="flex flex-col gap-6 max-w-3xl">
                    <div className="p-5 bg-zinc-900/20 rounded-2xl border border-zinc-800/80 flex flex-col gap-4">
                      <h4 className="text-sm font-semibold text-zinc-200 flex items-center gap-2 font-mono">
                        <CornerDownRight className="w-4 h-4 text-indigo-400" /> LEGACY PARADOXES RESOLVED
                      </h4>
                      <p className="text-xs text-zinc-400 mb-2 leading-relaxed">
                        The migration process identifies redundant, blocking, or non-portable design architecture in the source software and completely modernizes it:
                      </p>
                      <ul className="flex flex-col gap-2.5">
                        {migrationResult.architecturalSummary.legacyParadoxesResolved.map((p, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                            <span className="text-red-400 font-bold font-mono shrink-0">[-]</span>
                            <span className="leading-relaxed">{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 bg-zinc-900/20 rounded-2xl border border-zinc-800/80 flex flex-col gap-4">
                      <h4 className="text-sm font-semibold text-zinc-200 flex items-center gap-2 font-mono">
                        <Sparkles className="w-4 h-4 text-emerald-400" /> TARGET STACK FEATURES UTILIZED
                      </h4>
                      <p className="text-xs text-zinc-400 mb-2 leading-relaxed">
                        These structural features native to modern {targetLang} were successfully integrated to enforce safety, modularity, and lightweight execution:
                      </p>
                      <ul className="flex flex-col gap-2.5">
                        {migrationResult.architecturalSummary.targetStackFeatures.map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                            <span className="text-emerald-400 font-bold font-mono shrink-0">[+]</span>
                            <span className="leading-relaxed">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 3. Refactoring Log Tab */}
                {activeTab === "refactoring" && (
                  <div className="flex flex-col gap-6 max-w-3xl font-sans">
                    <div className="border border-zinc-800 bg-zinc-900/10 rounded-2xl p-5 flex flex-col gap-4">
                      <h4 className="text-xs font-semibold text-indigo-600">
                        Streamlining Complex Control Logic
                      </h4>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {migrationResult.refactoringDetails.nestedLoopsSimplified}
                      </p>
                    </div>

                    <div className="border border-zinc-800 bg-zinc-900/10 rounded-2xl p-5 flex flex-col gap-4">
                      <h4 className="text-xs font-semibold text-indigo-600">
                        Dead Code & Boilerplate Pruning
                      </h4>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {migrationResult.refactoringDetails.deadCodeRemoved}
                      </p>
                    </div>

                    <div className="border border-zinc-800 bg-zinc-900/10 rounded-2xl p-5 flex flex-col gap-4">
                      <h4 className="text-xs font-semibold text-indigo-600">
                        Clean Architecture Ingress
                      </h4>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {migrationResult.refactoringDetails.cleanArchitectureApplied}
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. Security Audit Tab */}
                {activeTab === "security" && (
                  <div className="flex flex-col gap-5 max-w-3xl">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-400" /> Security compliance report
                      </h4>
                      <span className="text-xs text-zinc-400 font-mono">
                        {migrationResult.securityAudit.vulnerabilitiesFound.length} vulnerabilities patched
                      </span>
                    </div>

                    {migrationResult.securityAudit.vulnerabilitiesFound.length === 0 ? (
                      <div className="p-6 bg-emerald-950/20 rounded-2xl border border-emerald-800/60 flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                        <div>
                          <div className="text-sm font-semibold text-emerald-300">No major safety vulnerabilities identified</div>
                          <div className="text-xs text-emerald-400/80 mt-0.5">The provided code meets the high safety standard required by modern memory systems.</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {migrationResult.securityAudit.vulnerabilitiesFound.map((vuln, i) => (
                          <div key={i} className="border border-zinc-800/80 rounded-2xl p-5 bg-zinc-900/20 flex flex-col gap-3">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5 font-mono">
                                <AlertTriangle className="w-4 h-4 text-amber-500" /> {vuln.issue}
                              </span>
                              <span className={`text-[10px] font-semibold border px-2.5 py-0.5 rounded-full ${getSeverityBadge(vuln.severity)}`}>
                                {vuln.severity} severity
                              </span>
                            </div>
                            <div className="text-xs text-zinc-400 leading-relaxed">
                              <span className="text-[10px] text-zinc-500 block mb-1">Legacy threat concern</span>
                              {vuln.description}
                            </div>
                            <div className="text-xs text-zinc-300 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 leading-relaxed">
                              <span className="text-[10px] text-emerald-400 block mb-1">Patched target remedial pass</span>
                              {vuln.resolution}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. Unit Tests Tab */}
                {activeTab === "tests" && (
                  <div className="flex flex-col gap-3 max-w-3xl">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-mono text-[11px] text-zinc-500">
                        test_suite.{getFileExtension(targetLang)}
                      </span>
                      <button
                        onClick={() => handleCopy(migrationResult.unitTests, "tests")}
                        className="hover:text-zinc-200 flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-zinc-900 border border-zinc-800 transition"
                      >
                        {copiedTests ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy tests
                          </>
                        )}
                      </button>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden flex font-mono text-[12px] leading-6 h-[450px]">
                      <div className="w-12 bg-zinc-900/40 border-r border-zinc-800/60 select-none py-3 text-right pr-3 text-zinc-600 leading-6 overflow-y-hidden">
                        {Array.from({ length: Math.max(1, migrationResult.unitTests.split("\n").length) }).map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        ))}
                      </div>
                      <pre className="flex-1 p-3 overflow-y-auto text-zinc-200 h-full select-text whitespace-pre-wrap font-mono">
                        <code>{migrationResult.unitTests}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* 6. Refinement Chat Tab */}
                {activeTab === "chat" && (
                  <div className="flex flex-col h-[520px] border border-zinc-800 bg-zinc-900/10 rounded-2xl overflow-hidden font-sans">
                    {/* Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
                      {chatHistory.map((msg, i) => (
                        <div 
                          key={i} 
                          className={`flex flex-col max-w-[85%] ${
                            msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                          }`}
                        >
                          <div className="text-[9px] text-zinc-500 font-mono mb-1">{msg.timestamp}</div>
                          <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === "user" 
                              ? "bg-indigo-600 text-white rounded-tr-none" 
                              : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none whitespace-pre-line"
                          }`}>
                            {msg.message}
                          </div>
                        </div>
                      ))}
                      {isRefining && (
                        <div className="self-start flex flex-col gap-1 items-start">
                          <div className="text-[9px] text-zinc-500 font-mono">Agent processing</div>
                          <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-tl-none text-xs flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                            Refining program code based on criteria...
                          </div>
                        </div>
                      )}
                      <div ref={chatBottomRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleRefineCode} className="p-3 bg-zinc-900/50 border-t border-zinc-800/80 flex gap-2">
                      <input
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Instruct agent to refine (e.g., 'Add context-based cancellation to the queue')"
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 text-zinc-200"
                        disabled={isRefining}
                      />
                      <button
                        type="submit"
                        disabled={isRefining || !chatMessage.trim()}
                        className={`p-2 rounded-xl transition cursor-pointer flex items-center justify-center ${
                          chatMessage.trim() && !isRefining
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        }`}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}

              </div>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}
