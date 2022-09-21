export default {
  type: "app",
  app: "email",
  propDefinitions: {
    subject: {
      type: "string",
      label: "Subject",
      description: "Specify a subject for the email.",
    },
    body: {
      type: "any",
      label: "Email Body",
      description: "Include an email body as either plain text or HTML. If HTML, make sure to set the \"Body Type\" prop to `HTML`.",
    },
    bodyType: {
      type: "string",
      label: "Body Type",
      description: "Choose to send as plain text or HTML. Defaults to `plaintext`.",
      optional: true,
      default: "plaintext",
      options: [
        {
          label: "Plain text",
          value: "plaintext"
        },
        {
          label: "HTML",
          value: "html"
        }
      ],
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
