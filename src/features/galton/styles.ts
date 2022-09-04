import { Heading } from "@chakra-ui/react";
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

export const StyledBucketsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid;
  overflow: scroll;
  @media (max-width: 900px) {
    width: 900px;
  }
  @media (max-width: 768px) {
    width: 500px;
  }
  @media (max-width: 500px) {
    width: 300px;
  }
`;
export const StyledBucketWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledBucket = styled.div<{
  showBallsMode: boolean;
  height: number;
}>`
  height: ${({ height }) => height}px;
  width: 100px;
  border: 1px solid;
  display: flex;
  align-items: flex-end;
  margin: 0px 8px;
  border-radius: 0px 0px 12px 12px;
  overflow: hidden;
  position: relative;
  :hover {
    cursor: pointer;
    border-color: turquoise;
    width: 105px;
  }
`;

export const FillProgress = styled.div<{ percentage: number }>`
  height: ${({ percentage }) => percentage}%;
  width: 100%;
  border-collapse: collapse;
  background-color: purple;
  border-left: 1px solid;
  border-right: 1px solid;
  text-align: center;
`;

export const StyledInnerBucketContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

export const StyledBallsCounterLabel = styled.div<{
  graphPercentageOfBallsInBucket: number;
}>`
  position: ${({ graphPercentageOfBallsInBucket }) =>
    graphPercentageOfBallsInBucket > 90 ? "absolute" : "sticky"};
  top: 0;
`;

export const StyledOverFlowingMessage = styled(Heading)`
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
