import React, { Fragment } from "react";
import { Center, Heading } from "@chakra-ui/react";
import { TOTAL_BALLS } from "../../../../global/constants";
import { IGaltonBoardSection } from "../../galtonSlice";
import { StyledBucketBar, StyledBucketsWrapper } from "../../styles";
import Bucket from "./Bucket";
import Bar from "../histogram/Bar";
import {
  StyledBarContent,
  StyledBarsOuter,
  StyledBarWrapper,
} from "../histogram/styles";

const GaltonBoardSection: React.FC<{
  data: IGaltonBoardSection;
  galtonBoardIndex: number;
  showBallsMode: any;
  ballSize: number;
}> = ({ data, galtonBoardIndex, showBallsMode, ballSize }) => {
  const { buckets, totalBallsToDrop } = data;

  return (
    <div>
      <p style={{ textAlign: "center" }}>
        Total Balls In Section: {totalBallsToDrop} / {TOTAL_BALLS}
      </p>
      <Heading textAlign="center">Buckets</Heading>
      Total Balls In Buckets:{" "}
      {buckets.reduce((acc, curr) => (acc += curr.balls), 0)} /{TOTAL_BALLS}
      <StyledBucketsWrapper>
        {buckets.map(({ balls }, i) => (
          <Bucket
            indexOfSection={galtonBoardIndex}
            indexOfBucketToDropBalls={i}
            key={i}
            totalBallsToDrop={totalBallsToDrop}
            balls={balls}
            showBallsMode={showBallsMode}
            ballSize={ballSize}
          />
        ))}
      </StyledBucketsWrapper>
    </div>
  );
};

export default GaltonBoardSection;
