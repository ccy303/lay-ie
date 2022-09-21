import React from "react";
import PermissionRoute from "./routes/PermissionRoute";
import style from "./app.less";

import { useDrag, DndProvider } from "react-dnd";

import { HTML5Backend } from "react-dnd-html5-backend";

const Test = () => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "Test",
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
        })
    }));
    return (
        <div
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                fontSize: 25,
                fontWeight: "bold",
                cursor: "move"
            }}
        >
            ♘
        </div>
    );
};

const App = props => {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className={style.app}>
                <div className={style.left}>
                    <Test />
                </div>
                <div className={style.right}>
                    <PermissionRoute />
                </div>
            </div>
        </DndProvider>
    );
};

export default App;
