import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import launchnotes from "../../launchnotes.app.mjs";

export default {
  key: "launchnotes-create-announcement",
  name: "Create Announcement",
  description: "Generates a draft announcement for the LaunchNotes project. [See the documentation](https://developer.launchnotes.com/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    launchnotes,
    clientMutationId: {
      propDefinition: [
        launchnotes,
        "clientMutationId",
      ],
      optional: true,
    },
    projectId: {
      propDefinition: [
        launchnotes,
        "projectId",
      ],
    },
    headline: {
      type: "string",
      label: "Headline",
      description: "The announcement title.",
      optional: true,
    },
    contentMarkdown: {
      type: "string",
      label: "Content Markdown",
      description: "The Announcement content. Markdown formatting is supported.",
      optional: true,
    },
    shouldNotifyPageSubscribers: {
      type: "boolean",
      label: "Should Notify Page Subscribers",
      description: "Whether the subscribers will be notified or not.",
      optional: true,
    },
    categories: {
      propDefinition: [
        launchnotes,
        "categories",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    templateId: {
      propDefinition: [
        launchnotes,
        "templateId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      data, errors: responseErrors,
    } = await this.launchnotes.createAnnouncement({
      $,
      variables: {
        input: {
          clientMutationId: this.clientMutationId,
          announcement: {
            projectId: this.projectId,
            headline: this.headline,
            contentMarkdown: this.contentMarkdown,
            shouldNotifyPageSubscribers: this.shouldNotifyPageSubscribers,
            categories: parseObject(this.categories)?.map((item) => ({
              id: item,
            })),
            templateId: this.templateId,
          },
        },
      },
    });

    const errors = responseErrors || data.createAnnouncement.errors;

    if (errors.length) {
      throw new ConfigurationError(JSON.stringify(errors[0]));
    }

    $.export("$summary", `Successfully created draft announcement with Id: ${data.createAnnouncement.announcement.id}`);
    return data;
  },
};
