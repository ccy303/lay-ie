import React, { useEffect, useRef, useState, useImperativeHandle } from "react";
import CForm from "./../cForm";
import { Table, Button } from "antd";
import { useLocalStore, Observer } from "mobx-react-lite";
import { autorun, runInAction } from "mobx";
import axios from "@src/http/http.js";
import { useLocation } from "react-router-dom";
import qs from "qs";
import { copy } from "copy-anything";
import { replaceUrl } from "@src/utils";
import style from "./index.less";
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

const TableWarp = React.memo(props => {
    const { table = {}, ...other } = props;
    const [key, forceUpdate] = useState(parseInt(Math.random() * 100000));
    const ref = useRef(null);

    useEffect(() => {
        table.reload = () => {
            forceUpdate(parseInt(Math.random() * 100000));
        };
        table.handleSearch = ref.current.handleSearch;
    }, [table]);

    return <TableList key={key} {...other} ref={ref} />;
});

const TableList = React.forwardRef((props, ref) => {
    const {
        queryToUrk = true,
        resetBtn = true,
        submitBtn = true,
        showIndex = true,
        search = {},
        columns = [],
        dataSource = [],
        pagination = {},
        requestCfg,
        ...other
    } = props;

    const query = qs.parse(location.hash.split("?")[1], { ignoreQueryPrefix: true });

    const store = useLocalStore(() => ({
        ...__INTTSTORE__,
        pageSize:
            query.per_page ||
            pagination.defaultPageSize ||
            pagination.pageSize ||
            __INTTSTORE__.pageSize,
        page: query.page || pagination.page || pagination.page || __INTTSTORE__.page
    }));

    useImperativeHandle(ref, () => {
        return {
            handleSearch: async () => {
                getData({
                    ...form.getFieldsValue(),
                    page: 1,
                    per_page: 10
                });
                runInAction(() => {
                    store.page = 1;
                    store.pageSize = 10;
                });
            }
        };
    });

    const [form] = CForm.useForm();

    const _location = useLocation();

    useEffect(() => {
        runInAction(() => {
            store.total = dataSource.length;
            store.data = dataSource;
        });
    }, [dataSource]);

    const getData = async _params => {
        const params = {
            per_page: store.pageSize,
            page: store.page,
            ..._params
        };
        let data;
        let total;
        store.loading = true;
        if (
            ["[object Function]", "object AsyncFunction"].includes(
                Object.prototype.toString.call(requestCfg)
            )
        ) {
            ({ data, total } = await requestCfg(params));
        }
        if (typeof requestCfg == "string") {
            ({ data, total } = await axios.get(requestCfg, { params }));
        }
        runInAction(() => {
            store.loading = false;
            store.total = total;
            store.data = data;
        });
        replaceUrl(
            `#${_location.pathname}${qs.stringify(
                { ...query, ...params },
                { addQueryPrefix: true }
            )}`,
            true
        );
    };

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
                    {resetBtn && (
                        <Button className={style["mr-20"]} onClick={onReset}>
                            重置
                        </Button>
                    )}
                    {submitBtn && (
                        <Button type='primary' onClick={onSearch}>
                            搜索
                        </Button>
                    )}
                </div>
            )
        });
        out.submitBtn = false;
        out.initialValues = { ...query };
        if (!!out.change2search) {
            const _onValuesChange = out.onValuesChange;
            out.onValuesChange = async e => {
                const [key] = Object.keys(e);
                const data = await form.validateFields();
                _onValuesChange?.();
                !out?.ignoreC2SNamePath?.includes(key) &&
                    getData({ ...data, per_page: 10, page: 1 });
                runInAction(() => {
                    store.page = 1;
                    store.pageSize = 10;
                });
            };
        }
        // ignoreC2SNamePath change2search 会触发react警告，删除字段
        const output = copy(out);
        delete output.ignoreC2SNamePath;
        delete output.change2search;
        return output;
    };

    const formatColumns = () => {
        let out = [];
        out = columns.map(v => {
            return {
                key: v.datadataIndex,
                align: "center",
                render: (text, record, index) => text || "-",
                ...v
            };
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

    useEffect(() => {
        getData({
            ...form.getFieldsValue(),
            page: store.page,
            per_page: store.pageSize
        });
    });

    return (
        <>
            {!!search && (
                <div className={style["form-warp"]}>
                    <CForm {...{ autoSetForm: false, form, ...getBtnCol(search) }} />
                </div>
            )}
            <Observer>
                {() => {
                    return (
                        <div>
                            <Table
                                loading={store.loading}
                                size='middle'
                                bordered
                                columns={formatColumns(columns)}
                                dataSource={store.data}
                                pagination={{
                                    defaultCurrent: store.page,
                                    defaultPageSize: store.pageSize,
                                    total: store.total,
                                    showQuickJumper: true,
                                    pageSizeOptions: [10, 20, 50],
                                    current: Number(store.page),
                                    pageSize: Number(store.pageSize),
                                    showTotal: (total, range) =>
                                        `共 ${total} 条数据/共 ${Math.ceil(
                                            store.total / store.pageSize
                                        )} 页`,
                                    onChange: (page, pageSize) => {
                                        runInAction(() => {
                                            store.page = page;
                                            store.pageSize = pageSize;
                                        });
                                        getData({
                                            ...form.getFieldsValue(),
                                            page: page,
                                            per_page: pageSize
                                        });
                                    },
                                    size: "default",
                                    ...pagination
                                }}
                                {...other}
                            />
                        </div>
                    );
                }}
            </Observer>
        </>
    );
});

TableWarp.useTable = useTable;

export default TableWarp;
