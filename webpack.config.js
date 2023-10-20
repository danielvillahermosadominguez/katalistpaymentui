const CopyPlugin = require('copy-webpack-plugin')

function page(jsPath, htmlPageName) {
  const bundleName = jsPath.replace("./src/", "./")
  const htmlFileName = htmlPageName.replace("./src/", "./")
  return {
    experiments: {
      outputModule: true
    },
    entry: jsPath,
    output: {
      path: __dirname + '/dist',
      filename: bundleName
    }
  }
}

module.exports = [
  page('./src/js/pages/index.js', './src/index.html'),
  page('./src/js/pages/isnotavalidcourselected.js', './src/views/errors/isnotavalidcourselected.html'),
  page('./src/js/pages/error.js', './src/views/errors/error.html'),
  page('./src/js/pages/payment.js', './src/views/payment/payment.html'), 
  {
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: './src/index.html', to: "index.html" },          
          { from: './src/views/errors/isnotavalidcourselected.html', to: "views/errors/isnotavalidcourselected.html" },                    
          { from: './src/views/errors/error.html', to: 'views/errors/error.html' },                    
          { from: './src/views/payment/payment.html', to: 'views/payment/payment.html' },                              
          { from: "./src/css", to: "css" },          
          { from: "./src/img", to: "img" },          
          { from: "./src/lang", to: "lang" },          
          { from: "./src/integration.html", to: "" },          
        ],
        options: {
          concurrency: 100,
        },
      }),
    ],
  }
]  
