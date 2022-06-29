import React, { useEffect, useRef, useState } from "react";
import CForm from "./../cForm";
import { Table, Button } from "antd";
import { useLocalStore, Observer } from "mobx-react-lite";
import { autorun, runInAction } from "mobx";
import { getClientW } from "@utils";
import style from "./index.less";
import axios from "@src/http/http.js";
import { copy } from "copy-anything";
const useTable = (table = {}) => {
    const tableRef = useRef(table);

    return [tableRef.current];
};

const __INTTSTORE__ = {
    total: 0,
    pageSize: 10,
    page: 1,
    data: [],
    loading: true
};

const TableWarp = props => {
    const { table = {}, ...other } = props;
    const [key, forceUpdate] = useState(parseInt(Math.random() * 100000));
    useEffect(() => {
        table.reload = () => {
            forceUpdate(parseInt(Math.random() * 100000));
        };
    }, [table]);
    return <TableList key={key} {...other} />;
};

const TableList = props => {
    const { showIndex = true, search, columns = [], dataSource = [], pagination = {}, requestCfg, ...other } = props;
    const store = useLocalStore(() => ({
        ...__INTTSTORE__,
        pageSize: pagination.defaultPageSize || pagination.pageSize || __INTTSTORE__.pageSize,
        page: pagination.page || pagination.page || __INTTSTORE__.page
    }));

    useEffect(() => {
        store.total = dataSource.length;
        store.data = dataSource;
    }, [dataSource]);

    const getData = async _params => {
        const params = {
            pageSize: store.pageSize,
            page: store.page,
            ..._params
        };
        let data;
        let total;
        store.loading = true;
        if (["[object Function]", "object AsyncFunction"].includes(Object.prototype.toString.call(requestCfg))) {
            ({ data, total } = await requestCfg(params));
        }
        if (typeof requestCfg == "string") {
            ({ data, total } = await axios.get(requestCfg, { params }));
        }
        store.loading = false;
        store.total = total;
        store.data = data;
    };

    autorun(() => {
        getData({
            page: store.page,
            pageSize: store.pageSize
        });
    });

    const onSearch = async () => {
        const data = await form.validateFields();
        getData(data);
    };

    const onReset = () => {
        form.resetFields();
    };

    const getBtnCol = search => {
        const out = copy(search);
        let i = 0;
        const { items } = out;
        // row 下有${i} 个 col
        while (!Array.isArray(items[items.length - 1 - i])) {
            i++;
            if (items.length == i) {
                break;
            }
        }
        // span:{xs: 12, lg: 8, xl: 8, xxl: 6} {24 - (i % (24 / span)) * span}
        out.items.push({
            colSpan: {
                xs: 24 - (i % 2) * 12,
                lg: 24 - (i % 3) * 8,
                xl: 24 - (i % 3) * 8,
                xxl: 24 - (i % 4) * 6
            },
            dom: (
                <div className={style["btn-groups"]}>
                    <Button className={style["mr-20"]} onClick={onReset}>
                        重置
                    </Button>
                    <Button type='primary' onClick={onSearch}>
                        搜索
                    </Button>
                </div>
            )
        });

        out.submitBtn = false;

        return out;
    };

    const [form] = CForm.useForm();

    const formatColumns = () => {
        let out = [];
        out = columns.map(v => {
            return { key: v.datadataIndex, align: "center", render: (text, record, index) => text || "-", ...v };
        });
        if (showIndex) {
            out = [
                {
                    title: "序号",
                    align: "center",
                    render: (text, record, index) => {
                        return ++index + (store.page - 1) * store.pageSize;
                    }
                },
                ...out
            ];
        }
        return out;
    };

    return (
        <Observer>
            {() => (
                <div>
                    {!!search && (
                        <div className={style["form-warp"]}>
                            <CForm {...{ form, ...getBtnCol(search) }} />
                        </div>
                    )}
                    <Table
                        loading={store.loading}
                        size='middle'
                        bordered
                        columns={formatColumns(columns)}
                        dataSource={store.data}
                        pagination={{
                            total: store.total,
                            showQuickJumper: true,
                            pageSizeOptions: [10, 20, 50],
                            showTotal: (total, range) => `共 ${total} 条数据/共 ${Math.ceil(store.total / store.pageSize)} 页`,
                            onChange: (page, pageSize) => {
                                runInAction(() => {
                                    store.page = page;
                                    store.pageSize = pageSize;
                                });
                            },
                            size: "default",
                            ...pagination
                        }}
                        {...other}
                    />
                </div>
            )}
        </Observer>
    );
};

TableWarp.useTable = useTable;

export default TableWarp;
