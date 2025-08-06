import { configureStore } from "@reduxjs/toolkit";
import mediaReducer from "./mediaSlice";
import timelineReducer from "./timelineSlice";

export const store = configureStore({
  reducer: {
    media: mediaReducer,
    timeline: timelineReducer,
  },
});
