import React from "react";
import "./App.css";
import { MainAppContainer } from "./global/styles";
import GaltonBoard from "./features/galton/GaltonBoard";

function App() {
  return (
    <MainAppContainer>
      <GaltonBoard />
    </MainAppContainer>
  );
}

export default App;
