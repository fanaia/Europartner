import React from "react";
import MoedaEdit from "./MoedaEdit";

const Home = () => (
  <div className="container mt-3">
    <div className="row">
      <MoedaEdit moeda="USD" />
      <MoedaEdit moeda="EUR" />
    </div>
  </div>
);

export default Home;