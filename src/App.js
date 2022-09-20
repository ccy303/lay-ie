import React from "react";
import PermissionRoute from "./routes/PermissionRoute";
import style from "./app.less";
const App = props => {
    return (
        <div className={style.app}>
            <div className={style.left}>1</div>
            <div className={style.right}>
                <PermissionRoute />
            </div>
        </div>
    );
};

export default App;
