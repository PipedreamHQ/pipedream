import constants from "./constants.mjs";

async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function buildVariables(endCursor, args) {
  const filter = {};

  if (args.filter.query) {
    filter.title = {
      containsIgnoreCase: args.filter.query,
    };
  }
  if (args.filter.teamId) {
    filter.team = {
      id: {
        eq: args.filter.teamId,
      },
    };
  }
  if (args.filter.projectId) {
    filter.project = {
      id: {
        eq: args.filter.projectId,
      },
    };
  }
  if (args.filter.team?.id?.in) {
    filter.team = {
      id: {
        in: args.filter.team.id.in,
      },
    };
  }
  if (args.filter.project?.id?.eq) {
    filter.project = {
      id: {
        eq: args.filter.project.id.eq,
      },
    };
  }
  if (args.filter.state?.id?.eq) {
    filter.state = {
      id: {
        eq: args.filter.state.id.eq,
      },
    };
  }
  if (args.filter.assigneeId) {
    filter.assignee = {
      id: {
        eq: args.filter.assigneeId,
      },
    };
  }
  if (args.filter.issueLabels) {
    filter.labels = {
      name: {
        in: args.filter.issueLabels,
      },
    };
  }
  if (args.filter.createdAt?.gte) {
    filter.createdAt = {
      gte: args.filter.createdAt.gte,
    };
  }
  if (args.filter.accessibleTeams?.id?.eq) {
    filter.accessibleTeams = {
      id: {
        eq: args.filter.accessibleTeams.id.eq,
      },
    };
  }
  if (args.filter.accessibleTeams?.id?.in) {
    filter.accessibleTeams = {
      id: {
        in: args.filter.accessibleTeams.id.in,
      },
    };
  }

  // Determine the appropriate limit:
  // 1. Use custom limit if provided
  // 2. Use a smaller default limit when no query is provided to avoid returning too many results
  // 3. Otherwise use the standard default limit
  const limit = args.limit
    ? args.limit
    : (args.filter.query
      ? constants.DEFAULT_LIMIT
      : constants.DEFAULT_NO_QUERY_LIMIT);

  const variables = {
    filter,
    first: limit,
  };

  if (args.orderBy) {
    variables.orderBy = args.orderBy;
  }
  if (args.includeArchived) {
    variables.includeArchived = args.includeArchived;
  }
  if (endCursor) {
    variables.after = endCursor;
  }

  return variables;
}

// Linear nests the actionable part of a rejected query — `eq must be a UUID` and
// the like — under extensions.validationErrors, arbitrarily deep, while the
// top-level message stays a generic "Argument Validation Error"
function flattenValidationErrors(validationErrors = [], path = []) {
  return validationErrors.flatMap(({
    property, constraints, children,
  }) => {
    const propertyPath = [
      ...path,
      property,
    ];
    return [
      ...Object.values(constraints ?? {})
        .map((constraint) => `${propertyPath.join(".")}: ${constraint}`),
      ...flattenValidationErrors(children, propertyPath),
    ];
  });
}

function formatGraphQlErrors(errors = []) {
  return errors
    .map(({
      message, extensions,
    }) => {
      const details = flattenValidationErrors(extensions?.validationErrors);
      return details.length
        ? `${message} (${details.join("; ")})`
        : message;
    })
    .join("; ");
}

export default {
  streamIterator,
  buildVariables,
  formatGraphQlErrors,
};
