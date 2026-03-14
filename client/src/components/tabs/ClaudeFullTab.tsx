import ClaudePanel from "../ClaudePanel";
import type { ShowToast } from "@/lib/toast";

interface Props {
  showToast: ShowToast;
}

export default function ClaudeFullTab({ showToast }: Props) {
  return (
    <div className="claude-page-shell">
      <div className="claude-page-frame">
        <ClaudePanel mode="page" showToast={showToast} />
      </div>
    </div>
  );
}
