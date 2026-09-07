import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  email: string;
  logged: boolean;
};

const initialState: UserState = {
  email: "",
  logged: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
      state.logged = true;
    },

    logout: (state) => {
      state.email = "";
      state.logged = false;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;