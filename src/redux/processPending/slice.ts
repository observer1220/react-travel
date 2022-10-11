import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ProcessPendingState {
  loading: boolean;
  error: string | null;
  data: any[];
}

const initialState: ProcessPendingState = {
  loading: true,
  error: null,
  data: [],
};

// 取得待辦製程列表
export const getProcessPendingList = createAsyncThunk(
  "processPending/getProcessPendingList",
  async (thunkAPI) => {
    const { data } = await axios.get("http://localhost:3002/comments");
    return data;
  }
);

// 新增待辦製程
export const addProcessPendingList = createAsyncThunk(
  "processPending/addProcessPendingList",
  async (formData: object, thunkAPI) => {
    const { data } = await axios.post("http://localhost:3002/comments", {
      ...formData,
    });
    console.log(data);
    return data;
  }
);

// 編輯待辦製程
export const editProcessPendingList = createAsyncThunk(
  "processPending/editProcessPendingList",
  async (
    formData: { todos: string; remarks: string; username: string; id: number },
    thunkAPI
  ) => {
    const { data } = await axios.put(
      `http://localhost:3002/comments/${formData.id}`,
      {
        todos: formData.todos,
        remarks: formData.remarks,
        username: formData.username,
      }
    );
    // console.log(data);
    return data;
  }
);

// 刪除待辦製程
export const delProcessPendingList = createAsyncThunk(
  "processPending/delProcessPendingList",
  async (id: number, thunkAPI) => {
    const { data } = await axios.delete(`http://localhost:3002/comments/${id}`);
    return data;
  }
);

export const ProcessPendingListSlice = createSlice({
  name: "processPending",
  initialState,
  reducers: {},
  extraReducers: {
    // 取得待辦製程列表
    [getProcessPendingList.pending.type]: (state) => {
      state.loading = true;
    },
    [getProcessPendingList.fulfilled.type]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    [getProcessPendingList.rejected.type]: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 新增待辦製程
    [addProcessPendingList.pending.type]: (state) => {
      state.loading = true;
    },
    [addProcessPendingList.fulfilled.type]: (state, action) => {
      state.data.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    [addProcessPendingList.rejected.type]: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 編輯待辦製程
    [editProcessPendingList.pending.type]: (state) => {
      state.loading = true;
    },
    [editProcessPendingList.fulfilled.type]: (state, action) => {
      state.data.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    [editProcessPendingList.rejected.type]: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 刪除待辦製程
    [delProcessPendingList.pending.type]: (state) => {
      state.loading = true;
    },
    [delProcessPendingList.fulfilled.type]: (state, action) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
    [delProcessPendingList.rejected.type]: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
