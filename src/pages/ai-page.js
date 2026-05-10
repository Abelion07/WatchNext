window.WatchNext = window.WatchNext || {};
window.WatchNext.pages = window.WatchNext.pages || {};

window.WatchNext.pages.AiPage = function AiPage() {
  const { data, components } = window.WatchNext;
  const pills = components.ResultPills(data.resultPills);

  return `
    <div class="ai-layout">
      <div class="ai-main">
        <header class="ai-header">
          <h2>AI Recommendations</h2>
          <p>Tell WatchNext your mood, available time or exact craving.</p>
        </header>
        <div class="conversation" id="conversation">
          ${components.Message({
            content: "Hey Ábel! Based on your history — sci-fi, psychological thrillers and atmospheric dramas — I can help pick something for tonight. What are you feeling?",
          })}
          ${components.Message({
            author: "user",
            content: "Give me a dark sci-fi with great visuals. Under 2 hours.",
          })}
          ${components.Message({
            content: `Perfect. Here are 4 picks that match: dark, cinematic, smart and under 2 hours.${pills}`,
          })}
        </div>
        <div class="ai-input-area">
          ${components.Suggestions(data.suggestions)}
          <div class="input-row">
            <input id="aiInput" class="ai-input" placeholder="Ask anything... e.g. dark thriller for a rainy night" />
            <button class="btn-primary" id="sendAi">Send</button>
          </div>
        </div>
      </div>
      <aside class="ai-side">
        <div class="ai-card">
          <h3>Tonight Mode</h3>
          <p>Fast decision flow: choose mood, runtime and energy level. WatchNext gives one confident pick.</p>
        </div>
        <div class="ai-card">
          <h3>AI understands</h3>
          <ul>
            <li>mood</li>
            <li>runtime</li>
            <li>genre</li>
            <li>similar titles</li>
            <li>attention level</li>
          </ul>
        </div>
        <div class="ai-card">
          <h3>Recommendation logic</h3>
          <p>AI explains the pick, but the ranking can still come from your own scoring engine.</p>
        </div>
      </aside>
    </div>
  `;
};
