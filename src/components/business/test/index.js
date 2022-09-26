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
            store.C = Com;
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
