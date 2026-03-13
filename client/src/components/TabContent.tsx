import type { ModuleId } from "@shared/contracts";
import BriefTab from "./tabs/BriefTab";
import PromptTab from "./tabs/PromptTab";
import KpiTab from "./tabs/KpiTab";
import DecisionTab from "./tabs/DecisionTab";
import ArsenalTab from "./tabs/ArsenalTab";
import SprintTab from "./tabs/SprintTab";
import RiskTab from "./tabs/RiskTab";
import BuilderTab from "./tabs/BuilderTab";
import StatusTab from "./tabs/StatusTab";
import EstimateTab from "./tabs/EstimateTab";
import PricingTab from "./tabs/PricingTab";
import ClaudeFullTab from "./tabs/ClaudeFullTab";

interface Props {
  activeTab: ModuleId;
  setActiveTab: (tab: ModuleId) => void;
  showToast: (msg: string) => void;
}

export default function TabContent({ activeTab, setActiveTab, showToast }: Props) {
  switch (activeTab) {
    case "brief":
      return <BriefTab showToast={showToast} setActiveTab={setActiveTab} />;
    case "prompt":
      return <PromptTab showToast={showToast} />;
    case "kpi":
      return <KpiTab showToast={showToast} />;
    case "decision":
      return <DecisionTab showToast={showToast} />;
    case "arsenal":
      return <ArsenalTab />;
    case "sprint":
      return <SprintTab showToast={showToast} />;
    case "risk":
      return <RiskTab showToast={showToast} />;
    case "builder":
      return <BuilderTab showToast={showToast} />;
    case "status":
      return <StatusTab showToast={showToast} />;
    case "estimate":
      return <EstimateTab showToast={showToast} />;
    case "pricing":
      return <PricingTab showToast={showToast} />;
    case "claude":
      return <ClaudeFullTab showToast={showToast} />;
    default:
      return null;
  }
}
