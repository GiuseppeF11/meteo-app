import Header from "./layouts/Header";
import Chart from "./components/Chart";
import Carousel from "./components/Carousel";

import "./App.css";

function App() {
  return (
    <>
      <div className="container">
        <Header></Header>
        <Chart></Chart>
        <Carousel></Carousel>
      </div>
    </>
  );
}

export default App;
