import app from "../../sentry.app.mjs";
import options from  "../../options.mjs";

export default {
  key: "sentry-update-issue",
  version: "0.1.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Update Issue.",
  description: "Updates an individual issue's attributes. Only the attributes submitted are modified.[See the docs here](https://docs.sentry.io/api/events/update-an-issue/)",
  props: {
    app,
    organizationSlug: {
      propDefinition: [
        app,
        "organizationSlug",
      ],
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    issueId: {
      propDefinition: [
        app,
        "issueId",
        (context) => ({
          organizationSlug: context.organizationSlug,
          projectId: context.projectId,
        }),
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "The new status for the issue.",
      options: options.STATUS_OPTIONS,
      optional: true,
    },
    assignedTo: {
      propDefinition: [
        app,
        "userId",
        ({ organizationSlug }) => ({
          organizationSlug,
        }),
      ],
      label: "Assigned To",
      description: "The actor id (or username) of the user or team that should be assigned to this issue.",
    },
    hasSeen: {
      type: "boolean",
      label: "Has Seen",
      description: "In case this API call is invoked with a user context this allows changing of the flag that indicates if the user has seen the event.",
      optional: true,
    },
    isBookmarked: {
      type: "boolean",
      label: "Is Bookmarked",
      description: "In case this API call is invoked with a user context this allows changing of the bookmark flag.",
      optional: true,
    },
    isPublic: {
      type: "boolean",
      label: "Is Public",
      description: "Sets the issue to public or private.",
      optional: true,
    },
  },
  async run({ $ }) {
    const body = {
      status: this.status,
      assignedTo: this.assignedTo,
      hasSeen: this.hasSeen,
      isBookmarked: this.isBookmarked,
      isPublic: this.isPublic,
    };
    const res = await this.app.updateIssue(
      this.issueId,
      body,
    );
    $.export("$summary", "Issue successfully updated.");
    return res.data;
  },
};
