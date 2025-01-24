import { createAppSlice } from "@/lib/createAppSlice";
import type { AppThunk } from "@/lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchCount } from "./counterAPI";

export interface CounterSliceState {
  value: number;
  status: "idle" | "loading" | "failed";
}

const initialState: CounterSliceState = {
  value: 0,
  status: "idle",
};

// 如果不使用异步 thunks，可以使用独立的 `createSlice`。
export const counterSlice = createAppSlice({
  name: "counter",
  // `createSlice` 会从 `initialState` 参数推断出 state 类型
  initialState,
  // `reducers` 字段让我们定义 reducers 并生成相关的 actions
  reducers: (create) => ({
    increment: create.reducer((state) => {
      // Redux Toolkit 允许我们在 reducers 中编写“变异”逻辑。它
      // 实际上并不会改变 state，因为它使用了 Immer 库，
      // Immer 会检测对“草稿状态”的更改，并根据这些更改生成一个全新的
      // 不可变状态。
      state.value += 1;
    }),
    decrement: create.reducer((state) => {
      state.value -= 1;
    }),
    // 使用 `PayloadAction` 类型声明 `action.payload` 的内容
    incrementByAmount: create.reducer(
      (state, action: PayloadAction<number>) => {
        state.value += action.payload;
      },
    ),
    // 下面的函数被称为 thunk，允许我们执行异步逻辑。它
    // 可以像常规 action 一样被分发：`dispatch(incrementAsync(10))`。
    // 这会使用 `dispatch` 函数作为第一个参数调用 thunk。然后可以执行异步
    // 代码并分发其他 actions。thunks 通常用于发起异步请求。
    incrementAsync: create.asyncThunk(
      async (amount: number) => {
        const response = await fetchCount(amount);
        // 我们返回的值将成为 `fulfilled` action 的 payload
        return response.data;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.value += action.payload;
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    ),
  }),
  // 你可以在这里定义选择器。这些选择器接收 slice
  // state 作为它们的第一个参数。
  selectors: {
    selectCount: (counter) => counter.value,
    selectStatus: (counter) => counter.status,
  },
});

// 为每个 case reducer 函数生成 action creators。
export const { decrement, increment, incrementByAmount, incrementAsync } =
  counterSlice.actions;

// 由 `slice.selectors` 返回的选择器接收根 state 作为它们的第一个参数。
export const { selectCount, selectStatus } = counterSlice.selectors;

// 我们还可以手动编写 thunks，这些 thunks 可能包含同步和异步逻辑。
// 这是一个示例，展示如何基于当前状态有条件地分发 actions。
export const incrementIfOdd =
  (amount: number): AppThunk =>
  (dispatch, getState) => {
    const currentValue = selectCount(getState());

    if (currentValue % 2 === 1 || currentValue % 2 === -1) {
      dispatch(incrementByAmount(amount));
    }
  };
