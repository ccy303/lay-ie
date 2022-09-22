import React from "react";
import PermissionRoute from "./routes/PermissionRoute";
import style from "./app.less";
import { Collapse } from "antd";
const { Panel } = Collapse;

import { DndProvider } from "react-dnd";

import { HTML5Backend } from "react-dnd-html5-backend";

import DragCom from "@src/components/business/dragCom";
import RouteEdit from "@src/components/business/routeEdit";

const App = props => {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className={style.app}>
                <div className={style.left}>
                    <Collapse defaultActiveKey={["2"]}>
                        <Panel header='组件' key='1'>
                            <DragCom />
                        </Panel>
                        <Panel header='路由编辑' key='2'>
                            <RouteEdit />
                        </Panel>
                    </Collapse>
                </div>
                <div className={style.right}>
                    <PermissionRoute DESIGN={true} />
                </div>
            </div>
        </DndProvider>
    );
};

export default App;
