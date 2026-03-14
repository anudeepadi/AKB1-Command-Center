import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import type { BootstrapData, ModuleId } from "@shared/contracts";
import { useIsMobile } from "@/hooks/use-mobile";
import TopNav from "@/components/TopNav";
import HomePage from "@/pages/HomePage";
import Terminal from "@/pages/Terminal";

async function fetchBootstrap(): Promise<BootstrapData> {
  const res = await fetch("/api/bootstrap");
  if (!res.ok) {
    throw new Error(`Failed to load workspace bootstrap: ${res.status}`);
  }

  return res.json();
}

export default function App() {
  const [page, setPage] = useState<"home" | "terminal">("home");
  const [activeTab, setActiveTab] = useState<ModuleId>("brief");
  const [claudeOpen, setClaudeOpen] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);
  const isMobile = useIsMobile();
  const bootstrapQuery = useQuery<BootstrapData>({
    queryKey: ["/api/bootstrap"],
    queryFn: fetchBootstrap,
    staleTime: 15_000,
  });

  useEffect(() => {
    if (isMobile) {
      setClaudeOpen(false);
    }
  }, [isMobile]);

  const launchWorkspace = (tab: ModuleId = activeTab) => {
    setActiveTab(tab);
    setPage("terminal");

    if (isMobile) {
      setClaudeOpen(false);
    }
  };

  const toggleClaude = () => {
    if (isMobile) {
      setPage("terminal");
      setActiveTab("claude");
      return;
    }

    setPage("terminal");
    setClaudeOpen((open) => !open);
  };

  return (
    <>
      <TopNav
        page={page}
        onNavigate={setPage}
        identity={bootstrapQuery.data?.identity}
        claudeOpen={claudeOpen}
        onToggleClaude={toggleClaude}
        onOpenCmd={() => setCmdOpen(true)}
        isMobile={isMobile}
      />

      <AnimatePresence mode="wait">
        {page === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <HomePage
              data={bootstrapQuery.data}
              isLoading={bootstrapQuery.isLoading}
              onLaunch={launchWorkspace}
            />
          </motion.div>
        ) : (
          <motion.div
            key="terminal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ height: "100dvh", overflow: "hidden" }}
          >
            <Terminal
              sections={bootstrapQuery.data?.sections ?? []}
              identity={bootstrapQuery.data?.identity}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              claudeOpen={claudeOpen}
              setClaude={setClaudeOpen}
              onOpenCmd={() => setCmdOpen(true)}
              cmdOpen={cmdOpen}
              setCmdOpen={setCmdOpen}
              isMobile={isMobile}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
