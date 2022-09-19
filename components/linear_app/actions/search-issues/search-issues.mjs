import constants from "../../common/constants.mjs";
import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-search-issues",
  name: "Search Issues",
  description: "Search issues (API Key). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api)",
  type: "action",
  version: "0.1.3",
  props: {
    linearApp,
    query: {
      propDefinition: [
        linearApp,
        "query",
      ],
    },
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
      ],
      optional: true,
    },
    projectId: {
      propDefinition: [
        linearApp,
        "projectId",
      ],
    },
    assigneeId: {
      propDefinition: [
        linearApp,
        "assigneeId",
      ],
    },
    issueLabels: {
      propDefinition: [
        linearApp,
        "issueLabels",
      ],
    },
    orderBy: {
      propDefinition: [
        linearApp,
        "orderBy",
      ],
    },
    includeArchived: {
      propDefinition: [
        linearApp,
        "includeArchived",
      ],
    },
  },
  methods: {
    buildFilter() {
      return {
        team: {
          id: {
            eq: this.teamId,
          },
        },
        project: {
          id: {
            eq: this.projectId,
          },
        },
        assignee: {
          id: {
            eq: this.assigneeId,
          },
        },
        labels: {
          name: {
            in: this.issueLabels,
          },
        },
      };
    },
  },
  async run({ $ }) {
    const {
      query,
      orderBy,
      includeArchived,
    } = this;

    const issues = [];
    let hasNextPage;
    let after;
    const filter = this.buildFilter();

    do {
      const {
        nodes,
        pageInfo,
      } = await this.linearApp.searchIssues({
        query,
        variables: {
          filter,
          orderBy,
          after,
          includeArchived,
          first: constants.DEFAULT_LIMIT,
        },
      });

      issues.push(...nodes);
      after = pageInfo.endCursor;
      hasNextPage = pageInfo.hasNextPage;
    } while (hasNextPage);

    $.export("$summary", `Found ${issues.length} issues`);

    return issues;
  },
};
