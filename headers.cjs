const ContentSecurityPolicy = `[
  default-src default-src 'self' githubusercontent.com *.githubusercontent.com;
  script-src 'self';
  child-src rang-phong-app-v3.vercel.app;
  style-src 'self' googleapis.com *.googleapis.com;
  font-src 'self' fonts.googleapis.com fonts.gstatic.com;  
  img-src 'self' data:;
],
`

module.exports = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Cache-Control',
    value: 'public, max-age=9999999999, must-revalidate',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Server',
    value: 'Apache', // phony server value
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'sameorigin',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'same-origin',
    // value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=*', // allow specified policies here
  },
  // {
  //   key: 'Content-Security-Policy',
  //   value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  // },
];