import { ConfigurationError } from "@pipedream/platform";
import linearApp from "../../linear.app.mjs";

const DEFAULT_CONNECTION_LIMIT = 50;

// The top-level sections of this action's response.
const SECTIONS = [
  "user",
  "organization",
  "teams",
  "teamMemberships",
];

// "Who am I" needs the user and nothing else. Measured on a real workspace, the full
// response ran 43 KB, of which the `user` section was 546 bytes — the nested `teams`
// connection alone was 20 KB. This action is typically the FIRST call an agent makes,
// so that overhead is paid on almost every task before any real work happens.
const COMPACT_SECTIONS = [
  "user",
];

export default {
  key: "linear-get-current-user",
  name: "Get Current User",
  description: "Retrieve rich context about the authenticated Linear user, including core profile fields, recent timestamps, direct team memberships, and high-level organization settings. Returns the user object, a paginated team list (with names, keys, cycle configs, etc.), associated team memberships, and organization metadata such as auth defaults and SCIM/SAML flags. Use this when your workflow or agent needs to understand who is currently authenticated, which teams they belong to, or what workspace policies might influence subsequent Linear actions. **Response size matters here:** the full response runs ~43 KB, almost all of it the nested `teams` and `teamMemberships` connections — if you only need to know who is authenticated (for example to filter issues by assignee), pass `sections: \"compact\"` to get just the user object, which is a few hundred bytes. See Linear's GraphQL viewer docs [here](https://linear.app/developers/graphql).",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
    sections: {
      type: "string",
      label: "Sections",
      description: `Which parts of the response to return, as a comma-separated list of \`${SECTIONS.join("`, `")}\`. Shorthand: \`compact\` returns just \`user\`, which is all you need to answer "who am I" or to get the user id for filtering issues by assignee. The \`teams\` and \`teamMemberships\` connections are by far the largest parts of the response — request them only when you actually need the user's team list (note that **Get Teams** lists workspace teams more directly). **Leave blank to return all four sections** (the default, and the largest possible response).`,
      optional: true,
    },
  },
  methods: {
    /** The requested sections, or undefined when blank (blank = return everything). */
    requestedSections() {
      const raw = this.sections?.trim();
      if (!raw) {
        return undefined;
      }
      if (raw.toLowerCase() === "compact") {
        return COMPACT_SECTIONS;
      }
      const requested = raw
        .split(",")
        .map((section) => section.trim())
        .filter(Boolean);
      const unknown = requested.filter((section) => !SECTIONS.includes(section));
      if (unknown.length) {
        throw new ConfigurationError(`Unknown value(s) in Sections: ${unknown.join(", ")}. Use \`compact\`, or a comma-separated subset of: ${SECTIONS.join(", ")}. Leave Sections blank to return all of them.`);
      }
      return requested;
    },
  },
  async run({ $ }) {
    const client = this.linearApp.client();
    const viewer = await client.viewer;
    const sections = this.requestedSections();
    const wants = (section) => !sections || sections.includes(section);

    // Only fetch what was asked for. Unlike the list actions — where the payload is
    // already in hand and projection is the only lever — each section here is its own
    // round trip, so skipping one saves the request as well as the bytes.
    const [
      organization,
      teamsConnection,
      teamMembershipsConnection,
    ] = await Promise.all([
      wants("organization")
        ? viewer.organization
        : undefined,
      wants("teams")
        ? viewer.teams({
          first: DEFAULT_CONNECTION_LIMIT,
        })
        : undefined,
      wants("teamMemberships")
        ? viewer.teamMemberships({
          first: DEFAULT_CONNECTION_LIMIT,
        })
        : undefined,
    ]);

    const summaryIdentifier = viewer.name || viewer.displayName || viewer.email || viewer.id;
    $.export("$summary", `Retrieved Linear user ${summaryIdentifier}`);

    // Keys are omitted rather than set to undefined so a trimmed response doesn't carry
    // empty placeholders; with Sections blank this is byte-identical to previous versions.
    return {
      ...(wants("user") && {
        user: viewer,
      }),
      ...(wants("organization") && {
        organization,
      }),
      ...(wants("teams") && {
        teams: teamsConnection,
      }),
      ...(wants("teamMemberships") && {
        teamMemberships: teamMembershipsConnection,
      }),
    };
  },
};
