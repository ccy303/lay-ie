import React, { useEffect, useState } from "react";
import { observable } from "mobx";
import { Observer } from "mobx-react-lite";
const store = observable({
    C: null
});
export default props => {
    useEffect(() => {
        (async () => {
            const Com = (await import("../home")).default;
            console.log(Com);
            store.C = Com;
            // console.log(123, C);
            // serCom(C);
        })();
    }, []);
    return (
        <Observer>
            {() => {
                return <>{store.C && <store.C gStore={{}} />}</>;
            }}
        </Observer>
    );
};
