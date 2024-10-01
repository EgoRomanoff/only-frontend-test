const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => {
  const { mode } = env;
  const isDev = mode === "development";
  const isProd = mode === "production";

  const styleLoader = (isModule = false) => {
    return [
      isProd ? MiniCssExtractPlugin.loader : "style-loader",
      isModule ? {
        loader: "css-loader",
        options: {
          modules: {
            namedExport: false,
            exportLocalsConvention: "as-is",
            localIdentName: "[local]__[hash:base64:5]",
          },
          importLoaders: 1,
        },
      } : "css-loader",
      "sass-loader",
    ]
  }

  return {
    mode,
    entry: path.resolve(__dirname, "src", "main.tsx"),

    output: {
      publicPath: "/",
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js",
      clean: true,
    },

    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      alias: {
        '@components': path.resolve(__dirname, 'src', 'components'),
        '@styles': path.resolve(__dirname, 'src', 'styles'),
      },
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "index.html"),
      }),
      isDev && new webpack.ProgressPlugin(),
      isProd &&
        new MiniCssExtractPlugin({
          filename: "css/[name].[contenthash:8].css",
          chunkFilename: "css/[name].[contenthash:8].css",
        }),
    ].filter(Boolean),

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-typescript"],
            },
          },
        },
        {
          test: /\.s?css$/i,
          exclude: [/\.module\.scss$/, /node_modules/],
          use: styleLoader(),
        },
        {
          test: /\.module.s?css$/i,
          exclude: /node_modules/,
          use: styleLoader(true),
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },

    devtool: isDev ? "inline-source-map" : false,

    devServer: {
      static: {
        directory: path.resolve(__dirname, "public"),
      },
      port: 3000,
      open: true,
      hot: true,
      compress: true,
      historyApiFallback: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
          runtimeErrors: true,
        },
        reconnect: 10,
      },
    },
  };
};
