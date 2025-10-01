import mapbox from "../../mapbox.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "mapbox-create-tileset",
  name: "Create Tileset",
  description: "Uploads and creates a new tileset from a data source. [See the documentation](https://docs.mapbox.com/api/maps/mapbox-tiling-service/)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mapbox,
    username: {
      type: "string",
      label: "Username",
      description: "The Mapbox username of the account for which to create a tileset source",
    },
    tilesetName: {
      type: "string",
      label: "Tileset Name",
      description: "A unique name for the tileset source to be created. Limited to 32 characters. The only allowed special characters are `-` (hyphen) and `_` (underscore)",
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "A tileset source file. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    recipe: {
      type: "object",
      label: "Recipe",
      description: "A recipe that describes how the GeoJSON data you uploaded should be transformed into tiles. A tileset source is raw geographic data formatted as [line-delimited GeoJSON](https://en.wikipedia.org/wiki/JSON_streaming#Line-delimited_JSON), or a supported [raster file format](https://docs.mapbox.com/mapbox-tiling-service/raster/supported-file-formats/). For more information on how to create and format recipes, see the [Recipe reference](https://docs.mapbox.com/mapbox-tiling-service/reference/) and [Recipe examples](https://docs.mapbox.com/mapbox-tiling-service/examples/).",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the tileset",
      optional: true,
    },
    private: {
      type: "boolean",
      label: "Private",
      description: "Describes whether the tileset must be used with an access token from your Mapbox account. Default is `true`.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    // Create Tileset Source
    try {
      const fileData = new FormData();
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(this.filePath);
      fileData.append("file", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });

      await this.mapbox.createTilesetSource({
        $,
        username: this.username,
        id: this.tilesetName,
        data: fileData,
        headers: fileData.getHeaders(),
      });
    } catch (e) {
      throw new Error(`Error uploading file: \`${this.filePath}\`. Error: ${e}`);
    }

    const recipe = typeof this.recipe === "string"
      ? JSON.parse(this.recipe)
      : this.recipe;

    // Validate Recipe
    const {
      valid, errors,
    } = await this.mapbox.validateRecipe({
      $,
      data: recipe,
    });

    if (!valid) {
      throw new Error(`Error validating recipe: ${errors}`);
    }

    // Create Tileset
    const response = await this.mapbox.createTileset({
      $,
      tilesetId: `${this.username}.${this.tilesetName}`,
      data: {
        recipe,
        name: this.tilesetName,
        description: this.description,
        private: this.private,
      },
    });

    $.export("$summary", `Created tileset ${this.tilesetName}`);
    return response;
  },
};
