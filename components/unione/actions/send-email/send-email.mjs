import {
  GLOBAL_LANGUAGE_OPTIONS,
  SKIP_UNSUBSCRIBE_OPTIONS,
  TEMPLATE_ENGINE_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import app from "../../unione.app.mjs";

export default {
  key: "unione-send-email",
  name: "Send Email",
  description: "Send an email using UniOne. [See the documentation](https://docs.unione.io/en/web-api-ref#email-send)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    recipients: {
      type: "string[]",
      label: "Recipients",
      description: "Array of recipient objects with email, substitutions (merge tags), and metadata. Each recipient can have: email (required), substitutions (object, optional), metadata (object, optional). If provided, this takes precedence over 'To' prop. Example: [{ \"email\": \"recipient@example.com\", \"substitutions\": { \"from_name\": \"John Doe\", \"subject\": \"Hello, {name}!\" }, \"metadata\": { \"company\": \"Example Inc.\" } }]. [See the documentation](https://docs.unione.io/en/web-api-ref#email-send)",
      optional: true,
    },
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
      optional: true,
    },
    skipUnsubscribe: {
      type: "string",
      label: "Skip Unsubscribe",
      description: "Whether to skip or not appending default unsubscribe footer. You should [ask support](https://cp.unione.io/en/support?_gl=1*1afrczd*_ga*MTgyNTM0MDM4OS4xNzYyODkzNzky*_ga_37TV6WM09S*czE3NjI4OTM3OTIkbzEkZzEkdDE3NjI4OTQ1NTAkajQ5JGwwJGg4ODQyOTkzMzQ.) to approve.",
      options: SKIP_UNSUBSCRIBE_OPTIONS,
      optional: true,
    },
    globalLanguage: {
      type: "string",
      label: "Global Language",
      description: "The language of the unsubscribe footer and unsubscribe page.",
      options: GLOBAL_LANGUAGE_OPTIONS,
      optional: true,
    },
    templateEngine: {
      type: "string",
      label: "Template Engine",
      description: "The [template engine](https://docs.unione.io/en/template-engines) for handling the substitutions(merge tags).",
      optional: true,
      options: TEMPLATE_ENGINE_OPTIONS,
    },
    globalSubstitutions: {
      type: "object",
      label: "Global Substitutions",
      description: "Object for passing the substitutions(merge tags) common for all recipients - e.g., company name. If the substitution names are duplicated in recipient 'substitutions', the values of the variables will be taken from the recipient 'substitutions'. Example: { \"body\": { \"html\": \"Hello, {name}!\", \"plaintext\": \"Hello, {name}!\", \"amp\": \"Hello, {name}!\"}, \"subject\": \"Hello, {name}!\", \"from_name\": \"John Doe\", \"options\": { \"unsubscribe_url\": \"https://example.com/unsubscribe\" } }.",
      optional: true,
    },
    globalMetadata: {
      type: "object",
      label: "Global Metadata",
      description: "Object for passing the metadata common for all the recipients, such as 'key': 'value'. Max key quantity: 10. Max key length: 64 symbols. Max value length: 1024 symbols.",
      optional: true,
    },
    body: {
      type: "object",
      label: "Body",
      description: "Contains HTML/plaintext/AMP parts of the email. Either html or plaintext part is required. Example: { \"html\": \"Hello, {name}!\", \"plaintext\": \"Hello, {name}!\", \"amp\": \"Hello, {name}!\" }.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Email subject",
    },
    fromEmail: {
      type: "string",
      label: "From Email",
      description: "Sender's email. Required only if `Template ID` prop is empty.",
      optional: true,
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "Sender's name",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "Reply-to email (in case it's different to sender's email)",
      optional: true,
    },
    replyToName: {
      type: "string",
      label: "Reply To Name",
      description: "Reply-To name (if `Reply To` email is specified and you want to display not only this email but also the name)",
      optional: true,
    },
    trackLinks: {
      type: "boolean",
      label: "Track Links",
      description: "If true, click tracking is on (default). If false, click tracking is off. To use track_links = false, you need to ask UniOne support to enable this feature.",
      optional: true,
    },
    trackRead: {
      type: "boolean",
      label: "Track Read",
      description: "If true, read tracking is on (default). If false, read tracking is off. To use track_read = false, you need to ask support to enable this feature.",
      optional: true,
    },
    bypassGlobal: {
      type: "boolean",
      label: "Bypass Global",
      description: "If true, the global unavailability list will be ignored. Even if the address was found to be unreachable while sending other UniOne users' emails, or its owner has issued complaints, the message will still be sent. The setting may be ignored for certain addresses.",
      optional: true,
    },
    bypassUnavailable: {
      type: "boolean",
      label: "Bypass Unavailable",
      description: "If true, the current list of unsubscribed addresses for this account or project will be ignored. Works only if `Bypass Global` is set to true. The setting is available only for users that have been granted the right to omit the unsubscribe link (to request, please contact [support](https://cp.unione.io/en/support?_gl=1*1msqb8a*_ga*MTgyNTM0MDM4OS4xNzYyODkzNzky*_ga_37TV6WM09S*czE3NjI4OTM3OTIkbzEkZzEkdDE3NjI4OTQ1NTAkajQ5JGg4ODQyOTkzMzQ.)).",
      optional: true,
    },
    bypassUnsubscribed: {
      type: "boolean",
      label: "Bypass Unsubscribed",
      description: "If true, the current list of unsubscribed addresses for this account or project will be ignored. Works only if `Bypass Global` is set to true. The setting is available only for users that have been granted the right to omit the unsubscribe link.",
      optional: true,
    },
    bypassComplained: {
      type: "boolean",
      label: "Bypass Complained",
      description: "If true, the user's or project's complaint list will be ignored. Works only if `Bypass Global` is set to true. The setting is available only for users that have been granted the right to omit the unsubscribe link.",
      optional: true,
    },
    idempotenceKey: {
      type: "string",
      label: "Idempotence Key",
      description: "A string of up to 64 characters containing a unique message key. This can be used to prevent occasional message duplicates. If you send another API request with the same message key within the next minute, it will be declined. We can generate a message key for each letter automatically; to enable this option, please contact our [tech support](https://cp.unione.io/en/support?_gl=1*dahmdm*_ga*MTgyNTM0MDM4OS4xNzYyODkzNzky*_ga_37TV6WM09S*czE3NjI4OTM3OTIkbzEkZzEkdDE3NjI4OTQ1NTAkajQ5JGwwJGg4ODQyOTkzMzQ.).",
      optional: true,
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "Contains email headers, maximum 50. Only headers with “X-” name prefix are accepted, all other are ignored, for example X-UNIONE-Global-Language, X-UNIONE-Template-Engine. Standard headers “To,” “CC,” and “BCC” are passed without the “X-.” Yet, they are processed in a particular way and, as a result, have a number of restrictions. You can find more details about it [here](https://docs.unione.io/cc-and-bcc). If our support have approved omitting standard unsubscription block for you, you can also pass List-Unsubscribe, List-Subscribe, List-Help, List-Owner, List-Archive, In-Reply-To and References headers. Example: { \"X-UNIONE-Global-Language\": \"en\", \"X-UNIONE-Template-Engine\": \"velocity\" }.",
      optional: true,
    },
    sendAt: {
      type: "string",
      label: "Send At",
      description: "Date and time in 'YYYY-MM-DD hh:mm:ss' format in the UTC timezone. Allows schedule sending up to 24 hours in advance.",
      optional: true,
    },
    unsubscribeUrl: {
      type: "string",
      label: "Unsubscribe URL",
      description: "Custom unsubscribe link. Read more [here](https://docs.unione.io/en/unsubscribe-link).",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.templateId && !this.fromEmail) {
      throw new Error("`From Email` is required when `Template ID` prop is not provided");
    }

    const response = await this.app.sendEmail({
      $,
      data: {
        message: {
          recipients: parseObject(this.recipients),
          template_id: this.templateId,
          tags: parseObject(this.tags),
          skip_unsubscribe: this.skipUnsubscribe && parseInt(this.skipUnsubscribe),
          global_language: parseObject(this.globalLanguage),
          template_engine: parseObject(this.templateEngine),
          global_substitutions: parseObject(this.globalSubstitutions),
          global_metadata: parseObject(this.globalMetadata),
          body: this.body && parseObject(this.body),
          subject: this.subject,
          from_email: this.fromEmail,
          from_name: this.fromName,
          reply_to: this.replyTo,
          reply_to_name: this.replyToName,
          track_links: +this.trackLinks,
          track_read: +this.trackRead,
          bypass_global: +this.bypassGlobal,
          bypass_unavailable: +this.bypassUnavailable,
          bypass_unsubscribed: +this.bypassUnsubscribed,
          bypass_complained: +this.bypassComplained,
          idempotence_key: this.idempotenceKey,
          headers: this.headers && parseObject(this.headers),
          options: {
            send_at: this.sendAt,
            unsubscribe_url: this.unsubscribeUrl,
          },
        },
      },
    });

    const recipientEmails = parseObject(this.recipients).map((r) => r.email || r)
      .join(", ");
    if (response.status === "success") {
      $.export("$summary", `Successfully sent email to ${recipientEmails}`);
    } else {
      $.export("$summary", `Email send request completed with status: ${response.status}`);
    }

    return response;
  },
};

