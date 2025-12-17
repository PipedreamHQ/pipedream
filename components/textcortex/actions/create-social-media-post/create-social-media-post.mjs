import app from "../../textcortex.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "textcortex-create-social-media-post",
  name: "Create Social Media Post",
  description: "Create a social media post. [See the documentation](https://docs.textcortex.com/api/paths/texts-social-media-posts/post)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    context: {
      type: "string",
      label: "Context",
      description: "The context of the social media post.",
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "Keywords to be included in the post.",
      optional: true,
    },
    maxTokens: {
      propDefinition: [
        app,
        "maxTokens",
      ],
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "The platform, e.g. `twitter` to generate a Tweet. Allowed values: `twitter`, `linkedin`",
      options: Object.values(constants.SOCIAL_MEDIA_MODE),
    },
    model: {
      propDefinition: [
        app,
        "model",
      ],
    },
    n: {
      propDefinition: [
        app,
        "n",
      ],
    },
    sourceLang: {
      propDefinition: [
        app,
        "sourceLang",
      ],
    },
    targetLang: {
      propDefinition: [
        app,
        "targetLang",
      ],
    },
    temperature: {
      propDefinition: [
        app,
        "temperature",
      ],
    },
  },
  methods: {
    createSocialMediaPost(args = {}) {
      return this.app.post({
        path: "/texts/social-media-posts",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      createSocialMediaPost,
      context,
      keywords,
      maxTokens,
      mode,
      model,
      n,
      sourceLang,
      targetLang,
      temperature,
    } = this;

    const response = await createSocialMediaPost({
      step,
      data: {
        context,
        keywords,
        max_tokens: maxTokens,
        mode,
        model,
        n,
        source_lang: sourceLang,
        target_lang: targetLang,
        temperature,
      },
    });

    step.export("$summary", `Successfully created social media post with status \`${response.status}\``);

    return response;
  },
};
