import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { Configuration } from 'webpack'

const NODE_ENV: 'development' | 'production' = (() => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    return process.env.NODE_ENV
  } else {
    return 'development'
  }
})()

const config: Configuration = {
  mode: NODE_ENV,
  target: 'web',
  entry: './renderer/index.tsx',
  output: {
    path: path.join(__dirname, 'build'),
  },

  experiments: {
    topLevelAwait: true,
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-react', { runtime: 'automatic', importSource: '@emotion/react' }],
              ],
              plugins: ['@emotion/babel-plugin'],
            },
          },
          'ts-loader',
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: './renderer/index.html',
      filename: 'index.html',
      scriptLoading: 'blocking',
      inject: 'body',
      minify: false,
    }),
  ],

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  devtool: 'inline-source-map',
}

export default config
