import app from "../../omnivore.app.mjs";
import article from "../../common/queries/article.mjs";

export default {
  key: "omnivore-get-article",
  name: "Get Article",
  description: "Get a single article and its content. [See the documentation](https://github.com/omnivore-app/omnivore/blob/main/packages/api/src/schema.ts#L2659)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    username: {
      label: "Username",
      description: "The username of the user.",
      propDefinition: [
        app,
        "userId",
        () => ({
          mapper: ({
            name: label,
            profile: { username: value },
          }) => ({
            label,
            value,
          }),
        }),
      ],
    },
    slug: {
      label: "Article Slug",
      description: "The slug of the article.",
      propDefinition: [
        app,
        "articleId",
        () => ({
          mapper: ({
            node: {
              slug: value,
              title: label,
            },
          }) => ({
            label,
            value,
          }),
        }),
      ],
    },
    format: {
      propDefinition: [
        app,
        "format",
      ],
    },
  },
  methods: {
    getArticle(variables = {}) {
      return this.app.makeRequest({
        query: article.queries.getArticle,
        variables,
      });
    },
  },
  async run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      getArticle,
      ...variables
    } = this;

    const { article: response }
      = await getArticle(variables);

    if (response.errorCodes?.length) {
      throw new Error(JSON.stringify(response, null, 2));
    }

    step.export("$summary", `Successfully retrieved article with ID \`${response.article.id}\`.`);

    return response;
  },
};
