import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { TOTAL_BALLS } from "../../global/constants";

export interface IGaltonBucket {
  balls: number;
}

export type LoadingStates = "idle" | "loading" | "failed";

export type BucketHeightType = "small" | "normal";

export enum LOADING_STATES {
  idle = "idle",
  loading = "loading",
  failed = "failed",
}
export enum BUCKET_HEIGHT {
  small = "small",
  normal = "normal",
}

export interface IGaltonBoardSection {
  buckets: IGaltonBucket[];
  totalBallsToDrop: number;
  status: LoadingStates;
}
export interface GaltonBoardInitialState {
  galtonBoarSections: IGaltonBoardSection[];
  histogramOfFirstGaltonBoard: IGaltonBoardSection;
  status: LoadingStates;
  maxAmountOfBallsPerBucket: number;
  bucketHeight: BucketHeightType;
}

const buckets: IGaltonBucket[] = [
  { balls: 0 },
  { balls: 0 },
  { balls: 0 },
  { balls: 0 },
  { balls: 0 },
  { balls: 0 },
  { balls: 0 },
  { balls: 0 },
  { balls: 0 },
  { balls: 0 },
];

const initialState: GaltonBoardInitialState = {
  galtonBoarSections: [
    {
      buckets,
      totalBallsToDrop: TOTAL_BALLS,
      status: LOADING_STATES.idle,
    },
  ],
  histogramOfFirstGaltonBoard: {
    buckets: [],
    totalBallsToDrop: 0,
    status: LOADING_STATES.idle,
  },
  status: LOADING_STATES.idle,
  bucketHeight: "normal",
  maxAmountOfBallsPerBucket: 1000000,
};

export const getGaltonBoardProbabilityWeights = (buckets: IGaltonBucket[]) => {
  const end = buckets.length - 1;
  const center = end / 2;
  const probabilityMap = [];
  for (let i = 0; i < buckets.length; i++) {
    if (i === 0 || i === end) {
      probabilityMap.push(1);
    } else {
      if (i < center || i < center - 1) {
        const pLeft = i;
        probabilityMap.push(pLeft * 2);
      }
      if (i > center || i === center) {
        const pRight = end - i;
        probabilityMap.push(pRight * 2);
      }
    }
  }

  return probabilityMap;
};

export const getBucketIndexByProbability = (
  totalBuckets: number,
  weights: number[]
) => {
  let sum = 0;
  let result = 0;
  const weightsSum = weights.reduce((a, b) => a + b, 0);
  const random = Math.random() * weightsSum;
  for (let i = 0; i < totalBuckets; i++) {
    sum += weights[i];
    if (random <= sum) {
      result = i;

      break;
    }

    if (i === totalBuckets - 1) {
      result = i;
    }
  }
  return result;
};

const handleOverFLow = (probabilityIndex: number, amountOfBuckets: number) => {
  const median = amountOfBuckets / 2;
  let bucketToOverFlowIntoIndex = -1;

  if (probabilityIndex < median || probabilityIndex < median - 1) {
    bucketToOverFlowIntoIndex = probabilityIndex - 1;
  }
  if (probabilityIndex > median || probabilityIndex === median) {
    bucketToOverFlowIntoIndex = probabilityIndex + 1;
  }
  return bucketToOverFlowIntoIndex;
};

