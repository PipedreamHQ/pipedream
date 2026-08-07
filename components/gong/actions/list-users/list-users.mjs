// x-pd-ai: optimized
import app from "../../gong.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "gong-list-users",
  name: "List Users",
  description: `List the Gong users in your company and return an array of user objects. Gong cannot search users by name or email, so to resolve a rep to their user ID, list users and match the returned \`firstName\`/\`lastName\`/\`emailAddress\` fields yourself; that ID is what **Search Calls** needs for **Primary User IDs**. Pass a single value in **User IDs** to fetch one known user. Gong has no teams endpoint: set **Manager ID** to list that manager's direct reports, filtered here rather than by the API. Returns at most **Limit** users. [See the documentation](${constants.DOCS_URL}#post-/v2/users/extensive)`,
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
      propDefinition: [
        app,
        "limit",
      ],
      description: `Maximum number of users to return. Min ${constants.MIN_LIMIT}, max ${constants.MAX_LIMIT}.`,
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

    // Gong cannot filter by manager, so that filter runs here. Capping the
    // fetch first and filtering afterwards would silently drop reports that sit
    // on later pages, so walk the cursor and count only matches, stopping as
    // soon as `limit` of them are found or Gong runs out of users.
    const stream = app.getResourcesStream({
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
      max: Number.MAX_SAFE_INTEGER,
      cursorIn: "data",
    });

    const results = [];
    let scanned = 0;

    for await (const user of stream) {
      scanned += 1;

      if (managerId && user.managerId !== managerId) {
        continue;
      }

      results.push(user);

      if (results.length >= limit) {
        break;
      }
    }

    step.export("$summary", managerId
      ? `Found ${utils.pluralize(results.length, "user")} reporting to manager \`${managerId}\` (scanned ${utils.pluralize(scanned, "user")})`
      : `Found ${utils.pluralize(results.length, "user")}`);

    return results;
  },
};
