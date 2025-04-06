import { logout } from "../slices/authSlice";
import { createStore } from "../store";
export const fullCleanup = () => async (dispatch) => {
  const { persistor } = await createStore();
  try {
    // 1. Clear Redux state
    dispatch(logout());

    // 2. Purge persisted data from storage
    await persistor.purge();

    window.location.reload();
    return { success: true };
  } catch (error) {
    console.error("Logout failed:", error);
    throw error; // Re-throw to handle in component
  }
};
