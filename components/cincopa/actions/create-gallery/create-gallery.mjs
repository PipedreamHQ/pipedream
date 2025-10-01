import app from "../../cincopa.app.mjs";

export default {
  key: "cincopa-create-gallery",
  name: "Create Gallery",
  description: "Creates a new gallery, returning the new gallery FID (unique ID). [See the documentation](https://www.cincopa.com/media-platform/api-documentation-v2#gallery.create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the gallery",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the gallery",
      optional: true,
    },
    template: {
      type: "string",
      label: "Template",
      description: "Set the gallery skin to this template",
      optional: true,
    },
  },
  methods: {
    createGallery(args = {}) {
      return this.app._makeRequest({
        path: "/gallery.create.json",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createGallery,
      name,
      description,
      template,
    } = this;

    const response = await createGallery({
      $,
      params: {
        name,
        description,
        template,
      },
    });

    $.export("$summary", `Successfully created gallery with FID \`${response.fid}\``);
    return response;
  },
};
