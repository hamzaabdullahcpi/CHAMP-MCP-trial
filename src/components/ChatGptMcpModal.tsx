import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Copy, Check, Bot, ExternalLink, Sparkles, ShieldCheck } from "lucide-react";

export interface ChatGptMcpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MCP_SERVER_URL = "https://champ-mcp-knowledge-server.onrender.com/mcp";

const SAMPLE_QUESTIONS = [
  "Tell me about this toolkit and how it works.",
  "I am a finance ministry official, what is the guidance I can use?",
  "How to set up country platforms and what are the examples?",
  "What tools and resources are available for local climate finance?",
];

export default function ChatGptMcpModal({ isOpen, onClose }: ChatGptMcpModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyUrl = () => {
    navigator.clipboard.writeText(MCP_SERVER_URL);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const copyQuestion = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink/70 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-surface border border-line shadow-2xl flex flex-col z-10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 bg-paper border-b border-line flex items-start justify-between gap-4 shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                  Model Context Protocol (MCP)
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent border border-accent/40 px-1.5 py-0.5 leading-none">
                  Beta
                </span>
              </div>
              <h2 className="text-xl font-display font-bold text-ink flex items-center gap-2">
                <Bot size={20} className="text-accent stroke-[1.75]" />
                Connect CHAMP Toolkit to ChatGPT
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-ink-muted hover:text-ink hover:bg-surface transition-colors rounded-none border border-transparent hover:border-line cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X size={18} className="stroke-[1.75]" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5 text-ink">
            {/* Intro text */}
            <p className="body-text-sm text-ink-muted leading-relaxed">
              Query official CHAMP Toolkit pathways, resources, and country case studies directly within ChatGPT.
            </p>

            {/* MCP Endpoint Box */}
            <div className="bg-paper border border-line p-4">
              <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-1.5">
                MCP Server Endpoint
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-surface border border-line text-xs font-mono text-ink truncate select-all">
                  {MCP_SERVER_URL}
                </code>
                <button
                  type="button"
                  onClick={copyUrl}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-accent text-surface text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                >
                  {copiedUrl ? <Check size={14} /> : <Copy size={14} />}
                  {copiedUrl ? "Copied" : "Copy URL"}
                </button>
              </div>
              <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-ink-muted">
                <ShieldCheck size={13} className="text-[#207B6A] shrink-0" />
                <span>Authentication setting: Select <strong>OAuth</strong> (authenticates automatically).</span>
              </div>
            </div>

            {/* Quick 3-Step Setup */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink mb-3">
                Connect in 3 Simple Steps
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-paper border border-line flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent mb-1 block">Step 1</span>
                    <span className="text-xs font-semibold text-ink mb-1.5 block">Add custom MCP server</span>
                    <p className="text-[11px] text-ink-muted leading-relaxed">
                      Click <strong>Plugins</strong> in your left sidebar, then click the <strong>Add ⌵</strong> button in the top right corner and choose <strong>Add custom MCP server</strong> from the dropdown menu.
                    </p>
                  </div>
                </div>
                <div className="p-3.5 bg-paper border border-line flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent mb-1 block">Step 2</span>
                    <span className="text-xs font-semibold text-ink mb-1.5 block">Set up the MCP server</span>
                    <p className="text-[11px] text-ink-muted leading-relaxed">
                      Give the server a name (like <strong>CHAMP Knowledge</strong>), paste the endpoint URL into the <strong>Server URL</strong> box, select authentication as <strong>OAuth</strong>, and click <strong>Connect</strong> or <strong>Save</strong>.
                    </p>
                  </div>
                </div>
                <div className="p-3.5 bg-paper border border-line flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent mb-1 block">Step 3</span>
                    <span className="text-xs font-semibold text-ink mb-1.5 block">Start chatting with your tool</span>
                    <p className="text-[11px] text-ink-muted leading-relaxed">
                      Go to <strong>Plugins</strong>, open <strong>CHAMP Knowledge</strong>, and click <strong>"Try in chat"</strong> in the top right — or start any chat, tag <strong>@CHAMP Knowledge</strong>, and ask your questions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Establish connection tip */}
              <div className="mt-2.5 p-3 bg-paper border border-line flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <p className="text-[11.5px] text-ink leading-relaxed">
                  <strong>Establishing Connection:</strong> When you send your first question, ChatGPT may prompt to establish a connection with the MCP server. Simply click <strong>Connect</strong> when asked.
                </p>
              </div>
            </div>

            {/* Sample Queries */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink mb-2">
                Sample Questions to Ask
              </h3>
              <div className="space-y-2">
                {SAMPLE_QUESTIONS.map((questionText, idx) => {
                  const isCopied = copiedIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => copyQuestion(questionText, idx)}
                      className="w-full p-2.5 bg-paper border border-line hover:border-accent text-left transition-colors cursor-pointer group flex items-center justify-between gap-3"
                    >
                      <p className="text-xs text-ink group-hover:text-accent transition-colors leading-relaxed">
                        {questionText}
                      </p>
                      <span className="shrink-0 text-ink-muted group-hover:text-accent">
                        {isCopied ? <Check size={14} className="text-[#207B6A]" /> : <Copy size={14} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Source fidelity note */}
            <div className="p-3 bg-paper border-l-2 border-accent text-[11px] text-ink-muted leading-relaxed">
              This chatbot draws on the CHAMP Toolkit to provide reliable, source-grounded guidance. Responses are generated by ChatGPT, so wording may differ slightly from the original Toolkit content.
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
