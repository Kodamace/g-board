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
} from "../../galtonSlice";
import {
  FillProgress,
  StyledBallsCounterLabel,
  StyledBallsWrapper,
  StyledBucket,
  StyledBucketBar,
  StyledBucketTableData,
  StyledBucketWrapper,
  StyledOverFlowingMessage,
  StyledPercentage,
} from "../../styles";

interface IBucket {
  balls: number;
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
  balls,
  indexOfSection,
  indexOfBucketToDropBalls,
  showBallsMode,
  ballSize,
  totalBallsToDrop,
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
  const getOverFlowMsg = () => {
    let v = [];
    for (let i = 0; i < useOverFlow.overFlowMessage.length; i++) {
      v.push(useOverFlow.overFlowMessage.charAt(i));
    }
    return v;
  };

  return (
    <StyledBucketWrapper>
      <StyledBucket
        height={bucketHeight}
        showBallsMode={showBallsMode}
        onClick={async () => {
          if (balls === 0) return;
          dropAllBallsFromBucket();
        }}
      >
        <StyledBucketTableData>
          <StyledBucketBar bucketHeight={bucketHeight}>
            <StyledBallsCounterLabel
              graphPercentageOfBallsInBucket={graphPercentageOfBallsInBucket}
            >
              <SpinnerIcon /> {balls}
            </StyledBallsCounterLabel>
            {!showBallsMode && (
              <FillProgress percentage={graphPercentageOfBallsInBucket} />
            )}
            {useOverFlow.isOverFlowing && (
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
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
              </span>
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
        </StyledBucketTableData>
      </StyledBucket>
      <StyledPercentage>{percentage} %</StyledPercentage>
    </StyledBucketWrapper>
  );
};

export default Bucket;
