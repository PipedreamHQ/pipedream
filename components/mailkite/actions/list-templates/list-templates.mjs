import mailkite from "../../mailkite.app.mjs";
import { toTemplate } from "../../common/utils.mjs";

export default {
  key: "mailkite-list-templates",
  name: "List Templates",
  description:
    "List the email templates available to **Send Email** — the account's saved `tpl_…` templates plus MailKite's premade `base_…` catalog. Use this to discover a `templateId`. [See the documentation](https://mailkite.dev/docs?utm_source=pipedream&utm_medium=integration&utm_campaign=components).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    mailkite,
    includeBase: {
      type: "boolean",
      label: "Include Base Templates",
      description:
        "Also list MailKite's premade base templates (`base_…`), e.g. `true`. Set `false` to list only the account's saved templates. Defaults to `true`.",
      default: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const saved = await this.mailkite.listTemplates({
      $,
    });
    const base = this.includeBase === false
      ? []
      : await this.mailkite.listBaseTemplates({
        $,
      });

    const templates = [
      ...(saved ?? []),
      ...(base ?? []),
    ].map(toTemplate);

    $.export(
      "$summary",
      `Found ${templates.length} template${templates.length === 1
        ? ""
        : "s"}`,
    );
    return templates;
  },
};
