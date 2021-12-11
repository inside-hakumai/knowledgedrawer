import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const NODE_ENV: 'development' | 'production' = (() => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    return process.env.NODE_ENV;
  } else {
    return 'development';
  }
})()

const config: Configuration = {
  mode: NODE_ENV,
  target: 'web',
  entry: './renderer/index.tsx',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './renderer/index.html',
      filename: 'index.html',
      scriptLoading: 'blocking',
      inject: 'body',
      minify: false,
    })
  ],

  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  devtool: 'inline-source-map',
}

export default config
