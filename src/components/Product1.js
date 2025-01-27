import React from "react";
import CardPage from "./CardPage";

const Product1 = () => {
  return (
    <div  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
      <h1>Product1</h1>
      <p>一つ目のプロジェクトの進捗やアイデア、ビジョンなど</p>
      <CardPage PageName="Product1" />
    </div>
  );
};

export default Product1;
