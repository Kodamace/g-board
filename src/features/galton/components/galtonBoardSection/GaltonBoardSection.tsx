import React from "react";
import { Heading } from "@chakra-ui/react";
import { TOTAL_BALLS } from "../../../../global/constants";
import { IGaltonBoardSection } from "../../galtonSlice";
import { StyledBucketsWrapper, StyledBucketTableBody } from "../../styles";
import Bucket from "./Bucket";

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
        <StyledBucketTableBody>
          <tr>
            {buckets.map((bucket, i) => (
              <Bucket
                indexOfSection={galtonBoardIndex}
                indexOfBucketToDropBalls={i}
                key={i}
                totalBallsToDrop={totalBallsToDrop}
                bucket={bucket}
                showBallsMode={showBallsMode}
                ballSize={ballSize}
              />
            ))}
          </tr>
        </StyledBucketTableBody>
      </StyledBucketsWrapper>
    </div>
  );
};

export default GaltonBoardSection;
