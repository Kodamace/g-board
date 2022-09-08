import React, { useEffect, useState } from "react";
import { Button, Flex, Heading, Spinner, useColorMode } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  BUCKET_HEIGHT,
  dropBallForFirstHistoGramToBucket,
  getBucketHeightType,
  getGaltonBoardSections,
  getHistogramOfFirstGaltonBoardSection,
  IGaltonBoardSection,
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
import useNotification from "../../global/hooks/useNotification";
// @ts-ignore
import notificationSound from "../../assets/notification-sound-7062.mp3";

let firstRender = true;

interface IGaltonBoard {}

const GaltonBoard: React.FC<IGaltonBoard> = () => {
  const [showBallsMode, setShowBallsMode] = useState(false);
  const [ballSize, setBallSize] = useState(5);
  const galtonBoardSections = useAppSelector(getGaltonBoardSections);
  const allBallsDropped = galtonBoardSections[0].totalBallsToDrop <= 0;
  const histogramOfFirstGaltonBoard = useAppSelector(
    getHistogramOfFirstGaltonBoardSection
  );
  const bucketHeightType = useAppSelector(getBucketHeightType);
  const dispatch = useAppDispatch();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  useNotification(
    allBallsDropped,
    "Notification",
    notificationSound,
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIQDw8PDRANEBAQDw8PDw8RFQ8PEREQFRIXFxcRExMYHSghGBonHhYTIT0jJykrLjouFx8zODMsPSgtLisBCgoKDg0OGxAQGy0lIB8tLS0tLS0tLS0tLSstLS0uLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABgcBBQgEAgP/xABAEAACAgEBAwkDCQcDBQAAAAAAAQIDBBEFBhIHEyExQVFhcYEUIpEyQlJicoKSobEjJENTssHwM1RjFnOTo/H/xAAaAQEAAwEBAQAAAAAAAAAAAAAAAwQFAQIG/8QAKREBAAIBBAEEAQQDAQAAAAAAAAECAwQREjEhBUFRYRMyUnGRIjNCsf/aAAwDAQACEQMRAD8AvEAAAAAAAAAA0m2t68LD1WTk1Rkv4cXzln4I6tEtMN79Qmx6fJk/TCEbU5Yqo6rDxbLPr3SVS81FJt/kWa6Gf+pXaem2n9U7Irncqm0bNeCVFC/46038ZuRYroscd+Vqvp+GO95aXJ3x2hZ8vNyvuTlV/RoTRp8ce0Jo0uKOqw8M9t5T+VlZb87bX+rPX4qfEf09/hxx/wAx/TC2zkrqycpeVtq/uPxU+I/p38OP9sf09WPvVnVvWGdm+TtsmvhJtHmcGOe4h4nTYp7rDb4XKXtKvrvjau62uuX5xSf5kdtHin2RW0GGfbZJtl8scloszEjLvnRNxfpXPX+or30P7ZVr+mftsmexuUHZ+Voo3qqb0/Z3/snq+xSfut+TK19Nkr7KWTR5qdwlUZarVNNPpTIFZkAAAAAAAAAAAAAAAAAxqBDt6eUTEwta4v2m9dDqqa0i+6yfVHy6X4FnFpr3+oW8GjyZPPUKp3h5Qs7M1jzvs9T/AIVGsOj60/lS+KXgaGLS0p9y1cWix4/O28/aKFiIiFqIYOugAAAAAAAA4N3sHerMwmvZb5xgv4Mv2lT8OB9XpoyLJgpfuEGXTY8ncLR3Y5V6LuGvPisax6LnFrKiT8X1w9dV4mfl0dq+a9MvN6fevmnmFi1WxlFShKMoyScZRaaa7011lOY27UJiY8S+w4AAAAAAAAAAAAB4Ns7Xpw6pXZVka4R7X1yf0Yx65PwR6pSbztV7pjtedqwpTfLlIyMxyqxuLGxurRPS6xfXkupfVXq2amHSVp5t5ltafQ1x+beZQYtrzB0AAAAAAAAAAAAAyBId1d8srZ0lzM+OnXWePPV1vv4foPxXqmQZdPTJ3/atn0tM0ee/leG6W+GNtGGtMuC2K1son0Tj4r6UfFeunUZWXBbHPnpiZ9NfFPnr5SIhQAAAAAAAAAABod7t6adnU85c+KyWqppi1x2S/tFdr/8AhLiwzlnaE2DT2zW2q5/3j3hvz7ndkz161XWtVCuP0YL+/WzYxYq442h9Bhw1xRtVqSVKAAAAAAAAAAAAAAAAAH74eXOmyFtM5V2QfFCcXo4vwPNqxaNpebUi0bWXlye7/Qz0sfJ4a8uK8oXJdcod0u+Pw8MnUaecc7x0w9VpJxTvHSdlVSAAAAAAAANFvdvNVs7Hd1vvTlrGmpPSVk9OrwS7WS4sU5LbQmwYLZrcYc8bb2xdmXzyMmblOXUvmwj2QguxI2ceOMcbQ+hxYq468ateSJAAAAAAAAAAAAAAAAAAAAPuq2UJRlCUoyi1KMotxlGS6mmupnJjfxLkxExtK9OTffpZ0VjZTUcuEeh9CV8V8+K+ku1eq8MnU6ecc7x0wtXpJxTyr0npUUgAAAAAPDtralWJRZkZEuGuuOr72+yMV2tvRaeJ6rSbzxh7x0m9orDnHeneC3aGTPIueifRVWvk1V9kF4977WbWLFGOu0PosGGuKnGGnJkwAAAAAAAAAAAAAAAAAAAAAB+uNkTqnCyqUoThJShOPQ4yXU0eZrFo2n3ctWLRtLobcDeuO0cbilwxyKtIZEF0dOnRZFfRl0+qa7DG1GGcdvp89qtPOG/0lKIFYAAADAojlX3q9ryfZaZfu+NJp6dVly6JT8UumK9X2mrpMPCOU9y3NDp+Fec9ygRdXwAAAAAAAAAAAAAAAAAAAAAAAA3O6e8Fmz8qvIr1cU+G6vssqb96Pn2rxSIc2KMldkGowxlpxdKYWVC6uFtUlKuyKnCS6nFrVMxJrNZ2l85as1naX7nHAABEOU3eL2HBlzctL8jWmlrrjqvesXkvzaLGmxfkv9QtaPB+XJ56hz2zZfQsHQAAAAAAAAAAAAAAAAAAAAAAAAMnBbnIpvFrGzZ1svk8V2Nr9H59a8m+L1l3GbrcW084Y/qODbbJC1ygzAABz3yp7b9r2jZGL1qxv3evu4k/2kvPi1XlFGxpMfCm/wAt/Q4uGKJ958oeWlwAAAAAAAAAAAAAAAAAAAAAAAAAAD3bE2lPFyacmv5VNkZpfSXzo+TTa9TxkpF68Z90eWkXpNZ93T+DlwuqruqfFC2EbIPvjJar9TBmvGdpfM2rNZmJ9n7nHGp3q2r7JhZOT0a11ScNe2x+7BficSTFXleIS4ac8kVcxN69LbbfS2+lt9rbN2I28PpYjaNmDroAAAAAAAAAAAAAAAAAAAAAAAAAAGQLy5Gdr89gPHk9Z4tjitXq+anrKP58a+6jI1lOOTf5YXqGLjk5fKwCmoK15cNo8GJj4yfTfa7JLvhUu3704fAvaGu95n4aXptN7zafaFLGq2gAAAAAAAAAAAAAAAAAAAAAAAAAAAACe8jO0ua2i6W/dyaZw0+vD34v4Ka9Slrab4+Xwoeo05Y+XwvXUy2Io7lry+PaNdSfRTjQWndKcpSf5cBqaKu1Jn5ltem12xzPzKvi60AAAAAAAAAAAAAAAAAAAAAAAAAAAAADbbqZnMZ+HavmZFWv2XJRl+TZFmrypMfSHUV5YrR9OnNPIwdpfNeXOnKVfx7WzX2KyMF9yuMf1TNvSxtiq+h0UbYaowWFoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAym10rofY+5nJ6cmN42dD/9S+H6mJxfO8VH742cW0s9v/eZC+Fkl/Y18P8Arr/Dd00bYq/xDTkqYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyjguMxnz6st7otbRz0/wDeZL+NsmauH/XX+IbeD/XX+I/8aglSgAAAAAAAAAAAAAAAAAAAAAAAAAAAAGTguMxnzyv+UWng2tnJ9t3H+OEZf3NLTTviq19HO+GqNlhaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMnHJdA/9NS+kjF5PneSueWbE4Np85p0XY9U9e+UW4NfCMfiX9FO+Pb4lqenW3xbfEoGXF8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA2W7eHz+biU9fOZFMX9njXF+WpHltxpM/SLPbjjtP06g9D5/k+Z3lWHLns7ipxMpfwrJ0y8rEmm/WDX3jQ0NtrTX5afpt9rTVThqNgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnHI/s7ntqQsafDj1WXa9nE1wRT/G390qa2+2Pb5UfUL8cW3yvoyNmE0m+2yPbNn5VCWs3W51/9yD44r1aS9SXDfjeJTafJ+PJWzmg3X0oAAAAAAAAAAAAAAAAAAAAAAAAAAAABdfIlsrm8O3Ka97Is4Yv/AI6tV/U5/Aytbfe8V+GJ6jk3yRX4WQUd2eydHOfKPsP2PaN0YrSq5+0U93DNvWPpLiWndobOmyc8cfT6HR5fyYo+vCLllaAAAAAAAAAAAAAAAAAAAAAAAAAAA/fBxZXW101LWds41wX1pPRfqeL2isby83tFY5T7OoNj7OjjY9OPX8mmuNa8dF0yfi3q/Uwr25TMvmL352m0+72nl5AIPysbu+14Lurjrdi8VsUulyr/AIkF6JS84+JZ0mXhfaepXdFn/Hk2nqVCGy3mAAAAAAAAAAAAAAAAAAAAAAAAABkCzeRfdznLpbQtj7lPFXRr861rSU15J6ecn3Gfrcu0cIZfqOfx+OFzIzWQAAMNAc+cpe7DwMtyri1jZDdlLXVCXzqvR9K8Gu5mxpc35K7T3Df0Wo/LTae47Q8tLgAAAAAAAAAAAAAAAAAAAAAAAAbDYOybMzJqxqV79ktNetQj1ynLwS1ZHkyRSvKUeXLGOk2l0vsbZleLj1Y9C0rqiox733yfi3q/Uw73m9t5fN5Lze02l7Ty8AAABqN6dg15+LZjW9HF71c+2uxfJmv86m0SYsk47coS4cs4rxaHN+2NmW4l9mPkR4bK5aNdjXZKL7Yvr1Nul4tG8Po8eSuSvKvTxHt7AAAAAAAAAAAAAAAAAAAAAAPqEW2kk220kl0tt9SSObxHmSZ28r75Mtz/AGCh3ZEf3q9JzXXzVfWql49r8fIyNTn/ACW2jqGDrNT+W3GvUJuiqpAAAAAARPf7c2G0qdYcMMqtPmbH1SX8uf1X+T9dZ8GecU/S1pdTOG3npz9m4k6bJ1XQlCyuTjOEuhp/52mzW0WjeG/W0WjeH4Hp6AAAAAAAAAAAAAAAAAAAAAXHyX7hc1w52dD9q0pY9Ml/pr+ZNfT7l2efVmarU8v8asbW6vlPCnS0SgzQAAAAAAACI7+bk17Rr44cNWVWnzdunRJfy7NOtePZ8U7GDUTin6W9NqrYZ+YUJtPZ1uNbOjIhKuyHyoy7u9PtXia9LRaN4buPJF43rO7yHp7DoAAAAAAAAAAAAAAAAPqMW2kk220klq22+pJdrOTLkzEdri5OOTrmuDM2jFO3olTjvRqrunZ3z8Ozz6s3U6rl/jXpj6vWzb/CnSz0igzWQAAAAAAAAGANHvTutj7Rr4MiOk4p81dHRWVt9z7V4PoJcWW2Od4TYc98U71UbvZuXlbOk3bHnKNfdyYJ8D8Jr5j8H6Nmri1FckfbcwaqmWPHfwjZOssHQAAAAAAAAAAAADIGx2HsLIzbVViVSslquKXVCC+lOXVFf4tSPJlrSN5lFlzUxxvaV27k8n1GBw3W6X5X8xr3K9eyqPZ9p9Pl1GVm1NsniOmLqNZbL4jxCalZTAAAAAAAAAAAAA+LKoyi4zSlGSalFpNNPsafWI8TuRMx5hXG9XJTTdxW7Oksex6t0y1dEn4dsPTVeBdxay1fFvLRweoWr4v5VVtvdzKwpaZdFla10U9OKuX2bF0Py6zQx5qXjxLUx58eT9MtWSpmAAAAAAAAAGTg9Wzdm3ZM+bxqrbp9HuwTlp4yfVFeLPN71pG9vDxfJWkb2nZZW7HJJKXDZtOzhXQ/Z6mnLynZ1Lyj8Shl1vtRm5vUfbH/AGtTZuzacauNWNXCquPVGC0Wve+9+LKNrTad5Zl72vO9p3es8vAAAAAAAAAAAAAAAAA+LK4yTjKKlFrRxaTTXc0x0RO3SHbZ5M9n5GsoVyxpv51D4Y/+N6xXokWaavJX7W8euy099/5QnanI/kw1eLkUXLp92alTPTu+cm/VFquur/1C7T1Ks/qhF87cfaNOrswr2l21qNy/9bZYjU4p6larq8NurNJk4dlf+rXbX9uMofqiWLRPUp4vWepfgd3emQPqqtzekFKT7opyfwQm0R25Noj3bbC3VzrnpVh5T8XXKuP4p6Iitnxx3KK2oxV7sk2y+SfOt0d7oxo9vFLnZr7sOh/iIL62kdKt/UcUfp3lM9jck2HTpLJlblSWnut81Xr9mL1+LZVvrMk9eFPJ6hlt+nwnOBs+qiCrx6qqoLqhXGMF8EVZtNu1K1ptO8y9Ohx5AAAAAAAAAAAAAAAAAAAAwHRiHGEckfGT8lnqr1TtCds9ZOsQ8WP1xDqdbM+RHyIroLvZIjlDIdevZlHJGUIA6AAAAAAAAAD/2Q==",
    "All balls have been dropped from the first section!"
  );

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
      <Flex flexWrap="wrap" p={8} w="100%" justifyContent="space-around">
        <Flex flexWrap="wrap" justifyContent="space-between" w="33%">
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
        <Flex flexWrap="wrap" w="33%" justifyContent="space-between">
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
      {galtonBoardSections.map(
        (galtonBoardSection: IGaltonBoardSection, galtonBoardIndex: number) => {
          return (
            <GaltonBoardSection
              key={galtonBoardIndex}
              data={galtonBoardSection}
              galtonBoardIndex={galtonBoardIndex}
              showBallsMode={showBallsMode}
              ballSize={ballSize}
            />
          );
        }
      )}
    </StyledGaltonBoardWrapper>
  );
};

export default GaltonBoard;
