import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-search-issues",
  name: "Search Issues",
  description: "Search issues (API Key). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api)",
  type: "action",
  version: "0.0.1",
  props: {
    linearApp,
    query: {
      propDefinition: [
        linearApp,
        "query",
      ],
    },
    orderBy: {
      propDefinition: [
        linearApp,
        "orderBy",
      ],
    },
    after: {
      propDefinition: [
        linearApp,
        "after",
      ],
    },
    first: {
      propDefinition: [
        linearApp,
        "first",
      ],
    },
    before: {
      propDefinition: [
        linearApp,
        "before",
      ],
    },
    last: {
      propDefinition: [
        linearApp,
        "last",
      ],
    },
    includeArchived: {
      propDefinition: [
        linearApp,
        "includeArchived",
      ],
    },
  },
  async run({ $ }) {
    const {
      query,
      orderBy,
      first,
      last,
      includeArchived,
    } = this;

    const hasAfterOrFirst = !!(this.after || first);
    const hasBeforeOrLast = !!(this.before || last);

    if (hasAfterOrFirst && hasBeforeOrLast) {
      throw new Error("Cannot use both `after/first` and `before/last` at the same time.");
    }

    let issues = [];
    let hasNextPage;
    let after = this.after;
    let before = this.before;

    do {
      const {
        nodes,
        pageInfo,
      } =
        await this.linearApp.searchIssues({
          query,
          variables: {
            orderBy,
            after,
            first,
            before,
            last,
            includeArchived,
          },
        });

      if (hasAfterOrFirst) {
        after = pageInfo.endCursor;
      }

      if (hasBeforeOrLast) {
        before = pageInfo.endCursor;
      }

      issues = issues.concat(nodes);
      hasNextPage = pageInfo.hasNextPage;

    } while (hasNextPage);

    $.export("summary", `Found ${issues.length} issues`);

    return issues;
  },
};
