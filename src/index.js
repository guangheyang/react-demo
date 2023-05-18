import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function Clock({ color, time }) {
  return <h1 style={{ color: color }}>{time}</h1>;
}

function ChooseColor(props) {
  return (
    <select
      onChange={(e) => {
        props.onInStockOnlyChange(e.target.value);
      }}
    >
      {props.colorList.map((item) => (
        <option key={item.color} value={item.color}>
          {item.value}
        </option>
      ))}
    </select>
  );
}

function getTime() {
  const date = new Date();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  h = h > 10 ? h : `0${h}`;
  m = m > 10 ? m : `0${m}`;
  s = s > 10 ? s : `0${s}`;
  return `${h}:${m}:${s}`;
}

function App() {
  const [color, setColor] = useState("lightcoral");
  const [time, setTime] = useState(getTime());
  const colorList = [
    {
      value: "浅珊瑚色",
      color: "lightcoral",
    },
    {
      value: "午夜蓝",
      color: "midnightblue",
    },
    {
      value: "丽贝卡紫",
      color: "rebeccapurple",
    },
  ];
  setInterval(() => {
    setTime(getTime())
  }, 1000)
  return (
    <>
      <div>
        <span>请选择一个颜色：</span>
        <ChooseColor colorList={colorList} onInStockOnlyChange={setColor} />
      </div>
      <Clock color={color} time={time} />
    </>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
