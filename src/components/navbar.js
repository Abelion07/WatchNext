export default function Navbar() {
  return `
    <nav class="nav">
      <div class="logo"><span>Watch</span><span>Next</span></div>
      <div class="nav-links">
        <button class="nav-link" data-page="landing"><span>⌂</span>Landing</button>
        <button class="nav-link active" data-page="dashboard"><span>◉</span>Dashboard</button>
        <button class="nav-link" data-page="ai"><span>✦</span>AI Recs</button>
        <button class="nav-link" data-page="detail"><span>□</span>Film Detail</button>
      </div>

      <button class="avatar" data-page="analytics" class="nav-link">ÁB</button>
    </nav>
    `;
}
