import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activePlatformFilter: "ALL",
  searchQuery: "",
  statusFilter: "ALL",
  isComposerOpen: false,
  editingPostId: null,
  showStateInspector: false,
  toasts: [],
  actionLog: []
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setPlatformFilter: (state, action) => {
      state.activePlatformFilter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    openComposer: (state, action) => {
      state.isComposerOpen = true;
      state.editingPostId = action.payload || null;
    },
    closeComposer: (state) => {
      state.isComposerOpen = false;
      state.editingPostId = null;
    },
    toggleStateInspector: (state) => {
      state.showStateInspector = !state.showStateInspector;
    },
    addToast: (state, action) => {
      const toast = {
        id: `toast-${Date.now()}`,
        type: action.payload.type || "info",
        message: action.payload.message
      };
      state.toasts.unshift(toast);
      if (state.toasts.length > 5) state.toasts.pop();
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    logAction: (state, action) => {
      state.actionLog.unshift({
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toLocaleTimeString(),
        type: action.payload.type,
        payload: action.payload.payload
      });
      if (state.actionLog.length > 25) state.actionLog.pop();
    }
  }
});

export const {
  setPlatformFilter,
  setSearchQuery,
  setStatusFilter,
  openComposer,
  closeComposer,
  toggleStateInspector,
  addToast,
  removeToast,
  logAction
} = uiSlice.actions;

export default uiSlice.reducer;
