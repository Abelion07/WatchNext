const scripts = [
  "src/data/app-data.js",
  "src/components/layout.js",
  "src/components/cards.js",
  "src/components/ai.js",
  "src/components/roulette.js",
  "src/pages/landing.js",
  "src/pages/dashboard.js",
  "src/pages/ai-page.js",
  "src/pages/roulette.js",
  "src/pages/analytics.js",
  "src/pages/detail.js",
  "src/app.js",
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Could not load ${src}`));
    document.body.appendChild(script);
  });
}

async function loadApp() {
  for (const script of scripts) {
    await loadScript(script);
  }
}

loadApp();
