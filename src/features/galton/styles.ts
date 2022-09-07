import { Box } from "@chakra-ui/react";
import styled, { keyframes } from "styled-components";

const flashOverFlow = keyframes`
  50% {
    opacity: 0;

}
`;

export const StyledGaltonBoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
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
  @media (max-width: 900px) {
    width: 580px;
  }
  @media (max-width: 850px) {
    width: 500px;
  }
  @media (max-width: 580px) {
    width: 400px;
  }
  @media (max-width: 480px) {
    width: 350px;
  }
  @media (max-width: 400px) {
    width: 300px;
  }
  @media (max-width: 285px) {
    width: 200px;
  }
`;
export const StyledBucketTableBody = styled.tbody``;
export const StyledBucketInner = styled.div`
  width: 800px;
`;

export const StyledBucket = styled.td<{
  showBallsMode: boolean;
  height: number;
}>`
  height: ${({ height }) => height}px;
  width: 100px;
  padding: 0px 2px;
  vertical-align: bottom;
  :hover {
    cursor: pointer;
    border-color: turquoise;
  }

  @media (max-width: 1230px) {
    font-size: 12px;
    width: 90px;
  }
  @media (max-width: 1200px) {
    font-size: 12px;
    width: 85px;
  }
  @media (max-width: 1100px) {
    font-size: 12px;
    width: 80px;
  }
  @media (max-width: 900px) {
    width: 60px;
    font-size: 8px;
  }
  @media (max-width: 780px) {
    font-size: 5px;
    width: 50px;
  }

  @media (max-width: 580px) {
    font-size: 5px;
    width: 40px;
  }
  @media (max-width: 500px) {
    font-size: 5px;
    width: 30px;
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
  border-radius: 0px 0px 12px 12px;
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

export const StyledCounterWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 10px;
`;

export const StyledPercentage = styled.p`
  text-align: center;
  margin: 8px 0px;
`;

export const StyledBallsCounterLabel = styled.div<{
  graphPercentageOfBallsInBucket: number;
}>`
  position: ${({ graphPercentageOfBallsInBucket }) =>
    graphPercentageOfBallsInBucket > 90 ? "absolute" : "sticky"};
  top: 0;
  text-align: center;
  white-space: nowrap;
`;

export const StyledOverFlowMessageContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
