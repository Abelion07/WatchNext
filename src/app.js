window.WatchNext = window.WatchNext || {};

(function bootstrapWatchNext() {
  const { components, data, pages } = window.WatchNext;
  const app = document.querySelector("#app");
  const activePage = "dashboard";
  let spinning = false;
  let rotation = 0;

  function render() {
    app.innerHTML = `
      ${components.Nav(activePage)}
      <main>
        ${components.Page("landing", pages.LandingPage(), activePage)}
        ${components.Page("dashboard", pages.DashboardPage(), activePage)}
        ${components.Page("ai", pages.AiPage(), activePage)}
        ${components.Page("roulette", pages.RoulettePage(), activePage)}
        ${components.Page("analytics", pages.AnalyticsPage(), activePage)}
        ${components.Page("detail", pages.DetailPage(), activePage)}
      </main>
    `;
    bindDirectEvents();
  }

  function getPages() {
    return [...document.querySelectorAll(".page")];
  }

  function getNavLinks() {
    return [...document.querySelectorAll(".nav-link")];
  }

  function showPage(id) {
    getPages().forEach((page) => page.classList.toggle("active", page.id === id));
    getNavLinks().forEach((link) => link.classList.toggle("active", link.dataset.page === id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
  }

  function sendAiMessage() {
    const aiInput = document.querySelector("#aiInput");
    const conversation = document.querySelector("#conversation");
    const value = aiInput.value.trim();

    if (!value) return;

    conversation.insertAdjacentHTML("beforeend", components.Message({
      author: "user",
      content: escapeHtml(value),
    }));
    aiInput.value = "";

    setTimeout(() => {
      conversation.insertAdjacentHTML("beforeend", components.Message({
        content: 'Good direction. I would shortlist <strong style="color:var(--text1)">Annihilation</strong>, <strong style="color:var(--text1)">Moon</strong> and <strong style="color:var(--text1)">Coherence</strong>. Based on your taste, the safest pick tonight is <strong style="color:var(--text1)">Annihilation</strong>: atmospheric, strange, visual and under 2 hours.',
      }));
      conversation.scrollTop = conversation.scrollHeight;
    }, 520);

    conversation.scrollTop = conversation.scrollHeight;
  }

  function spinWheel() {
    const wheelSvg = document.querySelector("#wheelSvg");
    const pickedCard = document.querySelector("#pickedCard");

    if (spinning || !wheelSvg || !pickedCard) return;
    spinning = true;

    const picked = data.movies[Math.floor(Math.random() * data.movies.length)];
    const startRotation = rotation;
    const targetRotation = rotation + 1440 + Math.random() * 360;
    const start = performance.now();
    const duration = 2350;

    function animate(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = startRotation + (targetRotation - startRotation) * eased;
      wheelSvg.style.transform = `rotate(${current}deg)`;

      if (progress < 1) {
        requestAnimationFrame(animate);
        return;
      }

      rotation = targetRotation % 360;
      spinning = false;
      pickedCard.querySelector(".picked-emoji").textContent = picked.emoji;
      pickedCard.querySelector(".picked-title").textContent = picked.title;
      pickedCard.querySelector(".picked-meta").textContent = `${picked.meta} · Picked by roulette`;
      pickedCard.animate([
        { transform: "scale(1)", borderColor: "rgba(255,255,255,0.08)" },
        { transform: "scale(1.025)", borderColor: "rgba(168,85,247,0.65)" },
        { transform: "scale(1)", borderColor: "rgba(255,255,255,0.08)" },
      ], { duration: 650 });
    }

    requestAnimationFrame(animate);
  }

  function bindDirectEvents() {
    document.querySelector("#sendAi").addEventListener("click", sendAiMessage);
    document.querySelector("#aiInput").addEventListener("keydown", (event) => {
      if (event.key === "Enter") sendAiMessage();
    });
    document.querySelector("#spinBtn").addEventListener("click", spinWheel);
    document.querySelector("#spinAgain").addEventListener("click", spinWheel);
  }

  document.addEventListener("click", (event) => {
    const pageTrigger = event.target.closest("[data-page]");
    if (pageTrigger) showPage(pageTrigger.dataset.page);

    const filter = event.target.closest(".filter");
    if (filter) filter.classList.toggle("on");

    const suggestion = event.target.closest(".suggestion");
    if (suggestion) {
      document.querySelector("#aiInput").value = suggestion.textContent.trim();
      sendAiMessage();
    }
  });

  render();
})();
