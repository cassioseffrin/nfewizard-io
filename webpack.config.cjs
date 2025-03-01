/**
    * @description      : 
    * @author           : 
    * @group            : 
    * @created          : 01/03/2025 - 15:04:33
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 01/03/2025
    * - Author          : 
    * - Modification    : 
**/
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    entry: "./src/index.ts",
    mode: "production",
    target: "node", // Since Rollup was bundling for Node.js
    devtool: "source-map",
    externals: nodeExternals({ // Equivalent to `external` in Rollup
        allowlist: ["bwip-js", "xsd-schema-validator", "pdfkit", "pem", "libxmljs"],
    }),
    resolve: {
        extensions: [".*"],
        alias: {
            "@Adapters": path.resolve(__dirname, "./src/adapters"),
            "@Modules": path.resolve(__dirname, "./src/modules"),
            "@Interfaces": path.resolve(__dirname, "./src/core/interfaces"),
            "@Types": path.resolve(__dirname, "./src/core/types"),
            "@Core": path.resolve(__dirname, "./src/core"),
            "@Utils": path.resolve(__dirname, "./src/core/utils"),

 

        },
    },    
    module: {
        rules: [
          {
            test: /\.ts$/,
            use: "ts-loader",
            exclude: /node_modules/,
          },
          {
            test: /\.json$/,
            type: "json",
          },
        ],
      },
      
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        libraryTarget: 'commonjs2', // Ensure it's commonjs2 for compatibility
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: true,
                    keep_fnames: true,
                    mangle: false,
                },
            }),
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: "src/resources", to: "dist/resources" }],
        }),
    ],
};
