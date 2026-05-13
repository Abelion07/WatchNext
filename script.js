//components
import Navbar from "./src/components/navbar.js";
import Main from "/src/components/main.js";

//features
import { Navigation } from "./src/features/navigation.js";
import { AImode } from "./src/features/ai.js";
import { initSpinWheel } from "./src/features/spinwheel.js";

//pages
import { Landing } from "./src/pages/landing.js";
import { Dashboard, loadDashboardMovies } from "./src/pages/dashboard.js";
import { ContinueWatching, loadContinueWatching } from "./src/pages/ContinueWatching.js";
import { AiRecs } from "./src/pages/AiRecs.js";
import { Roulette } from "./src/pages/Roulette.js";
import { Analytics } from "./src/pages/Analytics.js";
import { FilmDetail } from "./src/pages/FilmDetail.js";


const app = document.querySelector(".app");

app.innerHTML = `
  ${Navbar()}
  ${Main(Landing(), Dashboard(), ContinueWatching(), AiRecs(), Roulette(), Analytics(), FilmDetail())}
`;

Navigation();
AImode();
initSpinWheel();

loadDashboardMovies();
loadContinueWatching()