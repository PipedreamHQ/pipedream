import contentstack from "../../contentstack.app.mjs";
import { parseArray } from "../../common/utils.mjs";

export default {
  key: "contentstack-publish-entry",
  name: "Publish Entry",
  description: "Publishes a specific entry using its UID. [See the documentation](https://www.contentstack.com/docs/developers/apis/content-management-api#publish-entry)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    contentstack,
    contentType: {
      propDefinition: [
        contentstack,
        "contentType",
      ],
    },
    entryId: {
      propDefinition: [
        contentstack,
        "entryId",
        (c) => ({
          contentType: c.contentType,
        }),
      ],
    },
    environments: {
      propDefinition: [
        contentstack,
        "environments",
      ],
    },
    locales: {
      propDefinition: [
        contentstack,
        "locale",
      ],
      type: "string[]",
      label: "Locale",
      description: "The code of the language in which you want your entry to be localized in",
    },
    scheduledAt: {
      type: "string",
      label: "Scheduled At",
      description: "The date/time in the ISO format to publish the entry. Example: `2016-10-07T12:34:36.000Z`",
      optional: true,
    },
  },
  async run({ $ }) {
    const { entry } = await this.contentstack.getEntry({
      $,
      contentType: this.contentType,
      entryId: this.entryId,
    });

    const response = await this.contentstack.publishEntry({
      $,
      contentType: this.contentType,
      entryId: this.entryId,
      data: {
        entry: {
          environments: parseArray(this.environments),
          locales: parseArray(this.locales),
        },
        locale: entry.locale,
        version: entry._version,
        scheduled_at: this.scheduledAt,
      },
    });
    $.export("$summary", `Successfully published entry with UID ${this.entryId}`);
    return response;
  },
};
