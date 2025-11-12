import app from "../../cincopa.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "cincopa-add-assets-to-gallery",
  name: "Add Assets to Gallery",
  description: "Adds an asset or a list of assets to an existing gallery. [See the documentation](https://www.cincopa.com/media-platform/api-documentation-v2#gallery.add_item)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    fid: {
      propDefinition: [
        app,
        "fid",
      ],
    },
    rid: {
      propDefinition: [
        app,
        "rid",
      ],
    },
    insertPosition: {
      type: "string",
      label: "Insert Position",
      description: "Add the assets at the top or the bottom of the gallery. Options: top or bottom (default is `bottom`)",
      optional: true,
      options: [
        "top",
        "bottom",
      ],
    },
  },
  methods: {
    addAssetToGallery(args = {}) {
      return this.app._makeRequest({
        path: "/gallery.add_item.json",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      addAssetToGallery,
      fid,
      rid,
      insertPosition,
    } = this;

    const response = await addAssetToGallery({
      $,
      params: {
        fid,
        rid: utils.parseArray(rid).join(","),
        insert_position: insertPosition,
      },
    });

    $.export("$summary", "Successfully added assets to gallery");
    return response;
  },
};
