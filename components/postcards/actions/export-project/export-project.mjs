import { ConfigurationError } from "@pipedream/platform";
import { randomUUID } from "node:crypto";
import fs from "fs";
import postcards from "../../postcards.app.mjs";

export default {
  key: "postcards-export-project",
  name: "Export Project",
  description: "Export a project to HTML or ZIP. With Image Hosting off, writes a ZIP to the `/tmp` directory and returns its path; with it on, returns hosted HTML. Counts against the monthly export quota. [See the documentation](https://help.designmodo.com/article/537-api-getting-started).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    postcards,
    id: {
      propDefinition: [
        postcards,
        "projectId",
      ],
    },
    imageHosting: {
      type: "boolean",
      label: "Image Hosting",
      description: "Upload assets to Postcards hosting and reference them by URL. If `false`, assets are bundled into a ZIP.",
      optional: true,
      default: false,
    },
    cdn: {
      type: "boolean",
      label: "Use CDN",
      description: "Serve assets from the Postcards CDN. Requires Image Hosting and the Pro plan.",
      optional: true,
      default: false,
    },
    minify: {
      type: "boolean",
      label: "Minify HTML",
      description: "Strip whitespace and comments from the exported HTML to reduce its size.",
      optional: true,
      default: false,
    },
    format: {
      type: "string",
      label: "Format",
      description: "Response shape when Image Hosting is on (ignored for ZIP).",
      optional: true,
      default: "json",
      options: [
        "json",
        "html",
      ],
    },
    variables: {
      type: "object",
      label: "Variables",
      description: "Map of `{{key}}` placeholder substitutions. Values must be scalar (string, number, boolean). Example: `{ \"{{firstName}}\": \"Ada\", \"{{discount}}\": 15 }`.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.cdn && !this.imageHosting) {
      throw new ConfigurationError("**Use CDN** requires **Image Hosting** to be enabled.");
    }

    const isZip = !this.imageHosting;
    const data = {
      imageHosting: !!this.imageHosting,
      cdn: !!this.cdn,
      minify: !!this.minify,
      format: this.format ?? "json",
      variables: this.variables ?? {},
    };

    const response = await this.postcards.exportProject({
      $,
      id: this.id,
      data,
      ...(isZip
        ? {
          responseType: "arraybuffer",
        }
        : {}),
    });

    if (isZip) {
      const buffer = Buffer.isBuffer(response)
        ? response
        : Buffer.from(response);
      const filePath = `/tmp/postcards-${randomUUID()}.zip`;
      fs.writeFileSync(filePath, buffer);
      $.export("$summary", `Exported project ${this.id} as ZIP`);
      return {
        format: "zip",
        filePath,
      };
    }

    $.export("$summary", `Exported project ${this.id} as HTML`);
    return response;
  },
};
