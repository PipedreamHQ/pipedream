import app from "../../missive.app.mjs";

export default {
  key: "missive-create-post",
  name: "Create Post",
  description: "Create a new post. [See the Documentation](https://missiveapp.com/help/api-documentation/rest-endpoints#create-post)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    titleNotification: {
      type: "string",
      label: "Notification Title",
      description: "The title of the notification.",
    },
    bodyNotification: {
      type: "string",
      label: "Notification Body",
      description: "The body of the notification.",
    },
    markdown: {
      type: "string",
      label: "Markdown",
      description: "The [markdown](https://daringfireball.net/projects/markdown/syntax) content of the post.",
    },
    close: {
      type: "boolean",
      label: "Close",
      description: "Lets you close the post's conversation for everyone having access to the conversation.",
      optional: true,
    },
  },
  methods: {
    createPost(args = {}) {
      return this.app.post({
        path: "/posts",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      titleNotification,
      bodyNotification,
      markdown,
      close,
    } = this;

    const response = await this.createPost({
      step,
      data: {
        posts: {
          notification: {
            title: titleNotification,
            body: bodyNotification,
          },
          markdown,
          close,
        },
      },
    });

    step.export("$summary", `Successfully created post with ID ${response.posts.conversation}`);

    return response;
  },
};
