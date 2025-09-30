import app from "../../placid.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "placid-generate-image",
  name: "Generate Image",
  description: "Generate a new image based on a specified template. [See the documentation](https://placid.app/docs/2.0/rest/images#create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
    },
    layers: {
      propDefinition: [
        app,
        "layers",
      ],
    },
  },
  methods: {
    createImage(args = {}) {
      return this.app.post({
        path: "/images",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createImage,
      templateId,
      layers,
    } = this;

    const response = await createImage({
      $,
      data: {
        template_uuid: templateId,
        layers: utils.parseLayers(layers),
      },
    });
    $.export("$summary", `Successfully generated image with ID: ${response.id}`);
    return response;
  },
};
