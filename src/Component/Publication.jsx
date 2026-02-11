import React from "react";
import "./Publication.css";

const publications = [
  {
    projectName: "Adaptive Telepresence Robot Navigation",
    coAuthors: "Kryant Ye, Yaxin Hu, Bilge Mutlu",
    intro:
      "Designed an adaptive navigation strategy for telepresence robots to improve safety and social comfort in shared indoor spaces.",
  },
  {
    projectName: "Human-Aware Spatial Intent Prediction",
    coAuthors: "Kryant Ye, Yaxin Hu",
    intro:
      "Explored lightweight intent modeling from interaction context to predict user movement and support smoother robot path planning.",
  },
  {
    projectName: "Interactive Visual Analytics for Robot Studies",
    coAuthors: "Kryant Ye, Lab Team",
    intro:
      "Built a visual analytics prototype for summarizing experiment logs, participant feedback, and robot behavior patterns.",
  },
  {
    projectName: "Explainable HRI Behavior Feedback",
    coAuthors: "Kryant Ye, Research Collaborators",
    intro:
      "Investigated UI designs that explain robot decisions to users and reduce confusion during collaborative tasks.",
  },
];

export function Publication() {
  return (
    <div className="publication-section">
      <div className="publication-grid">
        {publications.map((item) => (
          <article className="publication-card" key={item.projectName}>
            <h3>{item.projectName}</h3>
            <p className="publication-authors">
              <strong>Co-authors:</strong> {item.coAuthors}
            </p>
            <p className="publication-intro">{item.intro}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
