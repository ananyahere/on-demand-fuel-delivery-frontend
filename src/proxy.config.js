const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function(app) {
//     app.use(
//       '/api',
//       createProxyMiddleware({
//         target: 'https://api.geoapify.com/v1',
//         changeOrigin: true,
//         pathRewrite: {
//           '^/api': '/geocode/reverse'
//         },
//         // onProxyReq: function(proxyReq, req, res) {
//         //   // Set the API key header for the Geoapify API
//         //   proxyReq.setHeader('x-api-key', 'replace-with-your-api-key');
//         // }
//       })
//     );
//   };

module.exports = [
    {
        context: '/api',
        target: 'https://api.geoapify.com',
        secure: false,
        changeOrigin: true,
        pathRewite: {
            '^/api': '/v1/geocode/reverse'
        }
    }
]