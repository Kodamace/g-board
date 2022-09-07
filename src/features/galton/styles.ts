import { Box, Heading } from "@chakra-ui/react";
import styled, { keyframes } from "styled-components";

const flashOverFlow = keyframes`
  50% {
    opacity: 0;

}
`;

export const StyledGaltonBoardWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledBucketsWrapper = styled.table`
  border-bottom: 1px solid;
  display: flex;
  width: 80vw;
  padding: 8px;
  justify-content: center;
  @media (max-width: 900px) {
    width: 900px;
  }
  @media (max-width: 850px) {
    width: 600px;
  }
  @media (max-width: 768px) {
    width: 500px;
  }
  @media (max-width: 480px) {
    width: 350px;
  }
  @media (max-width: 400px) {
    width: 300px;
  }
  @media (max-width: 280px) {
    width: 200px;
  }
`;
export const StyledBucketWrapper = styled.table`
  width: 800px;
`;
export const StyledBucketInner = styled.div`
  width: 800px;
`;

export const StyledBucket = styled.tbody<{
  showBallsMode: boolean;
  height: number;
}>`
  height: ${({ height }) => height}px;
  vertical-align: bottom;
  :hover {
    cursor: pointer;
    border-color: turquoise;
  }
`;

export const StyledBucketTableData = styled.td`
  height: 100px;
`;
export const StyledBucketBar = styled.div<{ bucketHeight: number }>`
  height: ${({ bucketHeight }) => bucketHeight}px;
  position: relative;
  max-width: 100px;
  border: 1px solid;
  border-radius: 0px 0px 30px 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  :hover {
    cursor: pointer;
    border: 2px solid;
    border-color: turquoise;
  }
`;

export const StyledBallsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap-reverse;
`;

export const FillProgress = styled.div<{ percentage: number }>`
  height: ${({ percentage }) => percentage}%;
  width: 100%;
  border-collapse: collapse;
  background-color: purple;
  text-align: center;
`;

export const StyledPercentage = styled.td`
  text-align: center;
  @media (max-width: 900px) {
    font-size: 15px;
  }
  @media (max-width: 768px) {
    font-size: 14px;
  }
  @media (max-width: 500px) {
    font-size: 5px;
  }
`;

export const StyledBallsCounterLabel = styled.div<{
  graphPercentageOfBallsInBucket: number;
}>`
  position: ${({ graphPercentageOfBallsInBucket }) =>
    graphPercentageOfBallsInBucket > 90 ? "absolute" : "sticky"};
  top: 0;
  text-align: center;
  @media (max-width: 900px) {
    font-size: 15px;
  }
  @media (max-width: 768px) {
    font-size: 14px;
  }
  @media (max-width: 500px) {
    font-size: 5px;
    width: 20px;
  }
`;

export const StyledOverFlowingMessage = styled(Box)`
  animation-name: ${flashOverFlow};
  animation-duration: 1s;
  animation-iteration-count: infinite;
`;

export const StyledBall = styled.div`
  width: 5px;
  height: 5px;
  background-color: purple;
  border-radius: 33px;
`;
