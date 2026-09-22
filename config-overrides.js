const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const dotenv = require('dotenv');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const {
  expandResolveAlias,
  expandRulesInclude,
  expandPluginsScope,
  configPaths,
} = require('react-app-rewire-alias');
const paths = require('react-scripts/config/paths');

/**
 * Load .env (baseline) then .env.dev in dev mode so
 * that dev values override production ones.
 */
function loadEnv() {
  const envFile =
    process.env.NODE_ENV === 'development'
      ? './.env.dev'
      : './.env';
  const defaults = dotenv.config({
    path: './.env',
  });
  const overrides = dotenv.config({
    path: envFile,
  });
  return {
    ...defaults.parsed,
    ...overrides.parsed,
  };
}

const overrideWebpack = (config) => {
  const tsPaths = configPaths('./tsconfig.paths.json');

  // Production only: inject the precache manifest into the service worker.
  // InjectManifest (not GenerateSW) so navigations use network-first and
  // index.html can never be served stale; hashed assets stay cache-first.
  if (process.env.NODE_ENV === 'production') {
    const { GenerateSW } = require('workbox-webpack-plugin');

    config.plugins.push(
      new GenerateSW({
        swDest: 'service-worker.js',
        // Hashed build assets are immutable by name, so precache (cache-first)
        // is safe for them. index.html never changes URL, so it must NOT be
        // precached or users get pinned to a stale app; it is handled by the
        // network-first navigation route below instead.
        exclude: [
          /\.map$/,
          /asset-manifest\.json$/,
          /^index\.html$/,
          /^robots\.txt$/,
          /^sitemap\.xml$/,
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        navigateFallback: null,
        runtimeCaching: [
          {
            // Fresh app shell when online; last cached shell when offline.
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "html-cache",
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 10 },
            },
          },
          {
            // i18next loads locale JSON at runtime; cache so it works offline.
            urlPattern: /\/locales\/.*\.json$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "locales-cache",
              expiration: { maxEntries: 50 },
            },
          },
        ],
      }),
    );
  }


  // Inject env vars without REACT_APP_ prefix.
  const CRA_NATIVE = new Set(['PUBLIC_URL']);
  const envVars = loadEnv();
  const envDefines = {};
  for (const [key, value] of Object.entries(envVars)) {
    if (CRA_NATIVE.has(key)) continue;
    envDefines[`process.env.${key}`] = JSON.stringify(value);
  }
  config.plugins.unshift(new webpack.DefinePlugin(envDefines));

  // Resolve all alias paths
  const resolvedAliases = {};
  for (const [key, value] of Object.entries(tsPaths)) {
    resolvedAliases[key] = path.resolve(paths.appPath, value);
  }

  expandResolveAlias(config.resolve, resolvedAliases);

  const allPaths = Object.values(resolvedAliases);
  expandRulesInclude(config.module.rules, allPaths);
  expandPluginsScope(config.resolve.plugins, allPaths, allPaths);

  return config;
};

const overrideDevServer = (configFunction) => {
  return (proxy, allowedHost) => {
    const config = configFunction(proxy, allowedHost);

    config.setupMiddlewares = (middlewares, devServer) => {
      devServer.app.use(evalSourceMapMiddleware(devServer));
      if (fs.existsSync(paths.proxySetup)) {
        require(paths.proxySetup)(devServer.app);
      }

      devServer.app.use(redirectServedPath(paths.publicUrlOrPath));
      devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));

      return middlewares;
    };

    delete config.onBeforeSetupMiddleware;
    delete config.onAfterSetupMiddleware;

    return config;
  };
};

module.exports = {
  webpack: overrideWebpack,
  devServer: overrideDevServer,
};
