import { Routes, Route } from "react-router-dom";

import Home from "src/pages/home";
import Create from "src/pages/create";
import User from "src/pages/user";
import Flag from "src/pages/flag";

const rouers: { path: string; el: () => JSX.Element }[] = [
  {
    path: "*",
    el: Home,
  },
  {
    path: 'flag/:flagId',
    el: Flag,
  },
  {
    path: "create",
    el: Create,
  },
  {
    path: "user",
    el: User,
  },
];

const AppRouter = () => {
  return (
    <Routes>
      {rouers.map((router) => (
        <Route key={router.path} path={router.path} element={<router.el />} />
      ))}
    </Routes>
  );
};

export default AppRouter;
