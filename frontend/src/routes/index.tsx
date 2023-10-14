import { Routes, Route } from "react-router-dom";

import Login from "src/pages/login";
import Sponsor from "src/pages/sponsor";
import User from "src/pages/user";

const rouers: { path: string; el: () => JSX.Element }[] = [
  {
    path: "*",
    el: Login,
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
        <Route path={router.path} element={<router.el />} />
      ))}
    </Routes>
  );
};

export default AppRouter;
