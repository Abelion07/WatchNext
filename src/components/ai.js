window.WatchNext = window.WatchNext || {};
window.WatchNext.components = window.WatchNext.components || {};

window.WatchNext.components.Message = function Message({ author = "ai", content }) {
  const avatar = author === "user" ? "ÁB" : "✦";
  return `
    <div class="msg${author === "user" ? " user" : ""}">
      <div class="msg-avatar ${author}">${avatar}</div>
      <div class="bubble">${content}</div>
    </div>
  `;
};

window.WatchNext.components.ResultPills = function ResultPills(items) {
  return `
    <div class="result-pills">
      ${items.map((item) => `
        <div class="pill"${item.page ? ` data-page="${item.page}"` : ""}>
          <span>${item.emoji}</span>
          <div>
            <div class="pill-title">${item.title}</div>
            <div class="pill-meta">${item.meta}</div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
};

window.WatchNext.components.Suggestions = function Suggestions(items) {
  return `<div class="suggestions">${items.map((item) => `<button class="suggestion">${item}</button>`).join("")}</div>`;
};
