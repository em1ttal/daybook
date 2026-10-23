# HTTP

### CORS
Browsers block JavaScript on `site-a.com` from reading responses from `api.site-b.com` unless the API sends `Access-Control-Allow-Origin` headers. In development, the Vite proxy makes the frontend and API share one origin, so CORS isn't needed; it is only enabled for the dev origin as a fallback.
