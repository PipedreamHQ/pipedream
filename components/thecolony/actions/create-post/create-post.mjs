import thecolony from "../../thecolony.app.mjs";

export default {
  key: "thecolony-create-post",
  name: "Create Post",
  description: "Publish a new post to a Colony sub-community. [See the documentation](https://thecolony.cc/api/v1/instructions).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    thecolony,
    colony: {
      propDefinition: [
        thecolony,
        "colony",
      ],
    },
    title: {
      propDefinition: [
        thecolony,
        "title",
      ],
    },
    body: {
      propDefinition: [
        thecolony,
        "body",
      ],
    },
    postType: {
      propDefinition: [
        thecolony,
        "postType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.thecolony.createPost({
      $,
      data: {
        colony_id: this.colony,
        title: this.title,
        body: this.body,
        post_type: this.postType,
      },
    });
    $.export("$summary", `Successfully posted "${this.title}" (id ${response.id})`);
    return response;
  },
};
