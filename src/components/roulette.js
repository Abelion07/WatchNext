window.WatchNext = window.WatchNext || {};
window.WatchNext.components = window.WatchNext.components || {};

window.WatchNext.components.Filters = function Filters(items) {
  return `
    <div class="filters">
      ${items.map((item) => `<button class="filter${item.active ? " on" : ""}">${item.label}</button>`).join("")}
    </div>
  `;
};

window.WatchNext.components.Wheel = function Wheel() {
  return `
    <div class="wheel-wrap">
      <div class="wheel">
        <svg id="wheelSvg" viewBox="0 0 300 300">
          <defs>
            <clipPath id="clip"><circle cx="150" cy="150" r="146" /></clipPath>
          </defs>
          <g clip-path="url(#clip)">
            <path d="M150,150 L150,4 A146,146 0 0,1 253.2,46.8 Z" fill="#3b0f8c" />
            <path d="M150,150 L253.2,46.8 A146,146 0 0,1 296,150 Z" fill="#5b21b6" />
            <path d="M150,150 L296,150 A146,146 0 0,1 253.2,253.2 Z" fill="#7c3aed" />
            <path d="M150,150 L253.2,253.2 A146,146 0 0,1 150,296 Z" fill="#9333ea" />
            <path d="M150,150 L150,296 A146,146 0 0,1 46.8,253.2 Z" fill="#6d28d9" />
            <path d="M150,150 L46.8,253.2 A146,146 0 0,1 4,150 Z" fill="#4c1d95" />
            <path d="M150,150 L4,150 A146,146 0 0,1 46.8,46.8 Z" fill="#7c3aed" />
            <path d="M150,150 L46.8,46.8 A146,146 0 0,1 150,4 Z" fill="#5b21b6" />
          </g>
          <circle cx="150" cy="150" r="146" fill="none" stroke="rgba(255,255,255,.16)" />
          <text x="150" y="42" text-anchor="middle" fill="white" font-size="11">Arrival</text>
          <text x="238" y="88" text-anchor="middle" fill="white" font-size="11">Prisoners</text>
          <text x="250" y="155" text-anchor="middle" fill="white" font-size="11">Moon</text>
          <text x="218" y="225" text-anchor="middle" fill="white" font-size="11">Coherence</text>
          <text x="143" y="270" text-anchor="middle" fill="white" font-size="11">Annihilation</text>
          <text x="65" y="223" text-anchor="middle" fill="white" font-size="11">Parasite</text>
          <text x="45" y="156" text-anchor="middle" fill="white" font-size="11">Blade Runner</text>
          <text x="70" y="82" text-anchor="middle" fill="white" font-size="11">Ex Machina</text>
          <polygon points="150,5 141,24 159,24" fill="#fbbf24" />
        </svg>
        <button id="spinBtn" class="spin">SPIN</button>
      </div>
    </div>
  `;
};

window.WatchNext.components.PickedCard = function PickedCard(item) {
  return `
    <div class="picked-card" id="pickedCard">
      <div class="picked-emoji">${item.emoji}</div>
      <div>
        <div class="picked-title">${item.title}</div>
        <div class="picked-meta">${item.meta} · Perfect for tonight</div>
        <div class="picked-actions">
          <button class="btn-small primary" data-page="detail">View details</button>
          <button class="btn-small ghost" id="spinAgain">Spin again</button>
        </div>
      </div>
    </div>
  `;
};
