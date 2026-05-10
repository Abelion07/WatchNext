export function initSpinWheel() {
  let spinning = false;
  let rotation = 0;
  const wheelSvg = document.querySelector("#wheelSvg");
  const pickedCard = document.querySelector("#pickedCard");

  function spinWheel() {
    if (spinning) return;
    spinning = true;

    const picked = movies[Math.floor(Math.random() * movies.length)];
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
      pickedCard.querySelector(".picked-meta").textContent =
        picked.meta + " · Picked by roulette";
      pickedCard.animate(
        [
          { transform: "scale(1)", borderColor: "rgba(255,255,255,0.08)" },
          { transform: "scale(1.025)", borderColor: "rgba(168,85,247,0.65)" },
          { transform: "scale(1)", borderColor: "rgba(255,255,255,0.08)" },
        ],
        { duration: 650 },
      );
    }

    requestAnimationFrame(animate);
  }

  document.querySelector("#spinBtn").addEventListener("click", spinWheel);
  document.querySelector("#spinAgain").addEventListener("click", spinWheel);
}
