import mailkite from "../../mailkite.app.mjs";

/**
 * Normalize a template row into the shape callers and agents work with: the id that
 * `Send Email`'s `Template ID` accepts, a human name, and whether it is a MailKite base
 * template or one the account saved.
 *
 * @param {object} t - A row from `GET /api/templates` or `GET /api/templates/base`.
 * @returns {object} The normalized template.
 */
function toTemplate(t) {
  return {
    id: t.id,
    name: t.name,
    category: t.category || null,
    subject: t.subject || null,
    isBase: Boolean(t.is_base),
    updatedAt: t.updated_at ?? null,
  };
}

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
