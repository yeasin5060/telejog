import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';
import { dummyUserProfile } from '@/assets/assets';

export interface AuthState {
  isSignedIn: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  isSignedIn: true, // Initially signed in to match demo state
  token: 'telejog_demo_token_xyz',
  user: dummyUserProfile as User,
  loading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user?: User; token?: string } | undefined>) => {
      state.isSignedIn = true;
      state.token = action?.payload?.token || 'telejog_demo_token_xyz';
      if (action?.payload?.user) {
        state.user = action.payload.user;
      } else if (!state.user) {
        state.user = dummyUserProfile as User;
      }
      state.loading = false;
    },
    logout: (state) => {
      state.isSignedIn = false;
      state.token = null;
      state.user = null;
      state.loading = false;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { login, logout, updateUserProfile, setLoading } = authSlice.actions;

export default authSlice.reducer;
