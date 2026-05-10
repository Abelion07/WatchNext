//components
import Navbar from "./src/components/navbar.js";
import Main from "/src/components/main.js";

//data
import { movies } from "./src/data/defaultmovies.js";

//features
import { Navigation } from "./src/features/navigation.js";
import { AImode } from "./src/features/ai.js";
import { initSpinWheel } from "./src/features/spinwheel.js";

//pages
import { Landing } from "./src/pages/landing.js";
import { Dashboard } from "./src/pages/dashboard.js";
import { AiRecs } from "./src/pages/AiRecs.js";
import { Roulette } from "./src/pages/Roulette.js";
import { Analytics } from "./src/pages/Analytics.js";
import { FilmDetail } from "./src/pages/FilmDetail.js";


const app = document.querySelector(".app");

app.innerHTML = `
  ${Navbar()}
  ${Main(Landing(), Dashboard(), AiRecs(), Roulette(), Analytics(), FilmDetail())}
`;

Navigation();
AImode();
initSpinWheel();

console.log(movies);
