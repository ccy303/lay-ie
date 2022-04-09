module.exports = function (api) {
  api.cache(true);
  const presets = [
    "@babel/react",
    [
      "@babel/preset-env",
      {
        targets: {
          ie: 11,
        },
        useBuiltIns: "usage",
        modules: false,
        corejs: { version: 3.8, proposals: true },
      },
    ],
  ];
  const plugins = [
    [
      "import",
      {
        libraryName: "antd",
        style: true,
      },
      "antd",
    ],
  ];
  const ignore = [
    (filename) => {
      return !/^(((?!node_modules).)*(js|jsx|ts|tsx))/.test(filename);
      // return !/^(((?!node_modules).)*(js|jsx|ts|tsx))|(.*(node_modules).*().*(\.js)$)/.test(filename);
    },
  ];
  return {
    presets,
    plugins,
    ignore,
    sourceType: "unambiguous",
  };
};
