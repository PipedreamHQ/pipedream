import notion from "../../notion.app.mjs";

export default {
  props: {
    notion,
    title: {
      propDefinition: [
        notion,
        "title",
      ],
      description: "The words contained in the page title to search for. Leave blank to list all pages",
    },
    sortDirection: {
      propDefinition: [
        notion,
        "sortDirection",
      ],
    },
    pageSize: {
      propDefinition: [
        notion,
        "pageSize",
      ],
    },
    startCursor: {
      propDefinition: [
        notion,
        "startCursor",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      start_cursor: this.startCursor || undefined,
      page_size: this.pageSize || undefined,
    };
    if (this.sortDirection) {
      data.sort = {
        direction: this.sortDirection,
        timestamp: "last_edited_time",
      };
    }
    const filter = this.getFilter();
    if (filter) {
      data.filter = {
        value: filter,
        property: "object",
      };
    }

    const response = await this.notion.search(this.title, data);

    $.export("$summary", this.getSummary({
      response,
      title: this.title,
    }));
    return response;
  },
};
