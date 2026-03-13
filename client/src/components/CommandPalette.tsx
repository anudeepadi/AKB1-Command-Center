import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { ModuleId, NavigationSection } from "@shared/contracts";

interface Props {
  onClose: () => void;
  sections: NavigationSection[];
  setActiveTab: (tab: ModuleId) => void;
  toggleClaude: () => void;
}

interface CommandItem {
  id: ModuleId | "assistant";
  label: string;
  icon: string;
  desc: string;
  section: string;
}

export default function CommandPalette({ onClose, sections, setActiveTab, toggleClaude }: Props) {
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const commands: CommandItem[] = [
    {
      id: "assistant",
      label: "Toggle Assistant Panel",
      icon: "◆",
      desc: "Open or close the Gemini side panel",
      section: "Workspace",
    },
    ...sections.flatMap((section) =>
      section.items.map((item) => ({
        id: item.id,
        label: item.label,
        icon: item.icon,
        desc: item.description,
        section: section.label,
      })),
    ),
  ];

  const filtered = commands.filter((command) => {
    const value = `${command.label} ${command.desc} ${command.section}`.toLowerCase();
    return value.includes(query.toLowerCase());
  });

  useEffect(() => {
    setSel(0);
  }, [query]);

  const execute = (command: CommandItem) => {
    if (command.id === "assistant") {
      toggleClaude();
      onClose();
      return;
    }

    setActiveTab(command.id);
    onClose();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSel((current) => Math.min(current + 1, filtered.length - 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSel((current) => Math.max(current - 1, 0));
    }

    if (event.key === "Enter" && filtered[sel]) {
      execute(filtered[sel]);
    }

    if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <motion.div
      className="cmd-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <motion.div
        className="cmd-box"
        initial={{ opacity: 0, scale: 0.95, y: -16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
      >
        <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--border-c)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sub)" strokeWidth="1.8" style={{ marginLeft: 16, flexShrink: 0 }}>
            <circle cx="6.5" cy="6.5" r="4.5" />
            <line x1="10" y1="10" x2="14" y2="14" />
          </svg>
          <input
            ref={inputRef}
            className="cmd-input"
            style={{ borderBottom: "none", paddingLeft: 10 }}
            placeholder="Type a command or module name..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            data-testid="cmd-input"
          />
          <button onClick={onClose} style={{ padding: "0 16px", color: "var(--sub)", fontSize: "11px", flexShrink: 0, background: "var(--surf-2)", margin: "8px", borderRadius: "6px", border: "1px solid var(--border-c)", height: "26px" }}>ESC</button>
        </div>

        <div style={{ maxHeight: "340px", overflowY: "auto" }}>
          {filtered.length === 0 && (
            <div style={{ padding: "28px", textAlign: "center", color: "var(--sub)", fontSize: "13px" }}>
              No results for "{query}"
            </div>
          )}

          {filtered.map((command, index) => (
            <div
              key={`${command.id}-${command.label}`}
              className={`cmd-item ${index === sel ? "selected" : ""}`}
              onClick={() => execute(command)}
              onMouseEnter={() => setSel(index)}
              data-testid={`cmd-${command.id}`}
            >
              <span style={{ fontSize: "16px", width: 24, textAlign: "center", flexShrink: 0 }}>{command.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em" }}>{command.label}</div>
                <div style={{ fontSize: "11px", color: "var(--sub)", marginTop: "1px" }}>{command.desc}</div>
                <div style={{ fontSize: "10px", color: "var(--sub-2)", marginTop: "4px" }}>{command.section}</div>
              </div>
              {index === sel && (
                <span style={{ fontSize: "10px", color: "var(--sub-2)", flexShrink: 0, background: "var(--surf-2)", padding: "2px 7px", borderRadius: "5px", border: "1px solid var(--border-c)" }}>↵</span>
              )}
            </div>
          ))}
        </div>

        <div className="cmd-footer">
          <span><span className="cmd-key">↑↓</span>navigate</span>
          <span><span className="cmd-key">↵</span>open</span>
          <span><span className="cmd-key">ESC</span>close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
