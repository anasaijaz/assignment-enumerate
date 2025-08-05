import { configureStore } from "@reduxjs/toolkit";
import mediaReducer from "./mediaSlice";
import timelineReducer from "./timelineSlice";

export const store = configureStore({
  reducer: {
    media: mediaReducer,
    timeline: timelineReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore File objects in actions and state
        ignoredActions: ["media/addMediaFile", "media/uploadMediaFile"],
        ignoredPaths: ["media.mediaFiles"],
      },
    }),
});
