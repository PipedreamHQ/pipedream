import publisherkit from "../../publisherkit.app.mjs";

export default {
  key: "publisherkit-create-image",
  name: "Create Image",
  description: "Generates a new image within PublisherKit. [See the documentation](https://publisherkit.com/documentation/api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    publisherkit,
    templateId: {
      propDefinition: [
        publisherkit,
        "templateId",
      ],
    },
    modifications: {
      type: "string[]",
      label: "Modifications",
      description: "Array of objects representing which elements to modify in the template",
    },
    info: {
      type: "alert",
      alertType: "info",
      content: `Additional information regarding **Modifications** can be found in the **[documentation](https://publisherkit.com/documentation/api)**
        \nThe "name" must match the name of the element in the template.
        \n
        \nIf the element is text and you want to change it, it should be added as "text":"new text".
        \n
        \nIf you want to change an image object, it should be "src":"image url".
        \n
        \nExample:
        \`\`\` [
          {
            "name": "headline",
            "text": MY_HEADLINE,
          },
          {
            "name": "feature_image",
            "src": IMAGE_URL,
          }
        ]\`\`\`
        `,
    },
  },
  async run({ $ }) {
    const modifications = this.modifications?.map((modification) => typeof modification === "string"
      ? JSON.parse(modification)
      : modification);
    const response = await this.publisherkit.createImage({
      $,
      data: {
        images: [
          {
            templateID: this.templateId,
            modifications,
          },
        ],
      },
    });
    $.export("$summary", `Successfully created image with ID: ${response.images[0]._id}`);
    return response;
  },
};
