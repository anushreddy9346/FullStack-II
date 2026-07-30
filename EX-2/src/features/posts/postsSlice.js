import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    id: "1",
    title: "🚀 Welcome to Centralized State Management",
    content: "Managing global app state easily using Redux Toolkit slices, reducers, and centralized store.",
    platformId: "instagram",
    likes: 24,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "⚡ Scalable React State Handling",
    content: "Connecting React components to the global Redux store using useSelector and useDispatch hooks.",
    platformId: "twitter",
    likes: 18,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "📢 Cross-Platform Community Update",
    content: "Eliminating prop drilling and keeping platform data synchronized across components.",
    platformId: "facebook",
    likes: 31,
    createdAt: new Date().toISOString()
  }
];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.unshift({
        id: Date.now().toString(),
        title: action.payload.title,
        content: action.payload.content,
        platformId: action.payload.platformId,
        likes: 0,
        createdAt: new Date().toISOString()
      });
    },
    deletePost: (state, action) => {
      return state.filter((post) => post.id !== action.payload);
    },
    toggleLike: (state, action) => {
      const post = state.find((p) => p.id === action.payload);
      if (post) {
        post.likes += 1;
      }
    }
  }
});

export const { addPost, deletePost, toggleLike } = postsSlice.actions;
export default postsSlice.reducer;
