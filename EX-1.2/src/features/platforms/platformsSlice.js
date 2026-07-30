import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { id: "instagram", name: "Instagram", handle: "@brand_insta", color: "#E4405F", connected: true },
  { id: "facebook", name: "Facebook", handle: "Brand Community", color: "#1877F2", connected: true },
  { id: "twitter", name: "Twitter", handle: "@brand_tweets", color: "#1DA1F2", connected: true }
];

const platformsSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {
    togglePlatform: (state, action) => {
      const platform = state.find((p) => p.id === action.payload);
      if (platform) {
        platform.connected = !platform.connected;
      }
    }
  }
});

export const { togglePlatform } = platformsSlice.actions;
export default platformsSlice.reducer;
