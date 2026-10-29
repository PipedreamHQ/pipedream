import { readFile } from "node:fs/promises";
import { SourceTextModule, SyntheticModule } from "node:vm";

// Load the actual components with an injected platform HTTP implementation.
export async function loadAction(axios, apiKey = "mock-api-key") {
  const platform = new SyntheticModule(["axios"], function() {
    this.setExport("axios", axios);
  });
  const appModule = new SourceTextModule(await readFile(new URL("../desearch.app.mjs", import.meta.url), "utf8"));
  await appModule.link(() => platform);
  await appModule.evaluate();
  const actionModule = new SourceTextModule(await readFile(new URL("../actions/web-search/web-search.mjs", import.meta.url), "utf8"));
  await actionModule.link(() => appModule);
  await actionModule.evaluate();
  return {
    action: actionModule.namespace.default,
    app: {
      ...appModule.namespace.default.methods,
      $auth: { api_key: apiKey },
    },
  };
}
