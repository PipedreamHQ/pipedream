import app from "../../sproutgigs.app.mjs";

export default {
  key: "sproutgigs-get-categories",
  name: "Get Categories",
  description: "Get a list of categories from Sproutgigs. [See the documentation](https://sproutgigs.com/api/documentation.php#gigs-categories)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getCategories({
      $,
      data: {},
    });
    $.export("$summary", "Successfully sent the request. " + response.length + " results retrieved");
    return response;
  },
};
