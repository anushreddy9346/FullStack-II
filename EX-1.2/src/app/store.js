import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice";
import platformsReducer from "../features/platforms/platformsSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer
  }
});
