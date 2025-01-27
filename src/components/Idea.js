import React from "react";
import CardPage from "./CardPage";

const Idea = () => {
  return (
    <div  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
      <h1>アイデア</h1>
      <p>整理されたアイデアを投稿</p>
      <CardPage PageName="Idea" />
    </div>
  );
};

export default Idea;
