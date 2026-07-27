// x-pd-ai: optimized
import { MEMBERSHIP_ROLE_OPTIONS } from "../../common/constants.mjs";
import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-list-organization-members",
  name: "List Organization Memberships",
  description: "List the members of a Calendly organization via `GET /organization_memberships`, returning each membership's user URI, role, and email. Use this as the companion lookup action for user and organization URIs consumed by other tools. Supports optional `role` and `email` filters plus pagination. [See the documentation](https://developer.calendly.com/api-docs/eaed2e61a6bc3-list-organization-memberships).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    calendly,
    organization: {
      type: "string",
      label: "Organization URI",
      description: "Organization URI to filter memberships by (e.g. `https://api.calendly.com/organizations/AAAAAAAAAAAAAAAA`). Defaults to the authenticated user's organization when omitted.",
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
    const response = await this.calendly._makeRequest({
      path: "/organization_memberships",
      params: {
        organization: this.organization,
        email: this.email,
        role: this.role,
        paginate: this.paginate,
        maxResults: this.maxResults,
      },
    }, $);

    $.export("$summary", `Found ${response.pagination.count} organization membership(s)`);
    return response;
  },
};
