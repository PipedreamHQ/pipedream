// x-pd-ai: optimized
import elasticSecurity from "../../elastic_security.app.mjs";

export default {
  key: "elastic_security-find-assignable-users",
  name: "Find Assignable Users",
  description: "List users who have created or reported Elastic Security cases, via GET /api/cases/reporters, to discover valid `profile_uid` values for the `assignees` parameter on **Create or Update Case**."
    + " Kibana has no public endpoint for listing every org user or for listing who is eligible for assignment — this endpoint only covers people who have reported at least one case, which is a subset of valid assignees, not the full set."
    + " If the person you need doesn't appear here (e.g. they've never reported a case), ask the user for their `profile_uid` directly instead of guessing."
    + " Example: calling with no parameters returns `[{ username: \"jsmith\", full_name: \"Jane Smith\", email: \"jane@example.com\", profile_uid: \"u_abc123_cloud\" }]`; pass that `profile_uid` as an entry in **Create or Update Case**'s `assignees` array."
    + " [See the documentation](https://www.elastic.co/docs/api/doc/kibana/operation/operation-getcasereportersdefaultspace)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    elasticSecurity,
  },
  async run({ $ }) {
    const reporters = await this.elasticSecurity.listCaseReporters({
      $,
    });
    $.export("$summary", `Found ${reporters.length} user(s) with case history`);
    return reporters;
  },
};
