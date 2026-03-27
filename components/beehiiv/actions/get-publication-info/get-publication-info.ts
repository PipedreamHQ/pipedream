// vandelay-test-dr
import app from "../../app/beehiiv.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  key: "beehiiv-get-publication-info",
  name: "Get Publication Info",
  description:
    "Get details about the current beehiiv publication, including"
    + " name, URL, and subscriber stats."
    + " **Call this first** to get the `publicationId` needed by"
    + " all other tools."
    + " If you have multiple publications, pass the `publicationId`"
    + " — otherwise the first publication is returned."
    + " Returns the publication name, description, URL, creation"
    + " date, and subscriber count."
    + " [See the documentation]"
    + "(https://developers.beehiiv.com/api-reference/"
    + "publications/index)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    app,
    publicationId: {
      type: "string",
      label: "Publication ID",
      description:
        "The publication ID. Leave empty to return the first"
        + " (or only) publication in the account.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      path: "/publications",
      params: {
        expand: [
          "stat_active_subscriptions",
        ],
      },
    });

    const publications = response.data || [];
    const pub = this.publicationId
      ? publications.find((p) => p.id === this.publicationId)
        || publications[0]
      : publications[0];

    if (!pub) {
      throw new Error("No publications found for this account.");
    }

    const result = {
      publicationId: pub.id,
      name: pub.name,
      description: pub.description,
      url: pub.url,
      createdAt: pub.created_at,
      activeSubscriptions: pub.stat_active_subscriptions,
    };

    $.export(
      "$summary",
      `Publication: ${result.name} (ID: ${result.publicationId})`,
    );

    return result;
  },
});
