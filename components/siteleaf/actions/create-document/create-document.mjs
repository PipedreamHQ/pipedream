import app from "../../siteleaf.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create Document",
  description: "Create a new document. [See the docs here](https://learn.siteleaf.com/api/documents/#create-a-document)",
  key: "siteleaf-create-document",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
      description: "The site to create the document on",
    },
    collectionPath: {
      propDefinition: [
        app,
        "collectionPath",
        ({ siteId }) => ({
          siteId,
        }),
      ],
      description: "The collection to create the document on",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the document",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The body of the document",
      optional: true,
    },
    path: {
      type: "string",
      label: "Path",
      description: "Path of the document relative to its collection",
      optional: true,
    },
    permalink: {
      type: "string",
      label: "Permalink",
      description: "Custom permalink, overrides the generated `url`",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "[ISO8601](https://www.iso.org/iso-8601-date-and-time-format.html) formatted date",
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Valid options are `visible` and `hidden`, defaults to `visible`",
      options: constants.VISIBILITY_OPTIONS,
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Arbitrary key/value pairs",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags for the document",
      optional: true,
    },
    categories: {
      type: "string[]",
      label: "Categories",
      description: "Categories for the document",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      title: this.title,
      body: this.body,
      path: this.path,
      permalink: this.permalink,
      date: this.date,
      visibility: this.visibility,
      metadata: this.metadata,
      tags: this.tags,
      categories: this.categories,
    };
    const res = await this.app.createDocument(this.siteId, this.collectionPath, data);
    $.export("$summary", "Document successfully created");
    return res;
  },
};
