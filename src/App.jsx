import Quiz from "./components/Quiz/Quiz";
import ParallaxBackground from './components/ParallaxBackground';
import Particles from './components/Particles';
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1> Welcome to the Quiz!</h1>

      <ParallaxBackground />
      <Particles />
      <Quiz />
    </div>
  );
}
export default App