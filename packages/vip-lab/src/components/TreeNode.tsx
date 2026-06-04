import type { NodeTag, ProjectTreeNode } from "../project-tree";
import "../explorer.css";

const TAG_COLORS: Partial<Record<NodeTag, string>> = {
  stripe: "#7c3aed",
  auth: "#2563eb",
  quiz: "#db2777",
  lab: "#0891b2",
  db: "#059669",
  deploy: "#ea580c",
  config: "#64748b",
};

type TreeNodeProps = {
  node: ProjectTreeNode;
  depth: number;
  selectedId: string | null;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
};

export function TreeNode({
  node,
  depth,
  selectedId,
  expandedIds,
  onToggle,
  onSelect,
}: TreeNodeProps) {
  const hasChildren = Boolean(node.children?.length);
  const isOpen = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const primaryTag = node.tags?.[0];
  const icon =
    node.kind === "file" ? "📄" : node.kind === "root" ? "🌐" : "📁";

  function handleClick() {
    onSelect(node.id);
    if (hasChildren) onToggle(node.id);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <div role="treeitem" aria-expanded={hasChildren ? isOpen : undefined}>
      <button
        type="button"
        className={`tree-node-row${isSelected ? " selected" : ""}`}
        style={{ paddingLeft: `${0.5 + depth * 0.65}rem` }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-selected={isSelected}
      >
        <span
          className={`tree-chevron${hasChildren ? (isOpen ? " open" : "") : " placeholder"}`}
          aria-hidden
        >
          {hasChildren ? "▶" : ""}
        </span>
        <span className="tree-icon" aria-hidden>
          {icon}
        </span>
        <span className="tree-label">{node.name}</span>
        {primaryTag && (
          <span
            className="tree-tag-dot"
            style={{ background: TAG_COLORS[primaryTag] ?? "#94a3b8" }}
            title={primaryTag}
          />
        )}
      </button>
      {hasChildren && isOpen && (
        <div className="tree-children" role="group">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
