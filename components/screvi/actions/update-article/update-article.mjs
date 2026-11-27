import screvi from "../../screvi.app.mjs";

export default {
  key: "screvi-update-article",
  name: "Update Article",
  description: "Move an article between the inbox, Later and the archive, favorite it, or replace its tags. [See the documentation](https://screvi.com/docs/api/public-api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    screvi,
    articleId: {
      propDefinition: [
        screvi,
        "articleId",
      ],
    },
    homeStatus: {
      propDefinition: [
        screvi,
        "homeStatus",
      ],
      optional: true,
    },
    favorite: {
      type: "boolean",
      label: "Favorite",
      description: "Whether the article is favorited",
      optional: true,
    },
    tags: {
      propDefinition: [
        screvi,
        "tags",
      ],
      description: "Replaces the article's tags. They must already exist in your Screvi account",
    },
  },
  async run({ $ }) {
    const { data } = await this.screvi.updateArticle({
      $,
      articleId: this.articleId,
      data: {
        home_status: this.homeStatus,
        favorite: this.favorite,
        // Pass the array through as-is: PATCH /articles/:id replaces the tag
        // set, so an explicit [] is how a workflow clears every tag. Leaving
        // the prop unset sends undefined, which omits the key and leaves the
        // existing tags alone.
        tags: this.tags,
      },
    });

    $.export("$summary", `Updated article \`${data.title || data.id}\``);

    return data;
  },
};
