import screvi from "../../screvi.app.mjs";

export default {
  key: "screvi-update-article",
  name: "Update Article",
  description: "Move an article between the inbox, Later and the archive, favorite it, or replace its tags. [See the documentation](https://screvi.com/docs/api/public-api)",
  version: "0.0.1",
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
        tags: this.tags?.length
          ? this.tags
          : undefined,
      },
    });

    $.export("$summary", `Updated article \`${data.title || data.id}\``);

    return data;
  },
};
