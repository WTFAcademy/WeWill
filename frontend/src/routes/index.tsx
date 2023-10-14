import { Routes, Route } from "react-router-dom";

import Login from "src/pages/login";
import Sponsor from "src/pages/sponsor";
import User from "src/pages/user";
import Flag from "src/pages/flag";

const rouers: { path: string; el: () => JSX.Element }[] = [
  {
    path: "*",
    el: Login,
  },
  {
    path: 'Flag',
    el: Flag,
  },
  {
    path: "sponsor",
    el: Sponsor,
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
