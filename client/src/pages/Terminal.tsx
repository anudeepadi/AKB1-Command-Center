import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  ModuleId,
  NavigationItem,
  NavigationSection,
  WorkspaceIdentity,
} from "@shared/contracts";
import Sidebar from "@/components/Sidebar";
import TabContent from "@/components/TabContent";
import ClaudePanel from "@/components/ClaudePanel";
import CommandPalette from "@/components/CommandPalette";
import Toast from "@/components/Toast";

export interface ToastState {
  msg: string;
  visible: boolean;
}

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

function flattenModules(sections: NavigationSection[]): NavigationItem[] {
  return sections.flatMap((section) => section.items);
}

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
  const [toast, setToast] = useState<ToastState>({ msg: "", visible: false });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const toastTimer = useRef<number | null>(null);
  const modules = flattenModules(sections);
  const activeModule = modules.find((module) => module.id === activeTab);

  const showToast = (msg: string) => {
    setToast({ msg, visible: true });
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
    }
    toastTimer.current = window.setTimeout(() => {
      setToast((state) => ({ ...state, visible: false }));
    }, 2200);
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

  const showSideAssistant = claudeOpen && activeTab !== "claude" && !isMobile;

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

              <div>
                <div className="workspace-section-label">
                  {activeModule?.section || "Workspace"}
                </div>
                <h1 className="workspace-title">
                  {activeModule?.label || "Command Center"}
                </h1>
                <p className="workspace-description">
                  {activeModule?.description ||
                    "Consistent delivery workbench with backend-backed navigation."}
                </p>
              </div>
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
          {showSideAssistant && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 520, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="assistant-panel-shell"
            >
              <ClaudePanel
                mode="panel"
                onClose={() => setClaude(false)}
                showToast={showToast}
              />
            </motion.div>
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

      <Toast toast={toast} />
    </div>
  );
}
