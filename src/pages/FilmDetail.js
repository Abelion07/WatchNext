export function FilmDetail() {
  return `
    <section id="detail" class="page">
        <div class="detail-hero">
          <div class="detail-meta">
            <div class="detail-poster">🤖</div>
            <div class="detail-info"><h2>Ex Machina</h2><p>2014 · Alex Garland · A24 · 1h 48m</p><p><span style="color:var(--gold);font-weight:800">★ 7.7</span> IMDb · Your rating: <span style="color:var(--purple-light);font-weight:800">9/10</span></p><div class="tags"><span class="tag purple">Sci-fi</span><span class="tag blue">Thriller</span><span class="tag red">Drama</span></div></div>
          </div>
        </div>
        <div class="detail-body">
          <div>
            <div class="detail-actions"><select class="status-select"><option>✓ Completed</option><option>▶ Watching</option><option>📋 Planned</option><option>⟳ Rewatching</option><option>⏸ On Hold</option><option>✗ Dropped</option></select><button class="btn-small primary">+ Watchlist</button><button class="btn-small ghost">♡ Favourite</button><button class="btn-small ghost">▶ Trailer</button></div>
            <div class="panel"><h3>Synopsis</h3><p>A programmer is selected to participate in a ground-breaking experiment in artificial intelligence by evaluating the human qualities of a highly advanced humanoid A.I. A taut, cerebral thriller with stunning production design.</p></div>
            <div style="height:14px"></div>
            <div class="panel"><h3>Cast</h3><div class="cast"><div class="cast-card"><div class="cast-avatar">🧑</div><div>Domhnall Gleeson</div></div><div class="cast-card"><div class="cast-avatar">🤖</div><div>Alicia Vikander</div></div><div class="cast-card"><div class="cast-avatar">👨</div><div>Oscar Isaac</div></div><div class="cast-card"><div class="cast-avatar">👩</div><div>Sonoya Mizuno</div></div></div></div>
          </div>
          <aside>
            <div class="panel"><h3>✦ Why recommended</h3><p>You rated Annihilation and Arrival highly. Ex Machina matches your preference for slow-burn sci-fi, philosophical tension, compact runtime and visually clean production design.</p></div>
            <div style="height:14px"></div>
            <div class="panel"><h3>Where to watch</h3><div class="tags"><span class="tag red">Netflix</span><span class="tag blue">Prime</span></div></div>
            <div style="height:14px"></div>
            <div class="panel"><h3>Your notes</h3><textarea placeholder="Add a personal note about this film..."></textarea></div>
          </aside>
        </div>
      </section>`;
}
