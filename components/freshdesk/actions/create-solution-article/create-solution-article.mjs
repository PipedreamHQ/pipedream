import freshdesk from "../../freshdesk.app.mjs";
import constants from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "freshdesk-create-solution-article",
  name: "Create Solution Article",
  description: "Create a solution article in Freshdesk. [See the documentation](https://developers.freshdesk.com/api/#solution_article_attributes)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshdesk,
    categoryId: {
      propDefinition: [
        freshdesk,
        "categoryId",
      ],
    },
    folderId: {
      propDefinition: [
        freshdesk,
        "folderId",
        (c) => ({
          categoryId: c.categoryId,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the article",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the article",
    },
    status: {
      type: "integer",
      label: "Status",
      description: "Status of the article",
      options: constants.ARTICLE_STATUS,
    },
    seoData: {
      type: "object",
      label: "SEO Data",
      description: "Meta data for search engine optimization. Allows meta_title, meta_description and meta_keywords",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags for the article",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.freshdesk.createArticle({
      $,
      folderId: this.folderId,
      data: {
        title: this.title,
        description: this.description,
        status: this.status,
        seo_data: parseObject(this.seoData),
        tags: this.tags,
      },
    });
    $.export("$summary", `Successfully created solution article ${this.title}`);
    return response;
  },
};
