export function Analytics() {
  return `
    <section id="analytics" class="page">
        <div class="analytics-page">
          <div class="taste-hero">
            <div><h2>Your taste profile</h2><p>Based on 247 films and 38 series</p><div class="tags"><span class="tag purple">Sci-fi obsessive</span><span class="tag blue">Thoughtful viewer</span><span class="tag red">Slow-burn fan</span><span class="tag purple">Atmospheric</span></div></div>
            <div class="score"><div>8.1</div><div>average rating</div></div>
          </div>
          <div class="charts">
            <div class="chart-card"><div class="chart-title">Top genres</div><div class="mini-list"><div class="mini-row"><div class="dot" style="background:var(--purple-light)"></div><strong>Sci-fi</strong><span>34%</span></div><div class="mini-row"><div class="dot" style="background:var(--blue-light)"></div><strong>Thriller</strong><span>22%</span></div><div class="mini-row"><div class="dot" style="background:var(--green)"></div><strong>Drama</strong><span>18%</span></div><div class="mini-row"><div class="dot" style="background:var(--gold)"></div><strong>Horror</strong><span>12%</span></div></div></div>
            <div class="chart-card"><div class="chart-title">Monthly films watched</div><div class="bar-row"><span>Jan</span><div class="bar-track"><div class="bar" style="width:55%"></div></div><span>11</span></div><div class="bar-row"><span>Feb</span><div class="bar-track"><div class="bar" style="width:95%"></div></div><span>19</span></div><div class="bar-row"><span>Mar</span><div class="bar-track"><div class="bar" style="width:40%"></div></div><span>8</span></div><div class="bar-row"><span>Apr</span><div class="bar-track"><div class="bar" style="width:65%"></div></div><span>13</span></div></div>
            <div class="chart-card"><div class="chart-title">Favourite directors</div><div class="mini-list"><div class="mini-row"><div class="avatar">DV</div><strong>Denis Villeneuve</strong><span>8 films</span></div><div class="mini-row"><div class="avatar">CN</div><strong>Christopher Nolan</strong><span>7 films</span></div><div class="mini-row"><div class="avatar">AG</div><strong>Alex Garland</strong><span>4 films</span></div></div></div>
            <div class="chart-card"><div class="chart-title">✦ AI taste summary</div><p class="summary">You prefer cerebral sci-fi and atmospheric thrillers with slow-burn pacing, visual worldbuilding, ambiguous endings and philosophical tension. Friday evenings are your strongest watch window.</p></div>
          </div>
        </div>
      </section>
    `;
}
