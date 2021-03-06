import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axios';

export const categoryGetAll = createAsyncThunk(
  'category/categoryGetAll',
  async (_, { rejectWithValue }) => {
    try {
      return (await axiosInstance.get(`/category/all`)).data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.errs?.join(' - '));
    }
  }
);

export const categoryGetByPage = createAsyncThunk(
  'category/categoryGetByPage',
  async ({ limit, page }, { rejectWithValue }) => {
    try {
      return (await axiosInstance.get(`/category?limit=${limit}&page=${page}`)).data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.errs?.join(' - '));
    }
  }
);

export const categoryUpdate = createAsyncThunk(
  'category/categoryUpdate',
  async ({ name, category_id }, { rejectWithValue }) => {
    try {
      await axiosInstance.put(`/category`, { name, category_id });
      return { name, category_id };
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.errs?.join(' - '));
    }
  }
);

export const categoryAddNew = createAsyncThunk(
  'category/categoryAddNew',
  async ({ name }, { rejectWithValue }) => {
    try {
      return (await axiosInstance.post(`/category`, { name })).data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.errs?.join(' - '));
    }
  }
);
export const categoryDelete = createAsyncThunk(
  'category/categoryDelete',
  async ({ category_id }, { rejectWithValue }) => {
    try {
      return (await axiosInstance.delete(`/category/${category_id}`)).data;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data.errs?.join(' - '));
    }
  }
);

const categorySlice = createSlice({
  name: 'categorySlice',
  initialState: {
    allData: [],
    count: 0,
    data: [],
    page: 0,
    total_page: 0,
  },
  reducers: {
    removeCategoryById: (state, action) => {
      state.data = state.data.filter((item) => item.category_id !== action.payload);
      state.count = state.count - 1;
    },
  },
  extraReducers: {
    [categoryGetByPage.fulfilled]: (state, action) => {
      const { count, page, total_page, data } = action.payload;
      state.count = count;
      state.data = data;
      state.page = page;
      state.total_page = total_page;
    },
    [categoryGetAll.pending]: (state) => {},
    [categoryGetAll.fulfilled]: (state, action) => {
      state.allData = action.payload.data;
    },
    [categoryAddNew.fulfilled]: (state, action) => {
      state.data = [...state.data, action.payload];
      state.count = state.count + 1;
    },
    [categoryUpdate.fulfilled]: (state, action) => {
      const { category_id, name } = action.payload;
      state.data = state.data.map((item) =>
        item.category_id === category_id ? { ...item, name: name } : item
      );
    },
  },
});

export const categoryActions = categorySlice.actions;
export default categorySlice;
