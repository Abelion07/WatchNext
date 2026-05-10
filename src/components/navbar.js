export default function Navbar() {
  return `
    <nav class="nav">
      <div class="logo"><span>Watch</span><span>Next</span></div>
      <div class="nav-links">
        <button class="nav-link" data-page="landing">Landing</button>
        <button class="nav-link active" data-page="dashboard">Dashboard</button>
        <button class="nav-link" data-page="ai">AI Recs</button>
        <button class="nav-link" data-page="roulette">Roulette</button>
        <button class="nav-link" data-page="analytics">Analytics</button>
        <button class="nav-link" data-page="detail">Film Detail</button>
      </div>
      <div class="nav-search">⌕ Search...</div>
      <div class="avatar">ÁB</div>
    </nav>
    `;
}
