import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import cssnano from 'cssnano'
import path from 'path'

const basePath = path.resolve(__dirname)

const webpackConfig ={
  name: 'mutterio',
  target: 'web',
  resolve: {
    // you can now require('file') instead of require('file.json')
    extensions: ['','.js', '.json'],
  },
  module: {
    loaders:[]
  },
  plugins: []

}

webpackConfig.entry ={
  app: `${basePath}/assets/js/index.js`
}

webpackConfig.output ={
  path: `${basePath}/site/static`,
  filename: `[name].js`
}

webpackConfig.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      },
      quote_style: 3
    })
  )

webpackConfig.module.loaders = [{
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: {
    cacheDirectory: true,
    plugins: ['transform-runtime'],
    presets:['es2015', 'stage-0']
  }
},
{
  test: /\.json$/,
  loader: 'json'
}]

webpackConfig.module.loaders.push(
  { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
  { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
  { test: /\.otf(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
  { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
  { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]' },
  { test: /\.svg(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
  { test: /\.(png|jpg|gif)$/,    loader: 'url?limit=8192' }
)

const cssLoader = 'css?sourceMap'

webpackConfig.module.loaders.push({
  test: /\.scss$/,
  include: /assets/,
  loaders: [
    'style',
    cssLoader,
    'postcss',
    'sass?sourceMap'
  ]
})

webpackConfig.module.loaders.push({
  test: /\.css$/,
  include: /assets/,
  loaders: [
    'style',
    cssLoader,
    'postcss'
  ]
})

webpackConfig.module.loaders.push({
  test: /\.less$/,
  include: /assets/,
  loaders: ['style','css','less']
})

// Don't treat global SCSS as modules
webpackConfig.module.loaders.push({
  test: /\.scss$/,
  exclude: /assets/,
  loaders: [
    'style',
    'css?sourceMap',
    'postcss',
    'sass?sourceMap'
  ]
})

// Don't treat global, third-party CSS as modules
webpackConfig.module.loaders.push({
  test: /\.css$/,
  exclude: /assets/,
  loaders: [
    'style',
    'css?sourceMap',
    'postcss'
  ]
})

webpackConfig.sassLoader = {
  includePaths: `${basePath}/assets`
}
webpackConfig.lessLoader ={
  includePaths: `${basePath}/assets`
}



webpackConfig.postcss = [
  cssnano({
    autoprefixer: {
      add: true,
      remove: true,
      browsers: ['last 2 versions']
    },
    discardComments: {
      removeAll: true
    },
    safe: true,
    sourcemap: false
  })
]
webpackConfig.module.loaders.filter((loader) =>
    loader.loaders && loader.loaders.find((name) => /css/.test(name.split('?')[0]))
  ).forEach((loader) => {
    const [first, ...rest] = loader.loaders
    loader.loader = ExtractTextPlugin.extract(first, rest.join('!'))
    delete loader.loaders
  })

  webpackConfig.plugins.push(
    new ExtractTextPlugin('[name].css', {
      allChunks: true
    })
  )

module.exports = webpackConfig
