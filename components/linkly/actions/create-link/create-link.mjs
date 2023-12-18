import linkly from "../../linkly.app.mjs";

export default {
  key: "linkly-create-link",
  name: "Create Link",
  description: "Creates a new Linkly link using the provided URL and alias.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    linkly,
    url: {
      type: "string",
      label: "URL",
      description: "The URL to shorten",
      required: true,
    },
    alias: {
      type: "string",
      label: "Alias",
      description: "The alias for the shortened URL",
      required: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title for the shortened URL",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description for the shortened URL",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.linkly.createLink({
      url: this.url,
      alias: this.alias,
      title: this.title,
      description: this.description,
    });
    $.export("$summary", `Successfully created Linkly link with alias ${this.alias}`);
    return response;
  },
};
