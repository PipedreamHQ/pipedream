import { ConfigurationError } from "@pipedream/platform";
import utils from "./utils.mjs";

// Who sends the signers their links: DocSpring emails them (the API's default,
// `send_email: true`), or you send the links yourself (`send_email: false`). Create
// Signature Request and Check Data both offer it, so a check covers what the create sends.

const SEND_EMAIL_OPTIONS = [
  {
    label: "DocSpring emails each signer their link",
    value: "docspring",
  },
  {
    label: "I send the links, or open them in my app",
    value: "self",
  },
];

const sendEmailProp = {
  type: "string",
  label: "Emails to Signers",
  description: "`docspring` (the default): DocSpring emails each signer a link to sign, any reminders, and the signed PDF once everyone has signed."
    + " Each signer then needs an email address and the `email_link` authentication. A test submission can only email members of your DocSpring team: other addresses are refused."
    + " `self`: you send the links, or people sign in your app."
    + " DocSpring doesn't email the signers of a form library template: choose `self` for one. e.g. `docspring`.",
  options: SEND_EMAIL_OPTIONS,
  default: "docspring",
  optional: true,
  reloadProps: true,
};

const signingOrderProp = {
  type: "string",
  label: "Signing Order",
  description: "`parallel` (the default): everyone can sign at once. `sequential`: people sign one step at a time, in the order of their **Signing Step**, or of the signers."
    + " DocSpring emails each step when the one before it is done. When you send the links, send each step's once the step before it has signed,"
    + " and make a new one with **Create Signing Link** if it has expired (email links last 7 days, API links 24 hours). e.g. `sequential`.",
  options: [
    {
      label: "Everyone at once",
      value: "parallel",
    },
    {
      label: "One step at a time",
      value: "sequential",
    },
  ],
  optional: true,
};

// DocSpring's variables for the subject and message. Pipedream reads `{{ }}` in a prop as
// its own expression, so these props take `[[ signer.name ]]` (spaces optional) and send
// DocSpring `{{ signer.name }}`. Only DocSpring's five variables: other `[[ ]]` text goes
// as typed.
const EMAIL_VARIABLES = [
  "signer.name",
  "signer.email",
  "document.name",
  "sender.name",
  "account.name",
];
const BRACKET_VARIABLE = new RegExp(
  `\\[\\[\\s*(${EMAIL_VARIABLES.map((v) => v.replace(".", "\\.")).join("|")})\\s*\\]\\]`,
  "g",
);

const VARIABLES_HELP = " To add the signer's name or other details, type `[[ signer.name ]]`, `[[ signer.email ]]`,"
  + " `[[ document.name ]]`, `[[ sender.name ]]` or `[[ account.name ]]`."
  + " Use square brackets: Pipedream reads `{{ }}` as its own expression.";

/**
 * DocSpring's email options, shown when it emails the signers: the API refuses them when it
 * emails nobody.
 * @returns {object}
 */
const emailOptionProps = () => ({
  emailSubject: {
    type: "string",
    label: "Email Subject",
    description: "The subject of the emails that ask people to sign, e.g. `Please sign the lease, [[ signer.name ]]`."
      + " Leave blank for `[[ sender.name ]] sent you [[ document.name ]] to sign`."
      + VARIABLES_HELP,
    optional: true,
  },
  emailMessage: {
    type: "string",
    label: "Message",
    description: "A message for the signers, shown above the signing button, e.g. `Please sign by Friday.` Links and web addresses are shown as plain text."
      + VARIABLES_HELP,
    optional: true,
  },
  cc: {
    type: "string[]",
    label: "CC",
    description: "Up to 10 people who get the signed PDF, e.g. `records@example.com`. They don't sign.",
    optional: true,
  },
  reminderIntervalDays: {
    type: "integer",
    label: "Days Between Reminders",
    description: "Remind people who haven't signed, every 1 to 30 days, e.g. `3`. Set **Most Reminders per Person** too, or leave both blank for no reminders.",
    min: 1,
    max: 30,
    optional: true,
  },
  reminderMaxCount: {
    type: "integer",
    label: "Most Reminders per Person",
    description: "From 1 to 10, e.g. `2`.",
    min: 1,
    max: 10,
    optional: true,
  },
  replyTo: {
    type: "string",
    label: "Reply-To Address",
    description: "Where replies to the emails go: a member of your DocSpring team, or an address at one of your verified email domains, e.g. `legal@example.com`."
      + " Leave blank for the template's reply-to address (the account owner when it has none).",
    optional: true,
  },
  notificationEmails: {
    type: "string[]",
    label: "Notification Emails",
    description: "Up to 10 addresses that DocSpring tells when the document is completed or declined, or an email bounces or can't be sent:"
      + " members of your DocSpring team or addresses at your verified email domains, e.g. `ops@example.com`."
      + " Leave blank for the template's notification addresses (the account owner when it has none).",
    optional: true,
  },
  notifyWhenSigned: {
    type: "boolean",
    label: "Notify When Each Person Signs",
    description: "`true` also emails the notification addresses each time someone signs, e.g. `true`.",
    optional: true,
  },
});

