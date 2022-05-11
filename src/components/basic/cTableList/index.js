import React from "react";
import CForm from "./../cForm";
import { Table, Button } from "antd";
import { useLocalStore, Observer } from "mobx-react-lite";
import { autorun } from "mobx";
import { getClientW } from "@utils";
import style from "./index.less";
import axios from "@src/http/http.js";

export default props => {
    const { search, columns = [], dataSource = [], pagination = {}, requestCfg } = props;

    const store = useLocalStore(() => ({
        total: dataSource.length,
        pageSize: 10,
        page: 1,
        data: dataSource,
        loading: true
    }));

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

    const getBtnCol = () => {
        const span = { xs: 12, lg: 8, xl: 8, xxl: 6 }[getClientW(true)];
        let i = 0;
        const { items } = search;
        while (!Array.isArray(items[items.length - 1 - i])) {
            i++;
            if (items.length == i) {
                break;
            }
        }
        search.items.push({
            colSpan: {
                span: 24 - (i % (24 / span)) * span
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
    };

    getBtnCol();

    const [form] = CForm.useForm();

    const formatColumns = () => {
        let out = [];
        out = columns.map(v => {
            return { key: v.datadataIndex, align: "center", render: (text, record, index) => text || "-", ...v };
        });
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
        return out;
    };

    return (
        <Observer>
            {() => (
                <div>
                    {!!search && (
                        <div className={style["form-warp"]}>
                            <CForm {...{ form, ...search }} />
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
                                store.page = page;
                                store.pageSize = pageSize;
                            },
                            size: "default",
                            ...pagination
                        }}
                    />
                </div>
            )}
        </Observer>
    );
};
