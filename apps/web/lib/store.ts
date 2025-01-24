import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./features/counter/counterSlice";
import { quotesApiSlice } from "./features/quotes/quotesApiSlice";

// `combineSlices` 会自动根据 `reducerPath` 合并各个 reducer，
// 因此我们不再需要手动调用 `combineReducers`。
const rootReducer = combineSlices(counterSlice, quotesApiSlice);
// 从 rootReducer 推断出 `RootState` 类型
export type RootState = ReturnType<typeof rootReducer>;

// `makeStore` 封装了 store 的配置，允许创建唯一的 store 实例，
// 这在服务器端渲染（SSR）场景中特别重要。
// 在 SSR 中，每个请求都需要单独的 store 实例，以防止跨请求状态污染。
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    // 添加 api 中间件，启用缓存、失效、轮询等
    // 以及 `rtk-query` 的其他有用功能。
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(quotesApiSlice.middleware);
    },
  });
};

// 推断 `makeStore` 的返回类型
export type AppStore = ReturnType<typeof makeStore>;
// 从 store 中推断出 `AppDispatch` 类型
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
