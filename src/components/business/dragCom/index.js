import React from "react";
import CTableList from "@base/cTableList";
import { Row, Col, Button } from "antd";

import { useDrag } from "react-dnd";

import style from "./index.less";

const ComList = [
    {
        name: "表格",
        conpoment: <CTableList />
    },
    {
        name: "步骤条",
        conpoment: <Button>按钮</Button>
    }
];

const ComItem = props => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "compoment",
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
        })
    }));
    return (
        <div
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: "move"
            }}
        >
            <div ref={drag} className={style["com-item"]}>
                {props.conpoment}
            </div>
            <div className={style["label"]}>{props.name}</div>
        </div>
    );
};

export default props => {
    return (
        <div className={style.container}>
            <div className={style["com-box"]}>
                <Row gutter={30}>
                    {ComList.map(item => {
                        return (
                            <Col>
                                <ComItem {...item} />
                            </Col>
                        );
                    })}
                </Row>
            </div>
        </div>
    );
};
