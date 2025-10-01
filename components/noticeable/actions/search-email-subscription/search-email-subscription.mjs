import app from "../../noticeable.app.mjs";
import { getEmailSubscriptionsQuery } from "../../common/queries.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "noticeable-search-email-subscription",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Search Email Subscriptions",
  description: "Searches email subscriptions for the given options. If no options given, retrieves all subscriptions, [See the docs](https://graphdoc.noticeable.io/emailsubscription.doc.html)",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email",
      optional: true,
    },
    isArchived: {
      type: "boolean",
      label: "Is Archived",
      description: "Is archived",
      optional: true,
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
      optional: true,
    },
  },
  async run ({ $ }) {
    const emailSubscriptions = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.sendQuery,
      queryFn: getEmailSubscriptionsQuery,
      queryArgs: {
        projectId: this.projectId,
        isArchived: this.isArchived,
        status: this.status,
      },
      cursorKey: "data.project.data.pageInfo.startCursor",
      resourceKey: "data.project.data.edges",
      extended: true,
    });
    for await (const item of resourcesStream) {
      if (item.node && (
        !this.email ||
        (this.email && this.email == item.node?.email)
      )) {
        emailSubscriptions.push(item.node);
      }
    }
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${emailSubscriptions.length} subscription${emailSubscriptions.length == 1 ? "" : "s"} has been found.`);
    return emailSubscriptions;
  },
};
