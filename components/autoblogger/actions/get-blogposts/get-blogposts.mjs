import app from "../../autoblogger.app.mjs";

export default {
  key: "autoblogger-get-blogposts",
  name: "Get Blogposts",
  description: "Retrieves blogposts using the API key. [See the documentation](https://u.pcloud.link/publink/show?code=XZdjuv0ZtabS8BN58thUiE8FGjznajoMc6Qy)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },

  async run({ $ }) {
    const response = await this.app.getBlogposts({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.length} blogposts`);

    return response;
  },
};
