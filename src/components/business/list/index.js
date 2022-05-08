import { Link } from "react-router-dom";
import React from "react";
import TableList from "@base/cTableList";
export default props => {
    return (
        <>
            <TableList />
            <Link to='/admin/noMenuRoute/page1/h1231232'>详情</Link>;
        </>
    );
};
