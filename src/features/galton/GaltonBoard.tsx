import React, { useEffect, useState } from "react";
import { Button, Flex, Heading, Spinner, useColorMode } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  BUCKET_HEIGHT,
  dropBallForFirstHistoGramToBucket,
  getBucketHeightType,
  getGaltonBoardSections,
  getHistogramOfFirstGaltonBoardSection,
  LOADING_STATES,
  updateBucketType,
  updateMaxAmountOfBallsForOverFlow,
} from "./galtonSlice";
import { StyledGaltonBoardWrapper } from "./styles";
import { TOTAL_BALLS } from "../../global/constants";
import Histogram from "./components/histogram/Histogram";
import GaltonBoardSection from "./components/galtonBoardSection/GaltonBoardSection";
import { useToast } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
let firstRender = true;

interface IGaltonBoard {}

const GaltonBoard: React.FC<IGaltonBoard> = () => {
  const [showBallsMode, setShowBallsMode] = useState(false);
  const [ballSize, setBallSize] = useState(5);
  const galtonBoardSections = useAppSelector(getGaltonBoardSections);
  const histogramOfFirstGaltonBoard = useAppSelector(
    getHistogramOfFirstGaltonBoardSection
  );
  const bucketHeightType = useAppSelector(getBucketHeightType);
  const dispatch = useAppDispatch();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  const dropBall = () => {
    return new Promise((res, rej) =>
      setTimeout(() => {
        res(1);
      }, 1)
    );
  };

  const startFirstGaltonBoardSection = async () => {
    for (let i = 0; i < TOTAL_BALLS; i++) {
      await dropBall();
      dispatch(dropBallForFirstHistoGramToBucket());
    }
  };

  useEffect(() => {
    if (firstRender) {
      dispatch(updateMaxAmountOfBallsForOverFlow());
      startFirstGaltonBoardSection();
      firstRender = false;
    }
    return () => {};
  });

  return (
    <StyledGaltonBoardWrapper>
      <Flex p={8} w="100%" justifyContent="space-around">
        <Flex justifyContent="space-between" w="33%">
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </Button>
          <Button
            onClick={() => {
              setShowBallsMode(!showBallsMode);
              if (!showBallsMode) {
                toast({
                  title: `Ball mode reduces performance as it has to render every single ball to the screen! To reduce the load increase the ball size which will combine balls together. :D`,
                  status: "info",
                  isClosable: true,
                });
              }
            }}
          >
            {showBallsMode ? "Graph" : "Balls"} Mode
          </Button>
          <Button
            onClick={() => {
              dispatch(updateBucketType());
              if (bucketHeightType === BUCKET_HEIGHT.normal) {
                toast({
                  title: `Buckets will overflow more now as the bucket height has changed and the balls to buckets ratio has decreased!`,
                  status: "info",
                  isClosable: true,
                });
              }
            }}
          >
            {bucketHeightType === BUCKET_HEIGHT.normal ? "Smaller" : "Normal"}{" "}
            Buckets
          </Button>
        </Flex>
        <Heading textAlign="center" w="33%">
          Galton Board Stack
        </Heading>
        <Flex w="33%" justifyContent="space-between">
          <Button
            onClick={() => {
              if (ballSize === 12)
                return toast({
                  title: `Max ball size reached`,
                  status: "warning",
                  isClosable: true,
                });
              setBallSize((prev) => (prev += 1));
            }}
          >
            Increment Ball Size
          </Button>
          <Button onClick={() => setBallSize(5)}>Reset Ball Size</Button>
        </Flex>
      </Flex>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {histogramOfFirstGaltonBoard.status === LOADING_STATES.loading && (
          <>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
            <Heading>Loading histogram...</Heading>
          </>
        )}
      </div>
      {histogramOfFirstGaltonBoard.status !== LOADING_STATES.loading && (
        <Histogram histogramOfFirstGaltonBoard={histogramOfFirstGaltonBoard} />
      )}
      {galtonBoardSections.map((galtonBoardSection, galtonBoardIndex) => {
        return (
          <GaltonBoardSection
            key={galtonBoardIndex}
            data={galtonBoardSection}
            galtonBoardIndex={galtonBoardIndex}
            showBallsMode={showBallsMode}
            ballSize={ballSize}
          />
        );
      })}
    </StyledGaltonBoardWrapper>
  );
};

export default GaltonBoard;
