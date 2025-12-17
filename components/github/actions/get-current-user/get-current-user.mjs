import github from "../../github.app.mjs";

const DEFAULT_ORGS_LIMIT = 20;
const DEFAULT_TEAMS_LIMIT = 20;

export default {
  key: "github-get-current-user",
  name: "Get Current User",
  description: "Gather a full snapshot of the authenticated GitHub actor, combining `/user`, `/user/orgs`, and `/user/teams`. Returns profile metadata (login, name, email, company, plan, creation timestamps) and trimmed lists of organizations and teams for quick role awareness. Helpful when you need to validate which user is calling the API, adapt behavior based on their org/team memberships, or provide LLMs with grounding before repository operations. [See the documentation](https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user).",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    github,
  },
  async run({ $ }) {
    const [
      user,
      organizations,
      teams,
    ] = await Promise.all([
      this.github.getAuthenticatedUser(),
      this.github.getOrganizations()
        .then((orgs) => orgs.slice(0, DEFAULT_ORGS_LIMIT)),
      this.github.getTeams()
        .then((teamsResponse) => teamsResponse.slice(0, DEFAULT_TEAMS_LIMIT)),
    ]);

    $.export("$summary", `Retrieved GitHub user ${user.login}`);

    return {
      user,
      organizations,
      teams,
    };
  },
};
