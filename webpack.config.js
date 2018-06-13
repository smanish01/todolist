var config = {
  module: {

    rules: [
{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
	{
       use: {
          loader:'babel-loader',
          options: { presets: ['es2015'] }
       },
       test: /\.js$/,
       exclude: /node_modules/
    }      
	,{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: '/home/manish/Desktop/todolist/public/assets/js/'
  }
};

module.exports = config;
