import notion from "../../notion.app.mjs";
import utils from "../../common/utils.mjs";
import base from "../common/base-page-builder.mjs";

const MAX_BLOCKS = 100;

export default {
  ...base,
  key: "notion-create-page",
  name: "Create Page",
  description:
    "Create a new Notion page. The `parent` can be **either** another page (creates a subpage) **or** a database/data source (creates a row in that database)."
    + " Provide the parent's ID or URL — use **Search** to resolve a name into an ID."
    + " When the parent is a database, set `properties` to a flat JSON object of column-name → value (e.g. `{ \"Status\": \"Active\", \"ThreatLevel\": 9 }`); call **Retrieve Database Schema** first to learn the exact column names and valid select options."
    + " `content` is the page body as Markdown (headings, bullet lists, paragraphs, etc.)."
    + " [See the documentation](https://developers.notion.com/reference/post-page)",
  version: "0.4.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    notion,
    parent: {
      type: "string",
      label: "Parent (Page or Data Source ID)",
      description: "ID or URL of the parent **page** (creates a subpage) or **data source** (creates a database row). Use **Search** to resolve a name into an ID.",
    },
    title: {
      propDefinition: [
        notion,
        "title",
      ],
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "Only for pages created in a database. A flat JSON object of column-name → value, e.g. `{ \"Status\": \"Active\", \"ThreatLevel\": 9 }`. Use **Retrieve Database Schema** to discover valid names and select options.",
      optional: true,
    },
    content: {
      type: "string",
      label: "Content",
      description: "The page body as Markdown. [Markdown reference](https://www.notion.com/help/writing-and-editing-basics#markdown-and-shortcuts).",
      optional: true,
    },
  },
  async run({ $ }) {
    const parentId = utils.extractNotionId(this.parent);
    const { content } = this;

    // Determine whether the parent is a data source (database) or a page.
    let dataSource = null;
    try {
      dataSource = await this.notion.retrieveDataSource(parentId);
    } catch {
      dataSource = null;
    }

    let response;

    if (dataSource) {
      // Create a row (page) inside the data source.
      const parsed = utils.parsePropertiesObject(this.properties) || {};
      if (this.title) {
        const titleProp = Object.entries(dataSource.properties)
          .find(([
            ,
            value,
          ]) => value.type === "title")?.[0];
        if (titleProp) {
          parsed[titleProp] = this.title;
        }
      }
      this.properties = parsed;

      const properties = this.buildPageProperties(dataSource.properties);
      const children = content?.trim()
        ? this.createBlocks(content)
        : [];

      response = await this.notion.createPage({
        parent: {
          type: "data_source_id",
          data_source_id: parentId,
        },
        properties,
        children: children.slice(0, MAX_BLOCKS),
      });

      let remaining = children.slice(MAX_BLOCKS);
      while (remaining.length > 0) {
        await this.notion.appendBlock(response.id, remaining.slice(0, MAX_BLOCKS));
        remaining = remaining.slice(MAX_BLOCKS);
      }
    } else {
      // Create a subpage under a parent page.
      response = await this.buildPageFromDataSource({
        pageContent: content,
        parentPageId: parentId,
        properties: [
          {
            label: "title",
            type: "title",
            value: this.title || "Untitled",
          },
        ],
      });
    }

    $.export("$summary", `Created page${this.title
      ? ` "${this.title}"`
      : ""}${response?.url
      ? ` (${response.url})`
      : ""}`);
    return response;
  },
};
