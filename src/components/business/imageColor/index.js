import React from "react";
import style from "./index.less";
import { useLocalStore } from "mobx-react-lite";

export default () => {
	const store = useLocalStore(() => ({
		data: [require("@images/i1.jpeg"), require("@images/i2.jpeg")],
	}));

	return (
		<div className={`${style["warp"]}`}>
			<div className={`${style["container"]}`}>
				{store.data.map((v, i) => {
					return (
						<div className={`${style["img-item"]} `}>
							<div
								key={i}
								className={`${style["bg"]}`}
								style={{
									backgroundImage: `url(${v})`,
								}}
							/>
							<div key={i} className={style["img"]}>
								<img src={v} alt="" />
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
