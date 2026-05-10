export function AiRecs() {
  return `
    <section id="ai" class="page">
        <div class="ai-layout">
          <div class="ai-main">
            <header class="ai-header">
              <h2>AI Recommendations</h2>
              <p>Tell WatchNext your mood, available time or exact craving.</p>
            </header>
            <div class="conversation" id="conversation">
              <div class="msg"><div class="msg-avatar ai">✦</div><div class="bubble">Hey Ábel! Based on your history — sci-fi, psychological thrillers and atmospheric dramas — I can help pick something for tonight. What are you feeling?</div></div>
              <div class="msg user"><div class="msg-avatar user">ÁB</div><div class="bubble">Give me a dark sci-fi with great visuals. Under 2 hours.</div></div>
              <div class="msg"><div class="msg-avatar ai">✦</div><div class="bubble">Perfect. Here are 4 picks that match: dark, cinematic, smart and under 2 hours.
                <div class="result-pills">
                  <div class="pill" data-page="detail"><span>🛸</span><div><div class="pill-title">Ex Machina</div><div class="pill-meta">2014 · 1h 48m</div></div></div>
                  <div class="pill"><span>🌊</span><div><div class="pill-title">Annihilation</div><div class="pill-meta">2018 · 1h 55m</div></div></div>
                  <div class="pill"><span>🧠</span><div><div class="pill-title">Moon</div><div class="pill-meta">2009 · 1h 37m</div></div></div>
                  <div class="pill"><span>⚡</span><div><div class="pill-title">Coherence</div><div class="pill-meta">2013 · 1h 29m</div></div></div>
                </div>
              </div></div>
            </div>
            <div class="ai-input-area">
              <div class="suggestions">
                <button class="suggestion">Something like Severance</button>
                <button class="suggestion">Funny movie under 90 min</button>
                <button class="suggestion">Comfort rewatch?</button>
                <button class="suggestion">Best of 2024</button>
                <button class="suggestion">I'm feeling anxious</button>
              </div>
              <div class="input-row">
                <input id="aiInput" class="ai-input" placeholder="Ask anything... e.g. dark thriller for a rainy night" />
                <button class="btn-primary" id="sendAi">Send</button>
              </div>
            </div>
          </div>
          <aside class="ai-side">
            <div class="ai-card"><h3>Tonight Mode</h3><p>Fast decision flow: choose mood, runtime and energy level. WatchNext gives one confident pick.</p></div>
            <div class="ai-card"><h3>AI understands</h3><ul><li>mood</li><li>runtime</li><li>genre</li><li>similar titles</li><li>attention level</li></ul></div>
            <div class="ai-card"><h3>Recommendation logic</h3><p>AI explains the pick, but the ranking can still come from your own scoring engine.</p></div>
          </aside>
        </div>
      </section>
    `;
}
