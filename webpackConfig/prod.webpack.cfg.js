const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const handler = (percentage, message, ...args) => {
    console.info(`${(percentage * 100).toFixed(2)}%`, message, ...args);
};
module.exports = {
    mode: "production",
    entry: {
        app: "./src/index.js"
    },
    output: {
        path: path.join(__dirname, "../dist"), // 出口目录，dist文件
        publicPath: "/",
        filename: "js/[name].[chunkhash].js",
        chunkFilename: "js/[name].chunk.[chunkhash].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                oneOf: [
                    {
                        test: /\.css$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: "css-loader",
                                options: {
                                    modules: {
                                        localIdentName: "[local]-[hash:base64:10]",
                                        getLocalIdent: (context, localIdentName, localName) => {
                                            const path = context._module.context;
                                            if (
                                                /^((?!node_modules).)*(src){1}.*(components){1}.*$/.test(
                                                    path
                                                )
                                            ) {
                                                return;
                                            } else {
                                                return localName;
                                            }
                                        }
                                    }
                                }
                            },
                            "postcss-loader"
                        ]
                    },
                    {
                        test: /\.less$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: "css-loader",
                                options: {
                                    modules: {
                                        localIdentName: "[local]-[hash:base64:10]",
                                        getLocalIdent: (context, localIdentName, localName) => {
                                            const path = context._module.context;
                                            if (
                                                /^((?!node_modules).)*(src){1}.*(components){1}.*$/.test(
                                                    path
                                                )
                                            ) {
                                                return;
                                            } else {
                                                return localName;
                                            }
                                        }
                                    }
                                }
                            },
                            "postcss-loader",
                            {
                                loader: "less-loader", // compiles Less to CSS
                                options: {
                                    lessOptions: {
                                        modifyVars: {
                                            "primary-color": "#d7000f",
                                            "link-color": "#d7000f",
                                            "ant-prefix": "linkfin",
                                            "menu-item-height": "48px",
                                            "menu-inline-submenu-bg": "#fff",
                                            "menu-inline-toplevel-item-height": "48px",
                                            "menu-dark-highlight-color": "#fff",
                                            "menu-dark-bg": "#13131c",
                                            "menu-dark-selected-item-text-color": "#0000ff"
                                        },
                                        javascriptEnabled: true
                                    }
                                }
                            },
                            {
                                loader: "style-resources-loader",
                                options: {
                                    patterns: path.resolve(__dirname, "../src/styles/common.less")
                                }
                            }
                        ]
                    },
                    {
                        test: /\.(png|svg|jpg|jpeg|gif)$/i,
                        type: "asset",
                        generator: {
                            filename: "images/[hash][ext][query]"
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [".js", ".json", ".css"],
        alias: {
            "@root": path.resolve(__dirname, "../"),
            "@src": path.resolve(__dirname, "../", "src"),
            "@base": path.resolve(__dirname, "../src/components/basic"),
            "@utils": path.resolve(__dirname, "../src/utils"),
            "@images": path.resolve(__dirname, "../src/images")
        }
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new webpack.ProgressPlugin(handler),
        new HtmlWebpackPlugin({
            template: "./public/template.html",
            filename: "index.html",
            favicon: "./favicon.ico",
        }),
        new CleanWebpackPlugin({ verbose: true }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash].css",
            chunkFilename: "css/[name].[contenthash].css"
        })
    ],
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin({
                parallel: true
            })
            // new CompressionPlugin()
        ],
        splitChunks: {
            chunks: "all"
        }
    }
};
