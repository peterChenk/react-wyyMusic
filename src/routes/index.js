import React, { lazy, Suspense } from "react";
import { Redirect } from "react-router-dom";
import BlankLayout from "../layouts/BlankLayout";
import HomeLayout from "../layouts/HomeLayout";

// 1. 代码分片 2. 异步获取数据
const SuspenseComponent = Component => props => {
  return (
    <Suspense fallback={null}>
      <Component {...props}></Component>
    </Suspense>
  )
}

// const SingersComponent = lazy(() => import("../application/Singers/"));
const RecommendComponent = lazy(() => import("../application/Recommend/"));
const RankComponent = lazy(() => import("../application/Rank/"));
const AlbumComponent = lazy(() => import("../application/Album/"));

export default [
  {
    component: BlankLayout,
    routes: [
      {
        path: "/",
        component: HomeLayout,
        routes: [
          {
            path: "/",
            exact: true,
            render: () => <Redirect to={"/recommend"} />
          },
          {
            path: "/recommend",
            component: SuspenseComponent(RecommendComponent),
            routes: [
              {
                path: "/recommend/:id",
                component: SuspenseComponent(AlbumComponent)
              }
            ]
          },
          {
            path: "/rank/",
            component: SuspenseComponent(RankComponent),
            key: "rank",
            routes: [
              {
                path: "/rank/:id",
                component: SuspenseComponent(AlbumComponent)
              }
            ]
          }
        ]
      }
    ]
  }
]