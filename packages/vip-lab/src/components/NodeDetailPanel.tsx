import { NODE_INDEX, type NodeTag } from "../project-tree";
import "../explorer.css";

const TAG_LABELS: Record<NodeTag, string> = {
  stripe: "Stripe",
  auth: "Auth",
  quiz: "Quiz",
  lab: "VIP Lab",
  db: "Database",
  deploy: "Deploy",
  config: "Config",
};

type NodeDetailPanelProps = {
  selectedId: string | null;
  onGoToLabStep: (step: number) => void;
  onSelectNode: (id: string) => void;
};

function primaryTagClass(tags?: NodeTag[]): string {
  const t = tags?.[0];
  return t ? `tag-${t}` : "";
}

export function NodeDetailPanel({
  selectedId,
  onGoToLabStep,
  onSelectNode,
}: NodeDetailPanelProps) {
  if (!selectedId) {
    return (
      <div className="explorer-detail empty">
        <p>
          Chọn một thư mục hoặc file trong cây bên trái để xem vai trò và mục đích
          trong dự án web + Stripe.
        </p>
      </div>
    );
  }

  const node = NODE_INDEX.get(selectedId);
  if (!node) {
    return (
      <div className="explorer-detail empty">
        <p>Không tìm thấy mô tả cho mục này.</p>
      </div>
    );
  }

  return (
    <div className="explorer-detail">
      <article className={`explorer-detail-card ${primaryTagClass(node.tags)}`}>
        <h3 className="detail-name">{node.name}</h3>
        <p className="detail-path">{node.id}</p>
        <p className="detail-summary">{node.summary}</p>
        <p className="detail-description">{node.description}</p>

        {node.tags && node.tags.length > 0 && (
          <div className="detail-tags">
            {node.tags.map((tag) => (
              <span key={tag} className={`tag-pill ${tag}`}>
                {TAG_LABELS[tag]}
              </span>
            ))}
          </div>
        )}

        <div className="detail-actions">
          {node.relatedLabSteps?.map((step) => (
            <button
              key={step}
              type="button"
              className="btn-lab-step"
              onClick={() => onGoToLabStep(step)}
            >
              Đến bước lab {step}
            </button>
          ))}
        </div>

        {node.relatedPaths && node.relatedPaths.length > 0 && (
          <div className="detail-related-paths">
            <strong>Liên quan:</strong>
            <ul>
              {node.relatedPaths.map((pathId) => {
                const related = NODE_INDEX.get(pathId);
                const label = related?.name ?? pathId;
                return (
                  <li key={pathId}>
                    <button type="button" onClick={() => onSelectNode(pathId)}>
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </article>
    </div>
  );
}
