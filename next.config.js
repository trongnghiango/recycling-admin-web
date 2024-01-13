/** @type {import('next').NextConfig} */
const path = require('path');
const withPlugins = require('next-compose-plugins');
const headers = require('./headers.cjs');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: 'static',
  },
  // distDir: 'build',
  images: {
    domains: ["cdn.dribbble.com"],
    //   minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers,
      },
    ];
  },
  // webpack5: true,
  // webpack(config) {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     // https://blog.usejournal.com/my-awesome-custom-react-environment-variables-setup-8ebb0797d8ac
  //     environment: path.join(__dirname, 'src', 'environments', process.env.CLIENT_ENV || 'production'),
  //   };

  //   config.plugins = [
  //     ...config.plugins,

  //     process.env.NODE_ENV === 'production' ? new DuplicatePackageCheckerPlugin() : null,
  //   ].filter(Boolean);

  //   config.resolve.fallback = {
  //     ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
  //     // by next.js will be dropped. Doesn't make much sense, but how it is
  //     fs: false, // the solution
  //   };

  //   return config;
  // },
  webpack: (config) => {
    const clientEnv = process.env.CLIENT_ENV || 'production';

    config.resolve.alias = {
      ...config.resolve.alias,
      environment: path.join(__dirname, 'src', 'environments', clientEnv),
    };

    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
    };
    return config;
  },
};

// const mixConfig = withPlugins([...plugins], {...nextConfig});

module.exports = nextConfig
