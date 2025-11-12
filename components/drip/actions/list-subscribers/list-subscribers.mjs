import drip from "../../drip.app.mjs";

export default {
  key: "drip-list-subscribers",
  name: "List Subscribers",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "List all subscribers. [See the docs here](https://developer.drip.com/#list-all-subscribers)",
  type: "action",
  props: {
    drip,
    status: {
      type: "string",
      label: "Status",
      description: "Filter by status. Defaults to active.",
      optional: true,
      options: [
        "all",
        "active",
        "unsubscribed",
        "active_or_unsubscribed",
        "undeliverable",
      ],
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A list of tags.",
      optional: true,
      async options({ page }) {
        const { tags } = await this.drip.listTags({
          params: {
            page,
          },
        });

        return tags;
      },
    },
    subscribedBefore: {
      type: "string",
      label: "Subscribed Before",
      description: "A *ISO-8601* datetime. When included, returns only subscribers who were created before the date. Eg. `2017-01-01T00:00:00Z`",
      optional: true,
    },
    subscribedAfter: {
      type: "string",
      label: "Subscribed After",
      description: "A *ISO-8601* datetime. When included, returns only subscribers who were created after the date. Eg. `2017-01-01T00:00:00Z`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      status,
      tags,
      subscribedBefore,
      subscribedAfter,
    } = this;

    const response = await this.drip.listSubscribers({
      $,
      params: {
        status,
        tags: tags?.toString(),
        subscribed_before: subscribedBefore,
        subscribed_after: subscribedAfter,
      },
    });

    $.export("$summary", "Subscribers Successfully fetched");
    return response;
  },
};
