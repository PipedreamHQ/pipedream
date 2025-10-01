import app from "../../dynapictures.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "dynapictures-create-image",
  name: "Create Image",
  description: "Generates a new image by using a given image as a template. [See the documentation](https://dynapictures.com/docs/#image-generation)",
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
    params: {
      type: "string[]",
      label: "Image Parameters",
      description: "List of custom parameters, specifying new values for the image layers. It's possible to replace text and images, adjust styling, etc. For each element in the list, specify a JSON object with the following properties as an example: ```{ \"name\": \"title\", \"text\": \"Lorem ipsum\" }```. See details [here](https://dynapictures.com/docs/#image-generation).",
    },
  },
  methods: {
    generateImage({
      templateId, ...args
    } = {}) {
      return this.app.post({
        path: `/designs/${templateId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      generateImage,
      templateId,
      params,
    } = this;

    const response = await generateImage({
      $,
      templateId,
      data: {
        params: utils.parseArray(params).map(utils.parse),
      },
    });

    $.export("$summary", `Successfully generated image with ID \`${response.id}\``);
    return response;
  },
};
