import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ---------------- NEWS API ---------------- //
export const fetchNews = createAsyncThunk("crypto/fetchNews", async () => {
  const options = {
    method: "GET",
    url: "https://bing-news-search1.p.rapidapi.com/news",
    params: { safeSearch: "Off", textFormat: "Raw" },
    headers: {
      "X-BingApis-SDK": "true",
      "X-RapidAPI-Key": "989aee69acmshd1159510b0b54ecp11a463jsn347e21ca232f", // 🔑 replace with your key
      "X-RapidAPI-Host": "bing-news-search1.p.rapidapi.com",
    },
  };

  const response = await axios.request(options);
  console.log("NEWS API Response:", response.data); // 👀 Debug
  return response.data.value; // Bing returns { value: [...] }
});

const cryptoSlice = createSlice({
  name: "crypto",
  initialState: {
    news: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default cryptoSlice.reducer;
