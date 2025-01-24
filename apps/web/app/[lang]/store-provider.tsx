"use client";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/lib/store";
import { setupListeners } from "@reduxjs/toolkit/query";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode; // 子组件
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // 在第一次渲染时创建 store 实例
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (storeRef.current != null) {
      // 使用提供的默认配置设置监听器
      // 可选，但对于 `refetchOnFocus`/`refetchOnReconnect` 行为是必需的
      const unsubscribe = setupListeners(storeRef.current.dispatch);
      return unsubscribe;
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
