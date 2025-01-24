// 需要使用 React 特定的入口点来导入 `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Quote {
  id: number;
  quote: string;
  author: string;
}

interface QuotesApiResponse {
  quotes: Quote[];
  total: number;
  skip: number;
  limit: number;
}

// 定义一个服务，使用基础 URL 和预期的端点
export const quotesApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://dummyjson.com/quotes" }),
  reducerPath: "quotesApi",
  // 标签类型用于缓存和失效管理。
  tagTypes: ["Quotes"],
  endpoints: (build) => ({
    // 为返回类型（在此例中为 `QuotesApiResponse`）和预期的查询参数提供泛型
    // 如果没有参数，使用 `void` 作为参数类型。
    getQuotes: build.query<QuotesApiResponse, number>({
      query: (limit = 10) => `?limit=${limit}`,
      // `providesTags` 决定哪个 'tag' 被附加到
      // 查询返回的缓存数据。
      providesTags: (result, error, id) => [{ type: "Quotes", id }],
    }),
  }),
});

// 钩子由 RTK-Query 自动生成
// 相当于 `quotesApiSlice.endpoints.getQuotes.useQuery`
export const { useGetQuotesQuery } = quotesApiSlice;
