import notion from "../../notion.app.mjs";

export default {
  key: "notion-get-current-user",
  name: "Get Current User",
  description: "Retrieve the Notion identity tied to the current OAuth token, returning the full `users.retrieve` payload for `me` (person or bot). Includes the user ID, name, avatar URL, type (`person` vs `bot`), and workspace ownership metadata—useful for confirming which workspace is connected, adapting downstream queries, or giving an LLM the context it needs about who is operating inside Notion. Uses OAuth authentication. [See the documentation](https://developers.notion.com/reference/get-user).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    notion,
  },
  async run({ $ }) {
    const response = await this.notion.getUser("me");

    const displayName = response?.name || response?.bot?.workspace_name || response?.id;
    const ownerUser = response?.bot?.owner?.user;
    const ownerName = ownerUser?.name || ownerUser?.id;
    const ownerEmail = ownerUser?.person?.email;
    const summaryParts = [
      response?.bot?.workspace_name && `workspace **${response.bot.workspace_name}**`,
      (() => {
        if (!ownerName && !ownerEmail) return null;
        if (ownerName && ownerEmail) return `owner ${ownerName} (<${ownerEmail}>)`;
        if (ownerName) return `owner ${ownerName}`;
        return `owner <${ownerEmail}>`;
      })(),
    ].filter(Boolean);

    const summaryContext = summaryParts.length
      ? ` — ${summaryParts.join(", ")}`
      : "";

    $.export("$summary", `Retrieved Notion ${response?.type || "user"} **${displayName}**${summaryContext}`);

    return response;
  },
};