export const galtonBoardSlice = createSlice({
  name: "galtonBoard",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateMaxAmountOfBallsForOverFlow: (state) => {
      state.maxAmountOfBallsPerBucket =
        state.bucketHeight === "normal" ? (450 / 5) * 20 : (350 / 5) * 20;
    },
    updateBucketType: (state) => {
      const updatedBucketType =
        state.bucketHeight === BUCKET_HEIGHT.normal
          ? BUCKET_HEIGHT.small
          : BUCKET_HEIGHT.normal;
      state.maxAmountOfBallsPerBucket =
        state.bucketHeight === BUCKET_HEIGHT.small
          ? (450 / 5) * 20
          : (350 / 5) * 20;

      state.bucketHeight = updatedBucketType;
    },
    dropBallForFirstHistoGramToBucket: (state) => {
      state.histogramOfFirstGaltonBoard.status = LOADING_STATES.loading;
      const currentGaltonBoardSection = state.galtonBoarSections[0];
      const totalBallsInCurrentSection =
        currentGaltonBoardSection.buckets.reduce(
          (balls, bucket) => (balls += bucket.balls),
          1
        );
      let weights: number[] = getGaltonBoardProbabilityWeights(buckets);
      let probabilityIndex = getBucketIndexByProbability(
        state.galtonBoarSections[0].buckets.length,
        weights
      );
      if (currentGaltonBoardSection.totalBallsToDrop === 0) return;

      let currentGaltonBoardSectionBucketToUpdate =
        currentGaltonBoardSection.buckets[probabilityIndex];
      do {
        if (
          currentGaltonBoardSectionBucketToUpdate.balls >=
          state.maxAmountOfBallsPerBucket
        ) {
          probabilityIndex = handleOverFLow(probabilityIndex, buckets.length);
          currentGaltonBoardSectionBucketToUpdate =
            currentGaltonBoardSection.buckets[probabilityIndex];
        }
      } while (
        currentGaltonBoardSectionBucketToUpdate.balls >=
        state.maxAmountOfBallsPerBucket
      );
      currentGaltonBoardSectionBucketToUpdate.balls += 1;
      currentGaltonBoardSection.totalBallsToDrop -= 1;
      if (
        totalBallsInCurrentSection === TOTAL_BALLS ||
        currentGaltonBoardSection.totalBallsToDrop === 0
      ) {
        state.histogramOfFirstGaltonBoard.status = LOADING_STATES.idle;
        state.histogramOfFirstGaltonBoard = currentGaltonBoardSection;
        return;
      }
    },
    updateNewGaltonBoardSection: (state, action) => {
      const { indexOfSection, balls } = action.payload;
      const newSectionExists =
        state?.galtonBoarSections?.[indexOfSection + 1]?.buckets?.length;
      if (newSectionExists) {
        state.galtonBoarSections[indexOfSection + 1].totalBallsToDrop += balls;
      } else {
        const newGaltonBoardSection: IGaltonBoardSection = {
          buckets,
          totalBallsToDrop: balls,
          status: LOADING_STATES.idle,
        };

        state.galtonBoarSections = [
          ...state.galtonBoarSections,
          newGaltonBoardSection,
        ];
      }
    },
    dropBallFromBucketToNewGaltonBoardSection: (state, action) => {
      const { indexOfSection, indexOfBucketToDropBalls } = action.payload;
      const bucket =
        state.galtonBoarSections[indexOfSection].buckets[
          indexOfBucketToDropBalls
        ];
      if (bucket.balls === 0) return;
      const newGaltonBoardSection =
        state.galtonBoarSections[indexOfSection + 1];
      bucket.balls = bucket.balls - 1;
      let weights: number[] = getGaltonBoardProbabilityWeights(
        newGaltonBoardSection.buckets
      );
      let probabilityIndex = getBucketIndexByProbability(
        newGaltonBoardSection.buckets.length,
        weights
      );
      if (newGaltonBoardSection.totalBallsToDrop === 0) return;
      let bucketOfGaltonBoardSection =
        newGaltonBoardSection.buckets[probabilityIndex];

      do {
        if (
          bucketOfGaltonBoardSection.balls >= state.maxAmountOfBallsPerBucket
        ) {
          probabilityIndex = handleOverFLow(probabilityIndex, buckets.length);
          bucketOfGaltonBoardSection =
            newGaltonBoardSection.buckets[probabilityIndex];
        }
      } while (
        bucketOfGaltonBoardSection.balls >= state.maxAmountOfBallsPerBucket
      );
      if (
        (newGaltonBoardSection.buckets[probabilityIndex].balls / TOTAL_BALLS) *
          100 ===
        100
      )
        return;
      newGaltonBoardSection.buckets[probabilityIndex].balls += 1;
      newGaltonBoardSection.totalBallsToDrop -= 1;
    },
    saveHistogramOfFirstGaltonBoard: (state) => {
      state.histogramOfFirstGaltonBoard = state.galtonBoarSections[0];
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {},
});

export const {
  dropBallForFirstHistoGramToBucket,
  updateNewGaltonBoardSection,
  dropBallFromBucketToNewGaltonBoardSection,
  saveHistogramOfFirstGaltonBoard,
  updateMaxAmountOfBallsForOverFlow,
  updateBucketType,
} = galtonBoardSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const getGaltonBoardSections = (state: RootState) =>
  state.galtonBoard.galtonBoarSections;

export const getHistogramOfFirstGaltonBoardSection = (state: RootState) =>
  state.galtonBoard.histogramOfFirstGaltonBoard;
export const getBucketHeightType = (state: RootState) =>
  state.galtonBoard.bucketHeight;
// export const getTotalBallsToDrop = (state: RootState) =>
//   state.galtonBoard.galtonBoarSections[0].totalBallsToDrop;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const dropBallToBucketThunk =
//   (): AppThunk => async (dispatch, getState) => {
//     dispatch(dropBallToBucket());
//   };

export default galtonBoardSlice.reducer;
