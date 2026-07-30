import { logAction } from "../features/ui/uiSlice";

// Custom Redux Middleware to automatically record dispatched actions into state for the visual Inspector
export const actionLoggerMiddleware = (storeAPI) => (next) => (action) => {
  // Prevent infinite loop when logging the logAction itself
  if (action.type !== "ui/logAction" && action.type !== "ui/addToast") {
    try {
      storeAPI.dispatch(
        logAction({
          type: action.type,
          payload: action.payload ? JSON.stringify(action.payload).slice(0, 100) : "undefined"
        })
      );
    } catch {
      // Ignore formatting errors
    }
  }
  return next(action);
};
