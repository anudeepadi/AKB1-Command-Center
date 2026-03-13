import ClaudePanel from "../ClaudePanel";

interface Props { showToast: (msg: string) => void; }

export default function ClaudeFullTab({ showToast }: Props) {
  return (
    <div className="claude-page-shell">
      <div className="claude-page-frame">
        <ClaudePanel mode="page" showToast={showToast} />
      </div>
    </div>
  );
}