/**
 * A text input, trimmed. Blank gives `undefined`.
 * @param {*} value
 * @returns {string|undefined}
 */
const text = (value) => (utils.isBlank(value)
  ? undefined
  : String(value).trim());

/**
 * A subject or message for DocSpring: trimmed, with `[[ variable ]]` as `{{ variable }}`.
 * Blank gives `undefined`.
 * @param {*} value
 * @returns {string|undefined}
 */
const withEmailVariables = (value) => text(value)?.replace(BRACKET_VARIABLE, "{{ $1 }}");

/**
 * `docspring` or `self`. Blank is DocSpring's emails, as in the API.
 * @param {*} value
 * @returns {string}
 */
const emailMode = (value) => {
  const mode = text(value) || "docspring";
  if (!SEND_EMAIL_OPTIONS.some((option) => option.value === mode)) {
    throw new ConfigurationError(`**Emails to Signers** must be \`docspring\` or \`self\`, not \`${mode}\``);
  }
  return mode;
};

/**
 * The mode for choosing which props to show. A value `emailMode` refuses (such as an
 * expression that isn't evaluated yet) shows DocSpring's options: `run` reports the error.
 * @param {*} value
 * @returns {string}
 */
const propsEmailMode = (value) => {
  try {
    return emailMode(value);
  } catch {
    return "docspring";
  }
};

/**
 * A list of email addresses, each once: the API refuses a list with repeats.
 * @param {*} value
 * @returns {string[]|undefined}
 */
const addresses = (value) => {
  const list = utils.parseStringArray(value);
  return list && [
    ...new Set(list),
  ];
};

/**
 * The submission's email settings for the request body: `send_email`, the signing order
 * and, only when DocSpring emails the signers, the email options that have a value (the
 * API refuses blank ones).
 * @param {object} component - the action, with its prop values
 * @returns {object}
 */
const emailSettings = (component) => {
  const mode = emailMode(component.sendEmail);
  const settings = {
    send_email: mode === "docspring",
    signing_order: text(component.signingOrder),
  };
  if (mode === "self") {
    return utils.compact(settings);
  }
  const intervalDays = utils.toInteger(component.reminderIntervalDays, "Days Between Reminders");
  const maxCount = utils.toInteger(component.reminderMaxCount, "Most Reminders per Person");
  return utils.compact({
    ...settings,
    email_subject: withEmailVariables(component.emailSubject),
    email_message: withEmailVariables(component.emailMessage),
    cc: addresses(component.cc),
    // The API needs both: one alone gets its 422, which names the other.
    reminders: intervalDays === undefined && maxCount === undefined
      ? undefined
      : utils.compact({
        interval_days: intervalDays,
        max_count: maxCount,
      }),
    reply_to: text(component.replyTo),
    notification_emails: addresses(component.notificationEmails),
    notify_when_signed: utils.toBoolean(component.notifyWhenSigned, "Notify When Each Person Signs"),
  });
};

export default {
  SEND_EMAIL_OPTIONS,
  sendEmailProp,
  signingOrderProp,
  emailOptionProps,
  emailMode,
  propsEmailMode,
  emailSettings,
  text,
  withEmailVariables,
  EMAIL_VARIABLES,
};
