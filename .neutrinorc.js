module.exports = {
  use: [
    [
      '@neutrinojs/airbnb',
      {
        include: ['test'],
        eslint: {
          rules: {
            "no-console": "off",
            "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
            "react/prop-types": "off",
          }
        }
      }
    ],
    [
      '@neutrinojs/react',
      {
        html: {
          title: 'Firefox code coverage diff viewer',
          links: [
            "https://fonts.googleapis.com/css?family=Fira+Sans:300,400"
          ]
        }
      }
    ],
    '@neutrinojs/mocha',
    (neutrino) => {
      neutrino.config.when(process.env.NODE_ENV === 'production', config => {
        config.devtool('source-map');
      });
    }
  ]
};
