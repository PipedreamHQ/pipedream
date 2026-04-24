import gmail from "../../gmail.app.mjs";
import labelColors from "../../common/label-colors.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "gmail-create-label",
  name: "Create Label",
  description:
    "Create a new user label in the authenticated Gmail mailbox and return its ID."
    + " Call this before **Modify Labels** whenever the label the user wants to apply doesn't yet exist — **List Labels** will tell you what's already there."
    + " Idempotent: if a label with the same name already exists, the action swallows the 409, looks it up by name, and returns the existing label with `alreadyExisted: true` so the caller can proceed."
    + " Nested labels are expressed with `/` — e.g. `Clients/Acme` creates or targets a sub-label under `Clients`."
    + " `color` is optional; when provided, both `textColor` and `backgroundColor` must be supplied together and must come from Gmail's fixed palette."
    + " [See the documentation](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/create).",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gmail,
    name: {
      type: "string",
      label: "Name",
      description:
        "The display name of the label. Use `/` to create a nested label (e.g. `Clients/Acme`). Must be unique within the mailbox.",
    },
    labelListVisibility: {
      type: "string",
      label: "Label List Visibility",
      description: "Visibility of the label in the sidebar. Defaults to `labelShow`.",
      options: [
        "labelShow",
        "labelShowIfUnread",
        "labelHide",
      ],
      optional: true,
      default: "labelShow",
    },
    messageListVisibility: {
      type: "string",
      label: "Message List Visibility",
      description: "Whether messages with this label show the label chip in the list view. Defaults to `show`.",
      options: [
        "show",
        "hide",
      ],
      optional: true,
      default: "show",
    },
    textColor: {
      type: "string",
      label: "Text Color",
      description:
        "Optional text color (must come from Gmail's fixed palette)."
        + " If set, `backgroundColor` must also be set.",
      options: labelColors,
      optional: true,
    },
    backgroundColor: {
      type: "string",
      label: "Background Color",
      description:
        "Optional background color (must come from Gmail's fixed palette)."
        + " If set, `textColor` must also be set.",
      options: labelColors,
      optional: true,
    },
  },
  async run({ $ }) {
    const hasText = Boolean(this.textColor);
    const hasBg = Boolean(this.backgroundColor);
    if (hasText !== hasBg) {
      throw new Error("`textColor` and `backgroundColor` must be provided together (or both omitted).");
    }

    const requestBody = {
      name: this.name,
      labelListVisibility: this.labelListVisibility || "labelShow",
      messageListVisibility: this.messageListVisibility || "show",
    };
    if (hasText && hasBg) {
      requestBody.color = {
        textColor: this.textColor,
        backgroundColor: this.backgroundColor,
      };
    }

    try {
      const response = await this.gmail._client().users.labels.create({
        userId: constants.USER_ID,
        requestBody,
      });
      $.export("$summary", `Created label "${response.data.name}" (${response.data.id})`);
      return {
        ...response.data,
        alreadyExisted: false,
      };
    } catch (err) {
      const status = err.code ?? err.status ?? err.response?.status;
      const message = err.message ?? err.response?.data?.error?.message ?? "";
      const alreadyExists = status === 409 || /already exists/i.test(message);
      if (!alreadyExists) {
        throw err;
      }

      const { labels = [] } = await this.gmail.listLabels();
      const existing = labels.find((l) => l.name === this.name);
      if (!existing) {
        // Shouldn't happen — the API said it exists but we can't find it.
        throw err;
      }
      $.export("$summary", `Label "${existing.name}" already existed (${existing.id})`);
      return {
        ...existing,
        alreadyExisted: true,
      };
    }
  },
};
