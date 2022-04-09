import React from "react";
import PermissionRoute from "./routes/PermissionRoute";
import { configure } from "mobx";
import "./app.less";
configure({
  enforceActions: "never",
  // useProxies: "never",
});
const App = (props) => {
  return <PermissionRoute />;
};

export default App;
