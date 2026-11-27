import fs from "fs";
import geogridapi from "../../geogridapi.app.mjs";

export default {
  key: "geogridapi-get-grid-image",
  name: "Get Grid Image",
  description: "Download the PNG heatmap (1200 × 1092) of a completed grid: map, colored rank at each point, keyword, listing, date and key figures. Free."
    + " Writes the file to `/tmp` and returns `filePath`, ready to attach to an email or a Slack message."
    + " The grid must be completed: run it with **Run Grid** and find past grids with **List Grids**."
    + " [See the documentation](https://geogridapi.io/en/docs#image)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    geogridapi,
    gridId: {
      propDefinition: [
        geogridapi,
        "gridId",
      ],
    },
    lang: {
      type: "string",
      label: "Image Language",
      description: "Language of the texts on the image, e.g. `en`. One of `en` or `fr`. Defaults to `en`.",
      options: [
        "en",
        "fr",
      ],
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const image = await this.geogridapi.getGridImage({
      $,
      gridId: this.gridId,
      params: {
        lang: this.lang,
      },
    });
    const filename = `geogrid-${this.gridId}.png`;
    const filePath = `${process.env.STASH_DIR || "/tmp"}/${filename}`;
    fs.writeFileSync(filePath, Buffer.from(image));
    $.export("$summary", `Saved the heatmap of grid ${this.gridId} to ${filePath}`);
    return {
      filePath,
      filename,
      contentType: "image/png",
    };
  },
};
