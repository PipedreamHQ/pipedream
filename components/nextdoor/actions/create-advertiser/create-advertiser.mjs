import app from "../../nextdoor.app.mjs";

export default {
  key: "nextdoor-create-advertiser",
  name: "Create Advertiser",
  description: "Creates an advertiser that is tied to the NAM profile the API credentials are tied to. [See the documentation](https://developer.nextdoor.com/reference/advertiser-create).",
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
      description: "The name of the advertiser.",
      propDefinition: [
        app,
        "name",
      ],
    },
    websiteUrl: {
      propDefinition: [
        app,
        "websiteUrl",
      ],
    },
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
      ],
    },
  },
  methods: {
    createAdvertiser(args = {}) {
      return this.app.post({
        path: "/advertiser/create",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createAdvertiser,
      name,
      websiteUrl,
      categoryId,
    } = this;

    const response = await createAdvertiser({
      $,
      data: {
        name,
        website_url: websiteUrl,
        category_id: categoryId,
      },
    });

    $.export("$summary", `Successfully created advertiser with ID \`${response.id}\`.`);
    return response;
  },
};
