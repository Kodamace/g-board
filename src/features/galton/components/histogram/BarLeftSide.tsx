import React from "react";
import { Heading } from "@chakra-ui/react";

const BarLeftSide = () => {
  return (
    <>
      <Heading mr={-12} transform={"rotate(-90deg)"} size="sm">
        Balls
      </Heading>
      <div
        style={{
          height: "100px",
          display: "grid",
          textAlign: "right",
          marginTop: -10,
        }}
      >
        <span>10000</span>
        <span>7500</span>
        <span>5000</span>
        <span>2500</span>
        <span>0</span>
      </div>
      <div
        style={{
          width: 1,
          height: 100,
          backgroundColor: "white",
        }}
      ></div>
    </>
  );
};

export default BarLeftSide;
