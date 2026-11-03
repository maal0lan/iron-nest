import { createSlice } from '@reduxjs/toolkit';

const loadTheme = () => {
  try {
    return localStorage.getItem('ironnest_theme') || 'light';
  } catch { return 'light'; }
};

const applyTheme = (name) => {
  if (typeof document === 'undefined') return;
  if (name === 'light') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', name);
  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: { name: loadTheme() },
  reducers: {
    setTheme: (state, action) => {
      state.name = action.payload;
      localStorage.setItem('ironnest_theme', action.payload);
      applyTheme(action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;
export const selectTheme = (state) => state.theme.name;
export default themeSlice.reducer;
