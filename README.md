## babel-plugin-react-css-modules 和 @dr.pogodin/babel-plugin-react-css-modules

babel-plugin-react-css-modules 作者已经停止维护,所以其不支持新版本的 css-loader。
@dr.pogodin/babel-plugin-react-css-modules 是社区中 babel-plugin-react-css-modules 的 fork 维护版本,并对新版本的 css-loader 做了兼容，可以取代 babel-plugin-react-css-modules

## 路由配置

单独配置多个单独路由时 Memu 菜单切换时菜单会出现闪烁。造成原因是 PermissionRoute.js 中对每一个路由的 wrappers 或者是 作为外层 layout 的 compoment 都是单独渲染，每次加载路由都会重新渲染 layout 中的所有组件，所以会出现闪烁问题。<b>解决方案：将多个路由合并到一个路由中，共享一个 wrappers 或作为 layout 的 compoment<b>。

```javascript
    //  会照成闪烁的路由配置
	{
		path: "/xxx",
		wrappers: [DashboardComponents],
		component:  XXX,
        ...
	},
    {
		path: "/xxx",
		wrappers: [DashboardComponents],
		component:  XXX,
        ...
	}
    // 解决方案
   {
        ...
		path: "/admin",
		component: DashboardComponents,
		childrens: [
			{
				path: "/admin/xxx",
				component: XXX,
                ...
			},
			{
				path: "/admin/xxx",
				component: XXX,
                ...
			},
            ...
		]
    }

```
