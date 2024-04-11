import React, { useEffect, useState, Fragment } from "react";
import { pie, arc, quantize, interpolateSpectral } from "d3";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { GiStrongMan } from "react-icons/gi";
import { GrUserWorker } from "react-icons/gr";
import { PiMosqueBold, PiBrainBold } from "react-icons/pi";
const category = [
  "Emotional",
  "Physical",
  "Intellectual",
  "Occupational",
  "Spiritual",
  "Social",
];
const icons = [
  { name: "Social", icon: <LiaUserFriendsSolid /> },
  { name: "Emotional", icon: <MdOutlineEmojiEmotions /> },
  { name: "Intellectual", icon: <PiBrainBold /> },
  { name: "Occupational", icon: <GrUserWorker /> },
  { name: "Spiritual", icon: <PiMosqueBold /> },
  { name: "Physical", icon: <GiStrongMan /> },
];

const Pie = ({ data, isAllSelected }) => {
  const width = window.innerWidth-40;
  const height = 350;
  const innerRadius = width < 769 ? 60 : 60;
  const outerRadius = width < 769 ? 105 : 120;
  let [userData, setUserData] = useState([]);
  let [overAllScore, setOverAllScore] = useState(0);

  useEffect(() => {
    let getUserData = [];
    let getOverAllScore = 0;
    if (isAllSelected) {
      category.forEach((cat) => {
        let totalScore = 0;
        data.forEach((el) => {
          if (el.category === cat) {
            totalScore += el.score;
          }
        });
        let newScore = (totalScore / 30) * 100;
        getUserData.push({
          totalScore: newScore,
          category: cat,
        });
        getOverAllScore += totalScore;
        totalScore = 0;
      });
      setOverAllScore((getOverAllScore / 180) * 100);
    } else {
      category.forEach((cat) => {
        getUserData.push({
          totalScore: 5,
          category: cat,
          isUpdate: false,
        });
      });

      setOverAllScore(false);
      
    }
    setUserData(getUserData);
  }, [data, isAllSelected]);
  const pieData = pie()
    .value((v) => v.totalScore)
    .sort(null)(userData);
  const arcFill = (d, i) => {
    return quantize(
      (t) => interpolateSpectral(t * 0.7 + 0.3),
      userData.length
    ).reverse()[i];
  };
  const newArc = arc().innerRadius(innerRadius).outerRadius(outerRadius);
  const newLabelArc = arc().outerRadius(outerRadius + 3);

  const newOuterLabelArc = arc()
    .innerRadius(outerRadius)
    .outerRadius(outerRadius + 30);
  const getPathPoint = (x, y, label) => {
    const findAngle = Math.atan2(y, x);
    const x1 = 120 * Math.cos(findAngle);
    const y1 = 120 * Math.sin(findAngle);
    const findAngleg = Math.atan2(y1, x1);
    const x2 = 150 * Math.cos(findAngleg);
    const y2 = 150 * Math.sin(findAngleg);
    const x3 = Math.sign(x2) === 1 ? x2 + 50 : x2 - 50;
    switch (label) {
      case "labelline":
        return `M${x1},${y1} ${x2},${y2}  L${x3},${y2}`;
      case "labeltext":
        return `translate (${x3} ${y2})`;
      case "circle-cx":
        return `${x3}`;
      case "circle-cy":
        return `${y2}`;
      default:
        return "M";
    }
  };

  const getNewPath = (data) => {
    const newArcPath = newLabelArc(data);
    return newArcPath.slice(0, newArcPath.length - 9);
  };
  return (
    <div className="pie-container">
      <svg id="mycanvas" width={width} height={height}>
        <g
          transform={`translate(${width / 2} ${height / 2})`}
          textAnchor="middle"
        >
          {pieData.map((data, i) => (
            <Fragment key={i}>
              <path
                d={`${newArc(data)}`}
                stroke="white"
                fill={`${arcFill(data, i)}`}
                strokeWidth={2}
              />
              {width < 769 && (
                <path
                  d={`${newOuterLabelArc(data)}`}
                  stroke="white"
                  fill="#0a071e"
                  strokeWidth={2}
                />
              )}

              {/* <text fill="black">
                <tspan
                  y="-0.8em"
                  fill={`${arcFill(data, i)}`}
                  className="text-label"
                >
                  {data.data.category}
                </tspan>
              </text> */}
            {overAllScore ===false &&  <g
                transform={`translate(${newArc.centroid(data)[0] - 7} ${
                  newArc.centroid(data)[1] - 9
                })`}
                textAnchor="middle"
                fontSize="18px"
              >
                {icons.filter((ic) => ic.name === data.data.category)[0].icon}
              </g>}

              {overAllScore >0 && (
                <text
                  transform={`translate(${newArc.centroid(data)[0]} ${
                    newArc.centroid(data)[1]
                  })`}
                  fill="black"
                >
                  <tspan x={0} y="0.7em" fill="black">
                    {data.data.totalScore.toFixed(0)}%
                  </tspan>
                </text>
              )}

              {width < 769 && (
                <>
                  {" "}
                  <path
                    d={`${getNewPath(data)}`}
                    id={`${data.data.category}`}
                    stroke="black"
                    fill="none"
                    strokeWidth={0}
                  />
                  <text dy={-6} fill={`${arcFill(data, i)}`}>
                    <textPath
                      startOffset="50%"
                      textAnchor="middle"
                      xlinkHref={`#${data.data.category}`}
                    >
                      {data.data.category}
                    </textPath>
                  </text>
                </>
              )}
            </Fragment>
          ))}

          <g textAnchor="middle">
            {pieData.map((data, i) => (
              <Fragment key={i}>
                {width > 769 && (
                  <path
                    d={getPathPoint(
                      newArc.centroid(data)[0],
                      newArc.centroid(data)[1],
                      "labelline"
                    )}
                    className="line-path"
                  />
                )}

                {width > 769 && (
                  <text
                    transform={getPathPoint(
                      newArc.centroid(data)[0],
                      newArc.centroid(data)[1],
                      "labeltext"
                    )}
                    fill="black"
                  >
                 <tspan
                      y="-0.4em"
                      fill={`${arcFill(data, i)}`}
                      className="text-label"
                      fontSize="15px"
                    >  {data.data.category}
                     
                    </tspan>
                  </text>
                )}
                {width > 769 && (
                  <circle
                    cx={getPathPoint(
                      newArc.centroid(data)[0],
                      newArc.centroid(data)[1],
                      "circle-cx"
                    )}
                    cy={getPathPoint(
                      newArc.centroid(data)[0],
                      newArc.centroid(data)[1],
                      "circle-cy"
                    )}
                    r={3}
                    fill="grey"
                  />
                )}
              </Fragment>
            ))}
          </g>
          {overAllScore === false ? (
            <g>
              <circle cx="0" cy="0" r="60" className="inner-circle"></circle>
              <text className="innerCircletextwrap">
                <tspan className="inner-circle-text-init" x="0" y="-18">
                  SIX
                </tspan>
                <tspan className="inner-circle-text-init" x="0" y="-2">
                  DIMENSIONS
                </tspan>
                <tspan className="inner-circle-text-init" x="0" y="14">
                  OF
                </tspan>
                <tspan className="inner-circle-text-init" x="0" y="30">
                  WELLNESS
                </tspan>
              </text>
            </g>
          ) : ( 
            <g>
              <circle cx="0" cy="0" r="60" className="inner-circle"></circle>
              <text>
                <tspan className="inner-circle-text" x="0" y="-5">
                  Overall
                </tspan>
                <tspan className="inner-circle-text" x="0" y="20">
                  {overAllScore.toFixed(0)}%
                </tspan>
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

export default Pie;
