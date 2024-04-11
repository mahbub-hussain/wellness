import { useRef, useState } from "react";
import { quantize, interpolateSpectral } from "d3";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
const Assessment = ({ handleAgreement, statements, isAllSelected }) => {
  const textColor = (i) => {
    return quantize((t) => interpolateSpectral(t * 0.7 + 0.3), 6).reverse()[i];
  };
  const category = [
    "Emotional",
    "Physical",
    "Intellectual",
    "Occupational",
    "Spiritual",
    "Social",
  ];
  const catMargin = useRef();
  const [currentCate, setCurrentCate] = useState("Emotional");
  const [ctrlBtnStyle, setCtrlBtnStyle] = useState("");
  const [answerCount, setAnswerCount] = useState(7);
  const countAnswer = Math.abs(
    statements.filter(
      (el) => el.category === currentCate && el.selected === true
    ).length - 6
  );
  const handleCategory = (newPos, curPos, loop, btnStyle) => {
    if (countAnswer === 0) {
      setAnswerCount(countAnswer);
    } else if (countAnswer <= 6) {
      setAnswerCount(countAnswer);
      return;
    }
    const catInd = category.findIndex((el) => el === currentCate);
    let newCate = category[catInd + newPos];

    if (catInd === curPos) {
      setCurrentCate(category[loop]);
      return;
    }
    setAnswerCount(countAnswer);
    setCtrlBtnStyle(btnStyle);
    setCurrentCate(newCate);
  };
  const handleNext = () => {
    handleCategory(1, category.length - 1, 0, "next");
  };
  const handlePrevious = () => {
    handleCategory(-1, 0, 5, "prev");
  };
  return (
    <div className="category-container" ref={catMargin}>
      <div
        style={{
          color: `${textColor(category.findIndex((el) => el === currentCate))}`,
        }}
        className="categoryTitle"
      >
        <p>{currentCate + " Wellness"} </p>
      </div>
      <div className="statements-container">
        {statements
          .filter((el) => el.category === currentCate)
          .map((sta, ind) => (
            <div className="arg-container" key={sta.id}>
              <h3> {sta.queation}</h3>
              <div className="arg-container">
                <div className="arg-list">
                  {sta.agreements.map((arg, i) => (
                    <button
                      key={sta.id + i}
                      onClick={(e) => handleAgreement(e, sta.id, i)}
                      data-value={i + 1}
                      className={
                        arg.isActive
                          ? "list-btn select-button-active"
                          : "list-btn select-button"
                      }
                    >
                      <span></span>
                      {arg.value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        <p className="answer-count">
          {countAnswer === 0
            ? "You answered all "+currentCate+ " wellness quations"
            : (answerCount <= 6) && `${countAnswer} ${currentCate} wellness answer Left`}
        </p>
      </div>
      <div className="arg-control">
        <button
          className={(ctrlBtnStyle === "prev" && "btn-prev") || undefined}
          onClick={handlePrevious}
        >
          <IoIosArrowBack /> Previous{" "}
          {window.innerWidth > 768 && "Questionnaires"}{" "}
        </button>
        <button
          className={(ctrlBtnStyle === "next" && "btn-next") || undefined}
          onClick={handleNext}
        >
          Next {window.innerWidth > 768 && "Questionnaires"}{" "}
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default Assessment;
