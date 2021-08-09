const validate = require("validate.js");
const {
  props,
  methods,
} = require("../common");
const get = require("lodash/get");

module.exports = {
  key: "notion-query-database-pages",
  name: "Query Database Pages",
  description:
    "Gets a list of Pages contained in the specified database, according to filter conditions.",
  version: "0.0.1",
  type: "action",
  props: {
    ...props,
    databaseId: {
      propDefinition: [
        props.notion,
        "databaseId",
      ],
      optional: true,
    },
    filter: {
      type: "object",
      label: "Filter",
      description:
        "The [filter conditions](https://developers.notion.com/reference-link/post-database-query-filter) which if provided will limit the pages included in the results.",
      optional: true,
    },
    sorts: {
      type: "string",
      label: "Sorts",
      description:
        "A JSON-based array of [sort criteria](https://developers.notion.com/reference-link/post-database-query-sort) used to order the pages included in the results. Example `[{\"property\":\"Last ordered\",\"direction\":\"ascending\"}]`",
      optional: true,
    },
    startCursor: {
      propDefinition: [
        props.notion,
        "startCursor",
      ],
    },
    pageSize: {
      propDefinition: [
        props.notion,
        "pageSize",
      ],
    },
  },
  methods: {
    ...methods,
  },
  async run() {
    const constraints = {
      databaseId: {
        presence: true,
      },
    };
    if (this.sorts) {
      validate.validators.arrayValidator = this.validateArray;
      constraints.sorts = {
        arrayValidator: {
          value: this.sorts,
          key: "sorts",
        },
      };
    }
    const validationResult = validate(
      {
        databaseId: this.databaseId,
        sorts: this.sorts,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    const sorts = this.sorts ?
      this.getArrayObject(this.sorts) :
      null;
    const pages = [];
    let page;
    let startCursor = this.startCursor;
    do {
      page = await this.notion.queryDatabasePages(
        this.databaseId,
        this.filter,
        sorts,
        startCursor,
        this.pageSize,
      );
      const hasResults = get(page, [
        "results",
        "length",
      ]);
      if (!hasResults) {
        break;
      }
      page.results.forEach((result) => pages.push(result));
      if (page.next_cursor) {
        startCursor = page.next_cursor;
      }
    } while (page.has_more);
    return pages;
  },
};
