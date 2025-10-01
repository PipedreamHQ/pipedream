import app from "../../metatext_ai_pre_build_ai_models_api.app.mjs";

export default {
  key: "metatext_ai_pre_build_ai_models_api-generate-blog-post",
  name: "Generate Blog Post",
  description: "Generate a blog post based on the given prompt. [See the documentation](https://app.metatext.ai/models/blog-post-generation/inference-api).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
  },
  methods: {
    generateBlogPost(args = {}) {
      return this.app.post({
        path: "/blog-post-generation",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const response = await this.generateBlogPost({
      step,
      data: {
        text: this.text,
      },
    });

    step.export("$summary", "Successfully generated blog post.");

    return response;
  },
};
