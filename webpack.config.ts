import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import slsw from 'serverless-webpack';

const isOffline = !!slsw.lib.webpack.isLocal;

if (isOffline) {
    // eslint-disable-next-line no-console
    console.log('Offline mode detected!');
}

// Add plugins for the offline mode here
const offlinePlugins: NonNullable<Configuration['plugins']> = [];

const config: Configuration = {
    target: 'node',
    entry: slsw.lib.entries,
    externals: [nodeExternals()],
    mode: isOffline ? 'development' : 'production',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'source-map-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            onlyCompileBundledFiles: true,
                        },
                    },
                ],
            },
            {
                test: /\.graphql$/,
                use: ['raw-loader'],
            },
        ],
    },
    plugins: [
        ...(isOffline ? offlinePlugins : []),
    ],
    resolve: {
        extensions: ['.ts', '.js'],
    },
    optimization: {
        // minimize: !isOffline,
        concatenateModules: false,
    },
    stats: 'minimal',
};

export = config;
