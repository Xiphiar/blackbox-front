module.exports = {
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    include: /node_modules[/\\|]secretjs/i,
                    // exclude: /(node_modules|bower_components)/,
                    use: {
                      loader: 'babel-loader',
                      options: {
                        presets: [
                          '@babel/preset-env',
                          '@vue/cli-plugin-babel/preset',
                        ],
                      }
                    }
                },
            ]
        }
    },
};
