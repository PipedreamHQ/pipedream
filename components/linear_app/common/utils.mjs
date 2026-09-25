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

/**
 * Walks the `extensions.validationErrors` tree Linear attaches to a rejected
 * query. Each node names one property and may carry both `constraints` — the
 * readable failures, such as `eq must be a UUID` — and `children` nesting the
 * next property down, so `team` → `id` → `eq` describes a single filter field.
 *
 * @param {object[]} [validationErrors] - nodes to walk; anything that is not an
 * array yields nothing, since Linear omits or nulls the key on other errors
 * @param {string[]} [path] - property names collected from the ancestors
 * @returns {string[]} one `property.path: constraint` line per failure
 */
function flattenValidationErrors(validationErrors, path = []) {
  if (!Array.isArray(validationErrors)) {
    return [];
  }
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

/**
 * Renders a GraphQL `errors` array as one message. Linear leaves the top-level
 * message generic — "Argument Validation Error" — and buries what actually went
 * wrong in the extensions, so the details are appended in parentheses where
 * they exist.
 *
 * @param {object[]} [errors] - the `errors` array from a Linear response
 * @returns {string} the errors joined with `; `, empty when there are none
 */
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

/**
 * Finds the property descriptor for `field` on `obj`, walking the prototype
 * chain since class-level accessors (like `@linear/sdk` model getters) are
 * defined on the prototype, not the instance.
 *
 * @param {object} obj - the object to search
 * @param {string} field - the property name to look up
 * @returns {PropertyDescriptor|undefined} the descriptor, wherever it's found
 */
function findPropertyDescriptor(obj, field) {
  for (let target = obj; target; target = Object.getPrototypeOf(target)) {
    const descriptor = Object.getOwnPropertyDescriptor(target, field);
    if (descriptor) {
      return descriptor;
    }
  }
  return undefined;
}

/**
 * Narrows an object down to a caller-specified set of keys, for actions that
 * expose an optional `fields` prop to shrink large API payloads. Returns the
 * object unchanged when no fields are requested, so callers can apply this
 * unconditionally instead of branching on whether `fields` was provided.
 *
 * Some nodes (e.g. `@linear/sdk` model instances returned by `list-users` and
 * other actions backed by the SDK client rather than a raw GraphQL query)
 * expose relationship fields as lazy getters (e.g. `User.organization`)
 * defined on the class prototype — merely *accessing* one triggers a real API
 * fetch and returns an unresolved promise, so simply checking the resolved
 * value after the fact is too late. The property descriptor is inspected
 * first instead: a `get`-backed accessor is skipped without ever being read,
 * while plain scalar fields (assigned directly in the SDK model's
 * constructor, own data properties) are read and returned as-is.
 *
 * @param {object} obj - the object to narrow
 * @param {string[]} [fields] - keys to keep; the full object is returned when
 * empty or omitted
 * @returns {object} `obj` itself, or a new object containing only `fields`
 */
function pickFields(obj, fields) {
  if (!fields?.length) {
    return obj;
  }
  const shaped = {};
  for (const field of fields) {
    const descriptor = findPropertyDescriptor(obj, field);
    shaped[field] = descriptor?.get
      ? undefined
      : obj[field];
  }
  return shaped;
}

/**
 * Caps a caller-supplied `first` page size at the shared propDefinition's
 * documented maximum. Pipedream's `max` on an integer prop is a UI-form hint
 * only — it is not enforced on the value an MCP tool call actually sends — so
 * a model that ignores the description and requests an oversized page can
 * trip Linear's GraphQL query-complexity limit. Values above `max` are
 * clamped down instead of rejected; an omitted value is left as-is so the
 * API's own default still applies.
 *
 * @param {number} [first] - the caller-supplied page size
 * @param {number} [max] - the documented maximum (matches the shared `first`
 * propDefinition's `max`)
 * @returns {number|undefined} `first` clamped to `max`, or unchanged if omitted
 */
function clampFirst(first, max = 100) {
  return first
    ? Math.min(first, max)
    : first;
}

export default {
  streamIterator,
  buildVariables,
  formatGraphQlErrors,
  pickFields,
  clampFirst,
};
