const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.png$/,
        use: "file-loader",
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html", minify: true }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
