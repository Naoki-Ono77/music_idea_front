import React from "react";
import CardPage from "./CardPage";

const UnsortedIdea = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>アイデア（未整理状態）</h1>
      <p>未整理状態のアイデアを投稿</p>
      <CardPage PageName="UnsortedIdea" />
    </div>
  );
};

export default UnsortedIdea;
