import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  ModuleId,
  NavigationSection,
  WorkspaceIdentity,
} from "@shared/contracts";
import Sidebar from "@/components/Sidebar";
import TabContent from "@/components/TabContent";
import ClaudePanel from "@/components/ClaudePanel";
import CommandPalette from "@/components/CommandPalette";
import Toast from "@/components/Toast";
import type { ShowToast, ToastInput, ToastState } from "@/lib/toast";

interface Props {
  sections: NavigationSection[];
  identity?: WorkspaceIdentity;
  activeTab: ModuleId;
  setActiveTab: (tab: ModuleId) => void;
  claudeOpen: boolean;
  setClaude: (value: boolean) => void;
  onOpenCmd: () => void;
  cmdOpen: boolean;
  setCmdOpen: (value: boolean) => void;
  isMobile: boolean;
}

const ASSISTANT_PANEL_WIDTHS = [420, 520, 640] as const;
const ASSISTANT_PANEL_LABELS = ["Narrow", "Standard", "Wide"] as const;

export default function Terminal({
  sections,
  identity,
  activeTab,
  setActiveTab,
  claudeOpen,
  setClaude,
  onOpenCmd,
  cmdOpen,
  setCmdOpen,
  isMobile,
}: Props) {
  const [toast, setToast] = useState<ToastState>({
    id: 0,
    title: "",
    visible: false,
    tone: "info",
  });
  const [assistantPanelSizeIndex, setAssistantPanelSizeIndex] = useState(1);
  const [assistantPanelMinimized, setAssistantPanelMinimized] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const toastTimer = useRef<number | null>(null);

  const dismissToast = () => {
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
      toastTimer.current = null;
    }

    setToast((state) => ({ ...state, visible: false, action: undefined }));
  };

  const normalizeToast = (input: ToastInput) => {
    if (typeof input !== "string") return input;

    const message = input.trim();
    if (!message) {
      return {
        title: "Update",
      };
    }

    const isError =
      /^error:/i.test(message) ||
      /failed|request failed|unable to|could not|no response stream/i.test(
        message,
      );

    if (isError) {
      return {
        title: "Something went wrong",
        description: message.replace(/^error:\s*/i, ""),
        tone: "error" as const,
      };
    }

    return {
      title: message,
      tone: "info" as const,
    };
  };

  const showToast: ShowToast = (input) => {
    const next = normalizeToast(input);

    setToast({
      id: Date.now(),
      visible: true,
      title: next.title,
      description: next.description,
      tone: next.tone || "info",
      action: next.action,
      autoHideMs: next.autoHideMs,
    });

    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
      toastTimer.current = null;
    }

    const autoHideMs =
      next.autoHideMs ?? (next.tone === "error" || next.action ? 0 : 2600);

    if (autoHideMs > 0) {
      toastTimer.current = window.setTimeout(() => {
        setToast((state) => ({ ...state, visible: false, action: undefined }));
      }, autoHideMs);
    }
  };

  const handleToastAction = () => {
    const action = toast.action;
    dismissToast();
    action?.onClick();
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        onOpenCmd();
      }

      if ((event.metaKey || event.ctrlKey) && event.key === "\\") {
        event.preventDefault();

        if (isMobile) {
          setActiveTab("claude");
          return;
        }

        setClaude(!claudeOpen);
      }

      if (event.key === "Escape") {
        setCmdOpen(false);
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [claudeOpen, isMobile, onOpenCmd, setActiveTab, setClaude, setCmdOpen]);

  useEffect(() => {
    if (!isMobile) {
      setMobileSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!claudeOpen || activeTab === "claude" || isMobile) {
      setAssistantPanelMinimized(false);
    }
  }, [activeTab, claudeOpen, isMobile]);

  useEffect(
    () => () => {
      if (toastTimer.current) {
        window.clearTimeout(toastTimer.current);
      }
    },
    [],
  );

  const showSideAssistant = claudeOpen && activeTab !== "claude" && !isMobile;
  const assistantPanelWidth = ASSISTANT_PANEL_WIDTHS[assistantPanelSizeIndex];
  const assistantPanelLabel = ASSISTANT_PANEL_LABELS[assistantPanelSizeIndex];

  return (
    <div className="terminal-shell">
      <div className="workspace-frame">
        <Sidebar
          sections={sections}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed && !isMobile}
          mobileOpen={mobileSidebarOpen}
          onToggleCollapse={() => {
            if (isMobile) {
              setMobileSidebarOpen(false);
              return;
            }

            setSidebarCollapsed((collapsed) => !collapsed);
          }}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          identity={identity}
        />

        <main className="workspace-main">
          <header className="workspace-header">
            <div className="workspace-header-main">
              {isMobile && (
                <button
                  className="workspace-mobile-toggle"
                  onClick={() => setMobileSidebarOpen(true)}
                  aria-label="Open navigation"
                >
                  ☰
                </button>
              )}
            </div>

            <div className="workspace-header-actions">
              <span className="topbar-chip tone-muted">
                {identity?.environment || "SQLite + Gemini"}
              </span>
              <button className="ak-btn-secondary" onClick={onOpenCmd}>
                Command
              </button>
              {activeTab !== "claude" && (
                <button
                  className="ak-btn-secondary"
                  onClick={() => setActiveTab("claude")}
                >
                  Open Gemini
                </button>
              )}
            </div>
          </header>

          <div className="workspace-content">
            <div className="module-surface">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 250,
                    duration: 0.2,
                  }}
                >
                  <TabContent
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    showToast={showToast}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>

        <AnimatePresence>
          {showSideAssistant && !assistantPanelMinimized && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, width: assistantPanelWidth }}
              exit={{ opacity: 0, y: 24, scale: 0.94 }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="assistant-panel-dock"
            >
              <ClaudePanel
                mode="panel"
                onClose={() => setAssistantPanelMinimized(true)}
                onResize={() =>
                  setAssistantPanelSizeIndex(
                    (index) => (index + 1) % ASSISTANT_PANEL_WIDTHS.length,
                  )
                }
                resizeLabel={assistantPanelLabel}
                closeLabel="Minimize"
                showToast={showToast}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSideAssistant && assistantPanelMinimized && (
            <motion.button
              type="button"
              className="assistant-minimized-trigger"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
              onClick={() => setAssistantPanelMinimized(false)}
              data-testid="button-expand-claude"
            >
              <span className="assistant-minimized-title">Gemini chat</span>
              <span className="assistant-minimized-meta">
                Expand · Size {assistantPanelLabel}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {cmdOpen && (
          <CommandPalette
            sections={sections}
            onClose={() => setCmdOpen(false)}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setCmdOpen(false);
            }}
            toggleClaude={() => {
              if (isMobile) {
                setActiveTab("claude");
                setCmdOpen(false);
                return;
              }

              setClaude(!claudeOpen);
            }}
          />
        )}
      </AnimatePresence>

      <Toast
        toast={toast}
        onDismiss={dismissToast}
        onAction={handleToastAction}
      />
    </div>
  );
}
