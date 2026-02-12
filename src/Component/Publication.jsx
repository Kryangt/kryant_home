import React from "react";
import "./Publication.css";

const publications = [
  {
    projectName: "Co-designing Robots through in-situ Bodystorming to Support Cultural Institution Volunteers",
    coAuthors: "Yaxin Hu, Hui-Ru Ho, Chenming Ye, Bilge Mutlu.",
    intro:
      "Explored new method of designing human robot interaction in public facilities, and tried to propose a guideline for designing robot in public spaces",
  },
  {
    projectName: "NarraGuide: an LLM-based Narrative Mobile Robot for Remote Place Exploration",
    coAuthors: "Yaxin Hu, Arissa J. Sato, Jingxin Du, Chenming Ye, Anjun Zhu, Pragathi Praveena, and Bilge Mutlu",
    intro:
      "Explored how can the location based narrative LLM techniques on mobile robots can help the experience of remote space exploration",
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
