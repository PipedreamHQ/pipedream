import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-register-image",
  name: "Register Uploaded Image",
  description: "Register an image in the media library after it has been uploaded to the Cloudflare Images `uploadURL` returned by **Create Media Upload URL**. [See the documentation](https://contentrabbitai.com/docs/api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    contentRabbitApp,
    cloudflareImageId: {
      type: "string",
      label: "Cloudflare Image ID",
      description: "The image ID returned by **Create Media Upload URL**, after the file has been uploaded to its `uploadURL`.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title for the registered image.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description for the registered image.",
      optional: true,
    },
    altText: {
      type: "string",
      label: "Alt Text",
      description: "Alt text for the registered image.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags for the registered image.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.contentRabbitApp.registerImage({
      $,
      data: {
        cloudflareImageId: this.cloudflareImageId,
        title: this.title,
        description: this.description,
        altText: this.altText,
        tags: this.tags,
      },
    });
    $.export("$summary", `Registered image "${this.cloudflareImageId}"`);
    return response;
  },
};
