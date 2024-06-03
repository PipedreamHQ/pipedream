import flippingbook from "../../flippingbook.app.mjs";

export default {
  key: "flippingbook-find-flipbook-by-title",
  name: "Find Flipbook by Title",
  description: "Locates a specific flipbook using the provided title as prop. The action returns details of the flipbook that matches the input title. [See the documentation](https://apidocs.flippingbook.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    flippingbook,
    flipbookTitle: {
      type: "string",
      label: "Flipbook Title",
      description: "The title of the flipbook to locate.",
      required: true,
    },
  },
  async run({ $ }) {
    const response = await this.flippingbook._makeRequest({
      url: `${this.flippingbook._baseUrl()}/api/v1/fbonline/publications`,
      headers: {
        Authorization: this.flippingbook.$auth.api_token,
      },
    });
    const flipbook = response.find(
      (publication) => publication.title === this.flipbookTitle,
    );
    if (!flipbook) {
      throw new Error(`No flipbook found with the title: ${this.flipbookTitle}`);
    }
    $.export("$summary", `Found flipbook with ID: ${flipbook.id}`);
    return flipbook;
  },
};
