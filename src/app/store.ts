import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import galtonBoardReducer from "../features/galton/galtonSlice";

export const store = configureStore({
  reducer: {
    galtonBoard: galtonBoardReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
