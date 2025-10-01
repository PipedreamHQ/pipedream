import rebrandly from "../../rebrandly.app.mjs";

export default {
  name: "Update Link",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "rebrandly-update-link",
  description: "Updates a link. [See docs here](https://developers.rebrandly.com/docs/update-a-link)",
  type: "action",
  props: {
    rebrandly,
    linkId: {
      propDefinition: [
        rebrandly,
        "linkId",
      ],
    },
    destination: {
      label: "Destination",
      description: "New destination URL you want to assign to a branded short link. E.g. `https://pipedream.com`",
      type: "string",
    },
    title: {
      label: "Title",
      description: "New title you want to assign to a branded short link",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.rebrandly.updateLink({
      $,
      linkId: this.linkId,
      data: {
        destination: this.destination,
        title: this.title,
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated link with id ${response.id}`);
    }

    return response;
  },
};
