import fireflies from "../../fireflies.app.mjs";
import queries from "../../common/queries.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "fireflies-list-clips",
  name: "List Clips",
  description: "List meeting clips (Fireflies \"bites\"). The API requires at least one filter, so **set at least one of `Meeting ID`, `Mine Only`, or `My Team Only`** — `Mine Only` defaults to `true`, which lists the clips created by the connected account. Use this to look up a clip's `id` for **Find Clip by ID**, or to check which clips already exist for a meeting before creating another with **Create Meeting Clip**. Each result includes the clip's render `status` and, once that status is `ready`, its media URLs in `sources[].src`. [See the documentation](https://docs.fireflies.ai/graphql-api/query/bites)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    fireflies,
    meetingId: {
      propDefinition: [
        fireflies,
        "meetingId",
      ],
      description: "Only return clips taken from this meeting. Use **Find Meeting by ID** or **Find Recent Meeting** to look up a meeting ID. Omit to list clips across all meetings, in which case `Mine Only` or `My Team Only` must be set.",
      optional: true,
    },
    mine: {
      type: "boolean",
      label: "Mine Only",
      description: "Only return clips created by the connected account. Defaults to `true`; set to `false` when filtering by `Meeting ID` or `My Team Only` instead.",
      optional: true,
      default: true,
    },
    myTeam: {
      type: "boolean",
      label: "My Team Only",
      description: "Only return clips created by members of your Fireflies team.",
      optional: true,
    },
    page: {
      propDefinition: [
        fireflies,
        "page",
      ],
    },
  },
  async run({ $ }) {
    if (!this.meetingId && !this.mine && !this.myTeam) {
      throw new ConfigurationError("Set at least one of Meeting ID, Mine Only, or My Team Only — the Fireflies API rejects a `bites` query with no filter.");
    }

    const limit = constants.DEFAULT_LIMIT;

    const { data: { bites } } = await this.fireflies.query({
      $,
      data: {
        query: queries.bites,
        variables: {
          transcriptId: this.meetingId,
          // A literal `false` counts as "not provided" server-side and trips the
          // API's "must provide one of" check, so only send these when truthy.
          mine: this.mine || undefined,
          myTeam: this.myTeam || undefined,
          limit,
          skip: this.page * limit,
        },
      },
    });

    $.export("$summary", `Found ${bites?.length || 0} clip(s)`);
    return bites;
  },
};
