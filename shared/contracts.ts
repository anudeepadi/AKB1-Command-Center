export type ModuleId =
  | "brief"
  | "prompt"
  | "kpi"
  | "decision"
  | "arsenal"
  | "sprint"
  | "risk"
  | "builder"
  | "status"
  | "estimate"
  | "pricing"
  | "claude";

export type Tone = "brand" | "success" | "warning" | "danger" | "muted";
export type ModuleAvailability = "ready" | "draft" | "planned";
export type RoadmapStatus = "ready" | "next" | "planned";

export interface WorkspaceIdentity {
  name: string;
  email: string;
  provider: string;
  status: string;
  workspace: string;
  environment: string;
}

export interface NavigationItem {
  id: ModuleId;
  label: string;
  icon: string;
  description: string;
  section: string;
  accent: Tone;
  availability: ModuleAvailability;
}

export interface NavigationSection {
  id: string;
  label: string;
  items: NavigationItem[];
}

export interface DashboardStat {
  label: string;
  value: string;
  detail: string;
  tone: Tone;
}

export interface DashboardHighlight {
  title: string;
  body: string;
  detail: string;
  tone: Tone;
}

export interface RoadmapItem {
  title: string;
  detail: string;
  status: RoadmapStatus;
}

export interface ChatSessionSummary {
  id: string;
  title: string;
  source: string;
  preview: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: number;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface InsertChatMessage {
  sessionId: string;
  role: "user" | "assistant";
  content: string;
}

export interface ToolDraftRecord<T = unknown> {
  toolId: string;
  payload: T | null;
  updatedAt: string | null;
}

export interface BootstrapData {
  generatedAt: string;
  identity: WorkspaceIdentity;
  sections: NavigationSection[];
  stats: DashboardStat[];
  highlights: DashboardHighlight[];
  roadmap: RoadmapItem[];
  recentSessions: ChatSessionSummary[];
}

export interface CreateChatSessionInput {
  title?: string;
  source?: string;
}
