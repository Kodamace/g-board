import { SpinnerIcon } from "@chakra-ui/icons";
import { Stack } from "@chakra-ui/react";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { TOTAL_BALLS } from "../../../../global/constants";
import useOverFlowMessage from "../../../../global/hooks/useOverFlowMessage";
import {
  updateNewGaltonBoardSection,
  BUCKET_HEIGHT,
  dropBallFromBucketToNewGaltonBoardSection,
  getBucketHeightType,
  getHistogramOfFirstGaltonBoardSection,
  LOADING_STATES,
  toggleBucketBallsDroppingState,
  IGaltonBucket,
} from "../../galtonSlice";
import {
  FillProgress,
  StyledBallsCounterLabel,
  StyledBallsWrapper,
  StyledBucket,
  StyledBucketBar,
  StyledCounterWrapper,
  StyledOverFlowingMessage,
  StyledOverFlowMessageContainer,
  StyledPercentage,
} from "../../styles";

interface IBucket {
  bucket: IGaltonBucket;
  indexOfSection: number;
  indexOfBucketToDropBalls: number;
  showBallsMode: any;
  ballSize: number;
  totalBallsToDrop: number;
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
  bucket,
  indexOfSection,
  indexOfBucketToDropBalls,
  showBallsMode,
  ballSize,
  totalBallsToDrop,
}) => {
  const { balls, isDroppingBallsFromBucket } = bucket;
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
    histogramIsLoading || totalBallsToDrop > 0
  );

  const dropBall = async () => {
    await new Promise((res, rej) =>
      setTimeout(() => {
        res(1);
      }, 1)
    );
  };

  async function dropAllBallsFromBucket() {
    dispatch(
      updateNewGaltonBoardSection({
        indexOfSection,
        balls,
      })
    );
    dispatch(
      toggleBucketBallsDroppingState({
        indexOfSection,
        indexOfBucket: indexOfBucketToDropBalls,
      })
    );
    for (let i = 0; i < balls; i++) {
      await dropBall();
      dispatch(
        dropBallFromBucketToNewGaltonBoardSection({
          indexOfSection,
          indexOfBucketToDropBalls,
        })
      );
    }
    dispatch(
      toggleBucketBallsDroppingState({
        indexOfSection,
        indexOfBucket: indexOfBucketToDropBalls,
      })
    );
  }
  const getOverFlowMsg = () => {
    let v = [];
    for (let i = 0; i < useOverFlow.overFlowMessage.length; i++) {
      v.push(useOverFlow.overFlowMessage.charAt(i));
    }
    return v;
  };

  return (
    <>
      <StyledBucket
        height={bucketHeight}
        showBallsMode={showBallsMode}
        onClick={async () => {
          if (isDroppingBallsFromBucket) return;
          if (balls === 0) return;
          await dropAllBallsFromBucket();
        }}
      >
        <StyledBucketBar bucketHeight={bucketHeight}>
          <StyledCounterWrapper>
            <StyledBallsCounterLabel
              graphPercentageOfBallsInBucket={graphPercentageOfBallsInBucket}
            >
              <SpinnerIcon /> {balls}
            </StyledBallsCounterLabel>
          </StyledCounterWrapper>
          {!showBallsMode && (
            <FillProgress percentage={graphPercentageOfBallsInBucket} />
          )}
          {useOverFlow.isOverFlowing && (
            <StyledOverFlowMessageContainer>
              {getOverFlowMsg().map((item) => {
                return (
                  <Stack>
                    <StyledOverFlowingMessage
                      color="turquoise"
                      transform="rotate(90deg)"
                      textAlign="right"
                    >
                      {item}
                    </StyledOverFlowingMessage>
                  </Stack>
                );
              })}
            </StyledOverFlowMessageContainer>
          )}
          <StyledBallsWrapper>
            {showBallsMode && (
              <>
                {Array(ballsView)
                  .fill((key: number) => (
                    <StyledBall key={key} ballSize={ballSize} />
                  ))
                  .map((ball, i) => ball(i))}
              </>
            )}
          </StyledBallsWrapper>
        </StyledBucketBar>
        <StyledPercentage>{percentage} %</StyledPercentage>
      </StyledBucket>
    </>
  );
};

export default Bucket;
