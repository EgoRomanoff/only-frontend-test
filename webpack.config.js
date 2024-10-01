const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const { mode } = argv;
  const isProduction = mode === "production";

  return {
    mode,
    entry: path.resolve(__dirname, "src/main.tsx"),
    output: {
      publicPath: "/",
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js",
      clean: true,
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    module: {
      rules: [
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
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src/index.html"),
      }),
    ],
    devtool: isProduction ? "source-map" : "inline-source-map",
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
