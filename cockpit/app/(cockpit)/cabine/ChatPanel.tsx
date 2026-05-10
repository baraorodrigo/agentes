"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { AgentRecord } from "@/lib/agents";
import type { ChatMessage } from "@/lib/cabine";
import { sendMessage } from "./actions";

export function ChatPanel({
  agent,
  initialHistory,
  apiKeyConfigured,
}: {
  agent: AgentRecord;
  initialHistory: ChatMessage[];
  apiKeyConfigured: boolean;
}) {
  const [history, setHistory] = useState<ChatMessage[]>(initialHistory);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(initialHistory);
  }, [initialHistory]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history.length, pending]);

  const onSend = () => {
    const text = input.trim();
    if (!text) return;
    setError(null);
    setInput("");
    const userMsg: ChatMessage = { role: "user", content: text, ts: new Date().toISOString() };
    setHistory((h) => [...h, userMsg]);
    startTransition(async () => {
      const result = await sendMessage(agent.id, text);
      if (result.ok) {
        setHistory((h) => [...h, result.reply]);
      } else {
        setError(result.error);
      }
    });
  };

  const suggestions = SUGGESTIONS[agent.id] ?? ["confirma", "refaz", "dá outras opções"];

  return (
    <section className="flex flex-col rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-border)] px-3 py-2">
        <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          Conversar com {agent.name}
        </div>
        <div className="mt-0.5 text-[10px] text-[var(--color-text-dim)]">
          IDENTITY {agent.id === "jarbas" ? "+ SOUL " : ""}carregados · canal interno (não vai pro WhatsApp)
        </div>
      </div>

      <div ref={scrollRef} className="flex max-h-[480px] min-h-[280px] flex-col gap-2 overflow-y-auto p-3">
        {history.length === 0 && (
          <div className="rounded border border-dashed border-[var(--color-border)] p-4 text-center text-[11px] text-[var(--color-text-dim)]">
            Sem histórico. Manda a primeira mensagem.
          </div>
        )}
        {history.map((m, i) => (
          <Bubble key={i} msg={m} agent={agent} />
        ))}
        {pending && (
          <div className="self-start text-[11px] text-[var(--color-text-dim)]">{agent.name} pensando…</div>
        )}
        {error && (
          <div className="self-start rounded border border-[var(--color-danger)] bg-[var(--color-bg)] px-2 py-1 text-[11px] text-[var(--color-danger)]">
            {error}
          </div>
        )}
      </div>

      {/* Sugestões */}
      <div className="flex flex-wrap gap-1 border-t border-[var(--color-border)] px-3 py-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setInput(s)}
            className="rounded border border-[var(--color-border)] px-2 py-0.5 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 border-t border-[var(--color-border)] p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !pending) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={
            apiKeyConfigured
              ? `Mensagem pra ${agent.name}…`
              : "ANTHROPIC_API_KEY não configurada — chat desativado"
          }
          disabled={!apiKeyConfigured || pending}
          className="flex-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-[12px] outline-none focus:border-[var(--color-accent)] disabled:opacity-60"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={!apiKeyConfigured || pending || !input.trim()}
          className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-[12px] hover:border-[var(--color-accent)] disabled:opacity-60"
        >
          enviar
        </button>
      </div>
    </section>
  );
}

const SUGGESTIONS: Record<string, string[]> = {
  jarbas: ["status do dia", "o que falta?", "manda o briefing"],
  beto: ["confirma", "refaz mais curto", "dá outras opções"],
  lia: ["responde formal", "responde casual", "escala pro Gil"],
  duda: ["aprovado", "muda o tom", "+ opções"],
  tomas: ["compara com semana passada", "explica a variação", "alerta o Rodrigo"],
  gil: ["confirma fornecedor", "pede orçamento alternativo", "encaminha pro Rodrigo"],
  raul: ["aprofunda", "cruza com Bar Fácil", "sugere ação"],
};

function Bubble({ msg, agent }: { msg: ChatMessage; agent: AgentRecord }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={"flex max-w-[85%] flex-col gap-1 " + (isUser ? "self-end items-end" : "self-start items-start")}
    >
      <div
        className="rounded-lg px-3 py-2 text-[12px] leading-relaxed"
        style={{
          background: isUser ? "var(--color-surface-2)" : "var(--color-bg)",
          border: isUser ? "1px solid var(--color-border)" : "1px solid var(--color-border)",
          whiteSpace: "pre-wrap",
        }}
      >
        {msg.content}
      </div>
      <span className="text-[10px] text-[var(--color-text-dim)]">
        {isUser ? "tu" : agent.name} · {new Date(msg.ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}
