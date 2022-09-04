import { SpinnerIcon } from "@chakra-ui/icons";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { TOTAL_BALLS } from "../../../../global/constants";
import useOverFlowMessage from "../../../../global/hooks/useOverFlowMessage";
import {
  addNewGaltonBoardSection,
  BUCKET_HEIGHT,
  dropBallFromBucketToNewGaltonBoardSection,
  getBucketHeightType,
  getHistogramOfFirstGaltonBoardSection,
  LOADING_STATES,
} from "../../galtonSlice";
import {
  FillProgress,
  StyledBallsCounterLabel,
  StyledBucket,
  StyledBucketWrapper,
  StyledInnerBucketContent,
  StyledOverFlowingMessage,
} from "../../styles";

interface IBucket {
  balls: number;
  indexOfSection: number;
  indexOfBucketToDropBalls: number;
  showBallsMode: any;
  ballSize: number;
}

const StyledBall: React.FC<{ ballSize: number }> = ({ ballSize }) => (
  <span
    style={{
      width: ballSize,
      height: ballSize,
      backgroundColor: "purple",
      borderRadius: 33,
    }}
  />
);

const Bucket: React.FC<IBucket> = ({
  balls,
  indexOfSection,
  indexOfBucketToDropBalls,
  showBallsMode,
  ballSize,
}) => {
  const bucketHeightType = useAppSelector(getBucketHeightType);
  const histogramIsLoading =
    useAppSelector(getHistogramOfFirstGaltonBoardSection).status ===
    LOADING_STATES.loading;
  const dispatch = useAppDispatch();
  const theBall = 5;
  const ballsInRow = 100 / theBall;
  const bucketHeight = bucketHeightType === BUCKET_HEIGHT.normal ? 450 : 350;
  const amountOfBallsToFillBucket = (bucketHeight / theBall) * ballsInRow;
  const graphPercentageOfBallsInBucket =
    (balls / amountOfBallsToFillBucket) * 100;
  const ballsView = Math.floor(ballSize === 5 ? balls : balls / ballSize);
  const percentage = ((balls / TOTAL_BALLS) * 100).toFixed(2);

  const useOverFlow = useOverFlowMessage(
    graphPercentageOfBallsInBucket,
    histogramIsLoading
  );

  const dropBall = async () => {
    await new Promise((res, rej) =>
      setTimeout(() => {
        res(1);
      }, 1)
    );
  };

  async function dropAllBallsFromBucket() {
    for (let i = 0; i < balls; i++) {
      await dropBall();
      dispatch(
        dropBallFromBucketToNewGaltonBoardSection({
          indexOfSection,
          indexOfBucketToDropBalls,
        })
      );
    }
  }

  return (
    <StyledBucketWrapper>
      <StyledBucket
        height={bucketHeight}
        showBallsMode={showBallsMode}
        onClick={async () => {
          if (balls === 0) return;
          dispatch(
            addNewGaltonBoardSection({
              bucketsBalls: balls,
              indexOfSection,
            })
          );
          dropAllBallsFromBucket();
        }}
      >
        <StyledInnerBucketContent>
          {useOverFlow.isOverFlowing && (
            <StyledOverFlowingMessage
              top="50%"
              transform="rotate(90deg)"
              pos="absolute"
              color="turquoise"
              w="250px"
            >
              {useOverFlow.overFlowMessage}
            </StyledOverFlowingMessage>
          )}
          <StyledBallsCounterLabel
            graphPercentageOfBallsInBucket={graphPercentageOfBallsInBucket}
          >
            <SpinnerIcon /> {balls}
          </StyledBallsCounterLabel>
          {!showBallsMode && (
            <FillProgress percentage={graphPercentageOfBallsInBucket} />
          )}
          <div
            style={{
              width: "100px",
              display: "flex",
              flexWrap: "wrap-reverse",
            }}
          >
            {showBallsMode && (
              <>
                {Array(ballsView)
                  .fill((key: number) => (
                    <StyledBall key={key} ballSize={ballSize} />
                  ))
                  .map((ball, i) => ball(i))}
              </>
            )}
          </div>
        </StyledInnerBucketContent>
      </StyledBucket>
      {percentage} %
    </StyledBucketWrapper>
  );
};

export default Bucket;
