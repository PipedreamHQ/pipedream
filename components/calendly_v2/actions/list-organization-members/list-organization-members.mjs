// x-pd-ai: optimized
import { MEMBERSHIP_ROLE_OPTIONS } from "../../common/constants.mjs";
import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-list-organization-members",
  name: "List Organization Memberships",
  description: "List the members of a Calendly organization via `GET /organization_memberships`, returning each membership's user URI, role, and email. Use this as the companion lookup action for user and organization URIs consumed by other tools. Supports optional `role` and `email` filters plus pagination. Example: called with no props, returns the authenticated user's memberships such as `{ user: { name: \"Jane Doe\", uri: \"https://api.calendly.com/users/AAAAAAAAAAAAAAAA\" }, organization: \"https://api.calendly.com/organizations/BBBBBBBBBBBBBBBB\", role: \"owner\" }` — pass those URIs as the `user`/`organization` props in other actions. [See the documentation](https://developer.calendly.com/api-docs/eaed2e61a6bc3-list-organization-memberships).",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    calendly,
    organization: {
      propDefinition: [
        calendly,
        "organization",
      ],
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Filter memberships by member email address, e.g. `jane@acme.com`.",
      optional: true,
    },
    role: {
      type: "string",
      label: "Role",
      description: `Filter memberships by role. One of: ${MEMBERSHIP_ROLE_OPTIONS.map((r) => `\`${r}\``).join(", ")}.`,
      optional: true,
      options: MEMBERSHIP_ROLE_OPTIONS,
    },
    paginate: {
      propDefinition: [
        calendly,
        "paginate",
      ],
    },
    maxResults: {
      propDefinition: [
        calendly,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.calendly.listOrganizationMembers({
      organization: this.organization,
      email: this.email,
      role: this.role,
      paginate: this.paginate,
      maxResults: this.maxResults,
    }, $);

    $.export("$summary", `Found ${response.pagination.count} organization membership(s)`);
    return response;
  },
};
