import { useCallback, useState } from "react";
import { NODE_INDEX, PROJECT_TREE } from "../project-tree";
import { NodeDetailPanel } from "./NodeDetailPanel";
import { TreeNode } from "./TreeNode";
import "../explorer.css";

type ProjectExplorerProps = {
  onGoToLabStep: (step: number) => void;
};

function expandAncestors(id: string, expanded: Set<string>): Set<string> {
  const next = new Set(expanded);
  next.add("root");
  if (NODE_INDEX.has(id)) next.add(id);
  const slash = id.lastIndexOf("/");
  if (slash > 0) {
    return expandAncestors(id.slice(0, slash), next);
  }
  return next;
}

export function ProjectExplorer({ onGoToLabStep }: ProjectExplorerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(["root", "apps/web", "apps/web/src/app"])
  );

  const onToggle = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const onSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const onSelectRelated = useCallback((id: string) => {
    setSelectedId(id);
    setExpandedIds((prev) => expandAncestors(id, prev));
  }, []);

  return (
    <div className="explorer">
      <aside className="explorer-tree" role="tree" aria-label="Cấu trúc dự án">
        <p className="explorer-tree-title">Cây thư mục dự án</p>
        <TreeNode
          node={PROJECT_TREE}
          depth={0}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onToggle={onToggle}
          onSelect={onSelect}
        />
      </aside>
      <NodeDetailPanel
        selectedId={selectedId}
        onGoToLabStep={onGoToLabStep}
        onSelectNode={onSelectRelated}
      />
    </div>
  );
}
