import constants from "./constants.mjs";
import utils from "./utils.mjs";

describe("formatGraphQlErrors", () => {
  it("returns an empty string when there is nothing to report", () => {
    expect(utils.formatGraphQlErrors()).toBe("");
    expect(utils.formatGraphQlErrors([])).toBe("");
  });

  it("passes through a message that carries no validation detail", () => {
    expect(utils.formatGraphQlErrors([
      {
        message: "Entity not found: Issue",
      },
    ])).toBe("Entity not found: Issue");
  });

  // The payload Linear returns for `filter: { team: { id: { eq: "DEV" } } }`,
  // which is what a team key instead of a UUID produces
  it("unnests the constraint Linear buries under a generic message", () => {
    expect(utils.formatGraphQlErrors([
      {
        message: "Argument Validation Error",
        extensions: {
          code: "INVALID_INPUT",
          validationErrors: [
            {
              property: "team",
              children: [
                {
                  property: "id",
                  children: [
                    {
                      property: "eq",
                      children: [],
                      constraints: {
                        isUuid: "eq must be a UUID",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    ])).toBe("Argument Validation Error (team.id.eq: eq must be a UUID)");
  });

  // each entry repeats its property path so it stays readable once several
  // properties fail at once
  it("reports every constraint on a property", () => {
    expect(utils.formatGraphQlErrors([
      {
        message: "Argument Validation Error",
        extensions: {
          validationErrors: [
            {
              property: "first",
              constraints: {
                isInt: "first must be an integer",
                max: "first must not be greater than 250",
              },
            },
          ],
        },
      },
    ])).toBe("Argument Validation Error (first: first must be an integer; first: first must not be greater than 250)");
  });

  it("survives null in place of the arrays Linear usually sends", () => {
    expect(utils.formatGraphQlErrors([
      {
        message: "Argument Validation Error",
        extensions: {
          validationErrors: null,
        },
      },
      {
        message: "Other Error",
        extensions: {
          validationErrors: [
            {
              property: "team",
              children: null,
              constraints: {
                isUuid: "team must be a UUID",
              },
            },
          ],
        },
      },
    ])).toBe("Argument Validation Error; Other Error (team: team must be a UUID)");
  });

  it("joins several errors", () => {
    expect(utils.formatGraphQlErrors([
      {
        message: "one",
      },
      {
        message: "two",
      },
    ])).toBe("one; two");
  });
});

describe("buildVariables", () => {
  it("maps a team id onto the filter Linear expects", () => {
    const { filter } = utils.buildVariables(null, {
      filter: {
        teamId: "749360b9-aad3-472b-bc87-ff44d0b3a9cf",
      },
    });
    expect(filter.team).toEqual({
      id: {
        eq: "749360b9-aad3-472b-bc87-ff44d0b3a9cf",
      },
    });
  });

  it("maps assignee, project, state and labels", () => {
    const { filter } = utils.buildVariables(null, {
      filter: {
        assigneeId: "assignee-id",
        projectId: "project-id",
        state: {
          id: {
            eq: "state-id",
          },
        },
        issueLabels: [
          "bug",
          "urgent",
        ],
      },
    });
    expect(filter).toEqual({
      assignee: {
        id: {
          eq: "assignee-id",
        },
      },
      project: {
        id: {
          eq: "project-id",
        },
      },
      state: {
        id: {
          eq: "state-id",
        },
      },
      labels: {
        name: {
          in: [
            "bug",
            "urgent",
          ],
        },
      },
    });
  });

  it("turns a free-text query into a case-insensitive title match", () => {
    const { filter } = utils.buildVariables(null, {
      filter: {
        query: "flaky",
      },
    });
    expect(filter.title).toEqual({
      containsIgnoreCase: "flaky",
    });
  });

  it("omits absent filters rather than sending empty comparators", () => {
    const { filter } = utils.buildVariables(null, {
      filter: {},
    });
    expect(filter).toEqual({});
  });

  it("prefers an explicit limit", () => {
    expect(utils.buildVariables(null, {
      filter: {},
      limit: 5,
    }).first).toBe(5);
  });

  it("falls back to a small page when no query narrows the search", () => {
    expect(utils.buildVariables(null, {
      filter: {},
    }).first).toBe(constants.DEFAULT_NO_QUERY_LIMIT);
  });

  it("allows a full page once a query narrows the search", () => {
    expect(utils.buildVariables(null, {
      filter: {
        query: "flaky",
      },
    }).first).toBe(constants.DEFAULT_LIMIT);
  });

  it("passes the cursor and paging options through only when set", () => {
    expect(utils.buildVariables(null, {
      filter: {},
    })).not.toHaveProperty("after");

    expect(utils.buildVariables("cursor", {
      filter: {},
      orderBy: constants.FIELD.UPDATED_AT,
      includeArchived: true,
    })).toMatchObject({
      after: "cursor",
      orderBy: "updatedAt",
      includeArchived: true,
    });
  });
});
