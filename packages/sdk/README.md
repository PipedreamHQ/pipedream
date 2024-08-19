# `@pipedream/sdk`

TypeScript SDK for [Pipedream](https://pipedream.com). [See the docs](https://pipedream.com/docs/connect) for usage instructions.

## Install

```bash
npm i @pipedream/sdk
```

## Usage

[See the docs](https://pipedream.com/docs/connect) for full usage instructions. This package installs code that can be used by both a server, to make Pipedream API requests:

```typescript
import {
  createClient,
  type ConnectTokenCreateOpts,
  type ConnectTokenResponse,
} from "@pipedream/sdk";

const pd = createClient({
  publicKey: process.env.PIPEDREAM_PROJECT_PUBLIC_KEY,
  secretKey: process.env.PIPEDREAM_PROJECT_SECRET_KEY,
});

export async function serverConnectTokenCreate(
  opts: ConnectTokenCreateOpts
): Promise<ConnectAPIResponse<ConnectTokenResponse>> {
  return pd.connectTokenCreate(opts);
}
```

and a browser client, to perform user-facing operations like connecting accounts:

```typescript
// Note that we import the browser-specific SDK client here
import { createClient } from "@pipedream/sdk/browser";

export default function Home() {
  function connectAccount() {
    pd.connectAccount({
      app: "app_slug", // the app you're connecting
      token: "YOUR_TOKEN", // The token you received from your server
      onSuccess: ({ id: accountId }) => {
        console.log(`Account successfully connected: ${accountId}`);
      },
    });
  }

  return (
    <main>
      <button onClick={connectAccount}>Connect your account</button>
    </main>
  );
}
```
