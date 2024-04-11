import "./App.css";
import { useState } from "react";
import { statements } from "./data";
import { FaHandHoldingMedical } from "react-icons/fa";
import Assessment from "./Assessment";
import Pie from "./Pie";
import Footer from "./Footer";

function App() {
  const [data, setData] = useState(statements);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const handleAgreement = (e, id, argIndex) => {
    let updateData = [...JSON.parse(JSON.stringify(data))];
    let newScore = +e.target.dataset.value;
    updateData.forEach((d) => {
      if (d.id === id) {
        d.score = newScore;
        d.selected = true;
        d.agreements.forEach((el, i) =>
          i === argIndex ? (el.isActive = true) : (el.isActive = false)
        );
      }
    });

    setData(updateData);
    const isSelected = updateData.some((el) => el.selected === false);
    setIsAllSelected(!isSelected);
  };
  return (
    <div className="App">
      <div className="header">
        <h2>
          {" "}
          <FaHandHoldingMedical /> YOUR WELLNESS REPORT
        </h2>
      </div>
      <Pie data={data} isAllSelected={isAllSelected} />
      <Assessment handleAgreement={handleAgreement} statements={data} isAllSelected={isAllSelected}/>
      <Footer />
    </div>
  );
}

export default App;
