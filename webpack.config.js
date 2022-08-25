const path = require('path');
const PugPlugin = require('pug-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
    mode,
    target,
    devtool,
    entry: {
      index: './src/main.pug',
    },
    output: {
      path: path.join(__dirname, 'dist/'),
      clean: true,
      publicPath: '/',
      filename: '[name].[contenthash:8].js',
      //☝🏽 Output filename of files with hash for unique id
      assetModuleFilename: 'assets/[name][ext][query]',
    },
    plugins: [
      new PugPlugin({
        pretty: true,
        extractCss: {
          filename: '[name].css'
        }
      })
    ],
    module: {
      rules: [
        //babel-loader
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: "defaults" }]
              ]
            }
          }
        },
        //PugPlugin
        {
          test: /\.pug$/,
          loader: PugPlugin.loader
        },
        //sass-loader
        {
          test: /\.(css|sass|scss)$/,
          use: ['css-loader', 'sass-loader']
        },
        //image-webpack-loader
        {
          test: /\.(png|jpg|jpeg|ico)/,
          type: 'asset/resource',
          use: [
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.65, 0.90],
                  speed: 4
                },
                gifsicle: {
                  interlaced: false,
                },
                // the webp option will enable WEBP
                webp: {
                  quality: 75
                }
              }
            },
          ],
          generator: {
            filename: 'assets/img/[name].[hash:8][ext]'
          }
        },
        // fonts
        {
          test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: '/fonts/[name][ext][query]'
          }
        }
      ]
    },
    // devServer
    devServer: {
      open: true,
    //   hot: true,
      static: {
        directory: path.join(__dirname, 'dist')
      },
      //To enable HMR:
      watchFiles: {
        paths: ['src/**/*.*'],
        options: {
          usePolling: true
        }
      }
    },
    stats: 'errors-only'
  };