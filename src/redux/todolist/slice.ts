import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ITodoList } from "../../interface/interface";

interface TodolistState {
  loading: boolean;
  error: string | null;
  data: ITodoList[];
  dialog: boolean;
}

const initialState: TodolistState = {
  loading: true,
  error: null,
  data: [],
  dialog: false,
};

// 取得待辦事項列表
export const getTodolist = createAsyncThunk(
  "todolist/getTodolist",
  async (thunkAPI) => {
    const { data } = await axios.get("http://localhost:3002/posts");
    return data;
  }
);

// 新增待辦事項
export const addTodolist = createAsyncThunk(
  "todolist/addTodolist",
  async (formData: ITodoList, thunkAPI) => {
    const { data } = await axios.post("http://localhost:3002/posts", {
      todos: formData.todos,
      remarks: formData.remarks,
      category: formData.category,
      EstEndDate: formData.EstEndDate,
      trustee: formData.trustee,
      phone: formData.phone,
      enabled: formData.enabled,
      username: formData.username,
    });
    // console.log(data);
    return data;
  }
);

// 編輯待辦事項
export const editTodolist = createAsyncThunk(
  "todolist/editTodolist",
  async (formData: ITodoList, thunkAPI) => {
    const { data } = await axios.put(
      `http://localhost:3002/posts/${formData.id}`,
      {
        todos: formData.todos,
        remarks: formData.remarks,
        category: formData.category,
        EstEndDate: formData.EstEndDate,
        trustee: formData.trustee,
        phone: formData.phone,
        enabled: formData.enabled,
        username: formData.username,
      }
    );
    // console.log(data);
    return data;
  }
);

// 刪除待辦事項
export const delTodolist = createAsyncThunk(
  "todolist/delTodolist",
  async (id: number, thunkAPI) => {
    const { data } = await axios.delete(`http://localhost:3002/posts/${id}`);
    return data;
  }
);

export const todolistSlice = createSlice({
  name: "todolist",
  initialState,
  reducers: {},
  extraReducers: {
    // 取得待辦事項列表
    [getTodolist.pending.type]: (state) => {
      state.loading = true;
    },
    [getTodolist.fulfilled.type]: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    [getTodolist.rejected.type]: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 新增待辦事項
    [addTodolist.pending.type]: (state) => {
      state.loading = true;
    },
    [addTodolist.fulfilled.type]: (state, action) => {
      state.data.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    [addTodolist.rejected.type]: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 編輯待辦事項
    [editTodolist.pending.type]: (state) => {
      state.loading = true;
    },
    [editTodolist.fulfilled.type]: (state, action) => {
      state.data.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    [editTodolist.rejected.type]: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 刪除待辦事項
    [delTodolist.pending.type]: (state) => {
      state.loading = true;
    },
    [delTodolist.fulfilled.type]: (state, action) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
    [delTodolist.rejected.type]: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
