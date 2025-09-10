// App.jsx
import "./App.css";
import { Routes, Route, Link } from "react-router";

function Home() {
      return <h1>Vite + React</h1>;
}

function About() {
      return <h1>About</h1>;
}

function App() {
      return (
            <>
                  <nav>
                        <Link to='/'>Home</Link> |{" "}
                        <Link to='/about'>About</Link>
                  </nav>

                  <Routes>
                        <Route
                              path='/'
                              element={<Home />}
                        />
                        <Route
                              path='/about'
                              element={<About />}
                        />
                  </Routes>
            </>
      );
}

export default App;
