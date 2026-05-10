window.WatchNext = window.WatchNext || {};
window.WatchNext.components = window.WatchNext.components || {};

window.WatchNext.components.Nav = function Nav(activePage) {
  const { navItems } = window.WatchNext.data;
  const links = navItems
    .map((item) => `
      <button class="nav-link${item.id === activePage ? " active" : ""}" data-page="${item.id}">${item.label}</button>
    `)
    .join("");

  return `
    <nav class="nav">
      <div class="logo"><span>Watch</span><span>Next</span></div>
      <div class="nav-links">${links}</div>
      <div class="nav-search">⌕ Search...</div>
      <div class="avatar">ÁB</div>
    </nav>
  `;
};

window.WatchNext.components.Page = function Page(id, content, activePage) {
  return `<section id="${id}" class="page${id === activePage ? " active" : ""}">${content}</section>`;
};

window.WatchNext.components.SectionHeader = function SectionHeader(title, linkText, page) {
  const pageAttr = page ? ` data-page="${page}"` : "";
  return `
    <div class="section">
      <div class="section-head">
        <div class="section-title">${title}</div>
        <div class="section-link"${pageAttr}>${linkText}</div>
      </div>
    </div>
  `;
};

window.WatchNext.components.Tags = function Tags(tags) {
  return `<div class="tags">${tags.map((tag) => `<span class="tag ${tag.color}">${tag.label}</span>`).join("")}</div>`;
};
