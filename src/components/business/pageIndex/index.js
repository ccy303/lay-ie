import React from "react";
import { Button, Collapse } from "antd";
import CModal, { useCModal } from "@base/cModal";
const { Panel } = Collapse;
// import CForm from "@base/CForm";
// import CUpload from "@base/CUpload";
export default (props) => {
  const modal = useCModal();
  const confirm1 = () => {
    modal.acOpen("m1");
  };
  const confirm2 = () => {
    modal.acOpen();
    setTimeout(() => {
      modal.acClose();
    }, 10000);
  };
  const confirm3 = () => {
    CModal.confirm({
      title: "CModal.confirm 调用",
      content: <>CModal.confirm 弹框</>,
    });
  };
  // const [form] = CForm.useForm();
  // const cfg = {
  //   form: form,
  //   // submitBtn: false,
  //   onFinish: () => {
  //     CModal.confirm({
  //       title: "提示",
  //       content: <>点击了表单提交，提交信息为:{JSON.stringify(form.getFieldsValue())}</>,
  //     });
  //   },
  //   items: [
  //     {
  //       dom: <h4 style={{ marginBottom: "10px" }}>这是一个普通的自定义dom元素</h4>,
  //     },
  //     [
  //       {
  //         name: "comp_type1",
  //         label: "文本输入",
  //         type: "text",
  //         props: {
  //           placeholder: "请输入客户类型",
  //           allowClear: true,
  //         },
  //         rules: [
  //           {
  //             required: true,
  //           },
  //         ],
  //       },
  //       {
  //         name: "comp_type2",
  //         label: "下拉选择",
  //         type: "select",
  //         props: {
  //           placeholder: "请选择客户类型",
  //           mode: "multiple",
  //           options: [
  //             {
  //               label: "供应商",
  //               value: 1,
  //             },
  //             {
  //               label: "金融机构",
  //               value: 2,
  //             },
  //           ],
  //         },
  //       },
  //       {
  //         name: "comp_type3",
  //         label: "单选框",
  //         type: "radio",
  //         props: {
  //           options: [
  //             {
  //               label: "供应商",
  //               value: 1,
  //             },
  //             {
  //               label: "金融机构",
  //               value: 2,
  //             },
  //           ],
  //         },
  //       },
  //     ],
  //     {
  //       name: "time",
  //       label: "日期范围选择器",
  //       type: "rangeDataPicker",
  //     },
  //   ],
  // };

  return (
    <div>
      <Collapse defaultActiveKey={[1]}>
        <Panel key={1} header={<>CModal：提供以函数调用形式控制对话框,无需在另外定义state控制。</>}>
          <Button onClick={confirm1}>打开单个弹框</Button>
          <div style={{ margin: "10px 0" }}>useCModal 提供 useCModal.acOpen\acClose( name ) 函数打开\关闭 组件指定了属性name的对话框</div>
          <hr />
          <Button onClick={confirm2}>打开多个弹框,10S后关闭</Button>
          <div style={{ margin: "10px 0" }}>
            若页面挂在了多了Modal, 且都没指定name, useCModal.acOpen\acClose() 函数也没有指定入参函数将按照挂在顺序打开\关闭全部弹窗
          </div>
          <hr />
          <Button onClick={confirm3}>函数式调用</Button>
          <div style={{ margin: "10px 0" }}>CModal 提供 confirm() 函数打开单个confirm 对话框</div>
        </Panel>
        <Panel key={2}></Panel>
      </Collapse>
      {/* <Descriptions title="CUpload">
				<Descriptions.Item>
					<div>
						<CUpload />
					</div>
				</Descriptions.Item>
				<Descriptions.Item>
					<div>
						<CUpload listType="picture-card" maxCount={1} />
					</div>
				</Descriptions.Item>
			</Descriptions>
			<Descriptions title="CForm：在不破环antd表单支持情况下实现的配置式表单设置">
				<Descriptions.Item>
					<CForm {...cfg} />
				</Descriptions.Item>
			</Descriptions> */}
      <CModal name="m1" title="普通弹框">
        这是个普通弹框1
      </CModal>
      <CModal title="普通弹框">这是个普通弹框2</CModal>
      <CModal title="普通弹框">这是个普通弹框3</CModal>
    </div>
  );
};
