import { Link } from "react-router-dom";
import React from "react";
import TableList from "@base/cTableList";
import { Button } from "antd";
import moment from "moment";
export default props => {
    const cForm_0_cfg = {
        submitBtn: false,
        initialValues: {
            1321: ["2020-3", "2020-4"]
        },
        items: [
            {
                label: "关键词",
                name: "1321",
                type: "rangeDataPicker",
                props: {
                    picker: "quarter"
                }
            },
            {
                label: "关键词",
                name: "132a",
                type: "text"
            },
            {
                label: "关键词",
                name: "132s",
                type: "text"
            },
            {
                label: "关键词",
                name: "132d",
                type: "text"
            },
            {
                label: "关键词",
                name: "132f",
                type: "text"
            },
            {
                label: "关键词",
                name: "132g",
                type: "text"
            },
            {
                label: "关键词",
                name: "13d2",
                type: "text"
            },
            {
                label: "关键词",
                name: "13d222",
                type: "text"
            },
            {
                label: "关键词",
                name: "13d222s",
                type: "text"
            }
        ]
    };

    const columns = [
        { title: "列1", dataIndex: "a" },
        { title: "列2", dataIndex: "b" },
        { title: "列3", dataIndex: "c" },
        { title: "列4", dataIndex: "d" },
        { title: "列5", dataIndex: "e" },
        { title: "列6", dataIndex: "f" },
        { title: "列7", dataIndex: "g" }
    ];
    const [table] = TableList.useTable();

    const dataSource = new Array(51).fill({
        a: "asdas",
        b: "asdas",
        c: "asdas",
        d: "asdas",
        e: "asdas",
        f: "asdas",
        g: "asdas"
    });

    const getData1 = async params => {
        return { data: dataSource, total: 52 };
    };

    const getData2 = params => {
        return Promise.resolve({ data: dataSource, total: 52 });
    };

    return (
        <>
            <Button
                onClick={() => {
                    table.reload();
                }}
            >
                点击
            </Button>
            <TableList
                rowKey='a'
                table={table}
                search={cForm_0_cfg}
                columns={columns}
                requestCfg={"http://localhost:2326/getLost"}
                // requestCfg={getData1}
            />
            <Link to='/admin/noMenuRoute/page1/h1231232'>详情</Link>;
        </>
    );
};
