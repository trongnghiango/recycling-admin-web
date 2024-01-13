# Custom server with TypeScript + Nodemon example

The example shows how you can use [TypeScript](https://typescriptlang.com) on both the server and the client while using [Nodemon](https://nodemon.io/) to live reload the server code without affecting the Next.js universal code.

Server entry point is `server/index.ts` in development and `dist/index.js` in production.
The second directory should be added to `.gitignore`.

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example) or preview live with [StackBlitz](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/custom-server-typescript)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/custom-server-typescript)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example custom-server-typescript custom-server-typescript-app
```

```bash
yarn create next-app --example custom-server-typescript custom-server-typescript-app
```

```bash
pnpm create next-app --example custom-server-typescript custom-server-typescript-app
```

## NOTES
- 
    "noUnusedLocals": false,  -> De khong check 


## Task
- yarn add express-fileupload

```json
"module": "CommonJS",
    // Import non-ES modules as default imports.
    "esModuleInterop": true,
    "outDir": "dist",
    // Target latest version of ECMAScript.
    "target": "ES2019",
    // Process & infer types from .js files.
    "allowJs": false,
    // Enable strictNullChecks & noImplicitAny.
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strict": true,
    "strictFunctionTypes": false,
    "noImplicitThis": false,
    // Search under node_modules for non-relative imports.
    "moduleResolution": "node",
    // Import .json files
    "resolveJsonModule": true,
    "sourceMap": true, 
```

docker run -d --name=cloudflare -e API_KEY=wKRA1lcUCHjJcsHlnqiZmVwEtC3MftVF2g36oyAJ -e ZONE=koolalign.vn -e PROXIED=true --restart=always oznu/cloudflare-ddns

docker run -d --name=nginx-proxy-manager -p 81:8181 -p 80:8080 -p 443:4443 -v /media/Local/NginxProxyManager/:/config:rw --restart=always jlesage/nginx-proxy-manager

# Cloudflare API token
dns_cloudflare_api_token = 0123456789abcdef0123456789abcdef01234567