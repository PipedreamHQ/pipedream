import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../npm.app.mjs";

export default {
  key: "npm-new-package-version",
  name: "New Package Version",
  description: "Emit new event when a new version of an npm package is published. [See the documentation](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    packageName: {
      type: "string",
      label: "Package",
      description: "Enter an npm package name. Leave blank for all",
      default: "@pipedream/platform",
    },
  },
  async run() {
    const {
      app,
      packageName,
    } = this;

    const response = await app.getPackageMetadata({
      debug: true,
      packageName,
    });

    const { "dist-tags": { latest: latestVersion } } = response;

    this.$emit(response, {
      id: latestVersion,
      summary: `New Package Version ${latestVersion}`,
      ts: Date.parse(response.modified),
    });
  },
};
