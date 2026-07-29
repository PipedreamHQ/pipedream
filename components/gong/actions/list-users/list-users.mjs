// x-pd-ai: optimized
import app from "../../gong.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "gong-list-users",
  name: "List Users",
  description: `List the Gong users in your company and return an array of user objects. Use this to fetch the user ID by using a rep's name or email. [See the documentation](${constants.DOCS_URL}#post-/v2/users/extensive)`,
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    userIds: {
      type: "string[]",
      label: "User IDs",
      description: "Return only these users, as a list of Gong user IDs (e.g. `[\"4011503062935085673\"]`). Pass a single ID to fetch one user.",
      propDefinition: [
        app,
        "userId",
      ],
      optional: true,
    },
    managerId: {
      type: "string",
      label: "Manager ID",
      description: "Return only users whose `managerId` matches this Gong user ID (the `id` field of the manager's own user record, e.g. `4011503062935085673`), which is how you list a manager's team. Applied here after fetching, not by the Gong API.",
      propDefinition: [
        app,
        "userId",
      ],
      optional: true,
    },
    createdFromDateTime: {
      type: "string",
      label: "Created From Date Time",
      description: "Return only users created on or after this date and time, in ISO-8601 format (e.g. `2026-01-01T00:00:00Z`).",
      optional: true,
    },
    createdToDateTime: {
      type: "string",
      label: "Created To Date Time",
      description: "Return only users created before this date and time, in ISO-8601 format (e.g. `2026-04-01T00:00:00Z`).",
      optional: true,
    },
    includeAvatars: {
      type: "boolean",
      label: "Include Avatars",
      description: "Whether to include avatars, the synthetic users that represent Gong employees accessing your instance. Off by default because they are rarely what you want.",
      default: false,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of users to return. Min ${constants.MIN_LIMIT}, max ${constants.MAX_LIMIT}.`,
      min: constants.MIN_LIMIT,
      max: constants.MAX_LIMIT,
      default: constants.DEFAULT_LIMIT,
      optional: true,
    },
  },
  async run({ $: step }) {
    const {
      app,
      userIds,
      managerId,
      createdFromDateTime,
      createdToDateTime,
      includeAvatars,
      limit,
    } = this;

    // Gong cannot filter by manager, so that filter runs here. Applying `limit`
    // to the fetched page first would drop reports that live on later pages, so
    // scan up to MAX_LIMIT users and only then trim to `limit` matches.
    const max = managerId
      ? constants.MAX_LIMIT
      : limit;

    const users = await app.paginate({
      resourceFn: (args) => app.listUsersExtensive(args),
      resourceFnArgs: {
        step,
        data: {
          filter: {
            userIds,
            createdFromDateTime,
            createdToDateTime,
            includeAvatars,
          },
        },
      },
      resourceName: "users",
      max,
      cursorIn: "data",
    });

    const results = managerId
      ? users.filter((user) => user.managerId === managerId).slice(0, limit)
      : users;

    step.export("$summary", `Found ${utils.pluralize(results.length, "user")}`);

    return results;
  },
};
