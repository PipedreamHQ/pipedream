import http from "../../http.app.mjs";

export default {
  name: "Validate Webhook Auth",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "http-validate-webhook-auth",
  description: "Require authorization for incoming HTTP webhook requests. Make sure to configure the HTTP trigger to \"Return a custom response from your workflow\".",
  type: "action",
  props: {
    http,
    authInput: {
      type: "string",
      label: "Authorization Value to Authenticate",
      description: "Select the location of the authorization value to check. For example, if you're looking for a Bearer token on the inbound webhook request, set this to `{{steps.trigger.event.body.headers.authorization}}`.",
      default: "{{steps.trigger.event.headers.authorization}}",
    },
    customResponse: {
      type: "boolean",
      label: "Return Error to Webhook Caller",
      description: "If `True`, returns a `401: Invalid credentials` error in the case of invalid authorization. **Make sure to configure the HTTP trigger to \"Return a custom response from your workflow\"**. If `False`, does not return a custom response in the case of invalid auth.",
      default: true,
    },
    authType: {
      type: "string",
      label: "Authorization Type",
      description: "Select the Authorization Type for the incoming webhook.",
      reloadProps: true,
      options: [
        {
          label: "Basic Auth",
          value: "basic",
        },
        {
          label: "Bearer Auth",
          value: "bearer",
        },
        {
          label: "Key-Based Auth",
          value: "key",
        },
      ],
    },
  },
  async additionalProps() {
    const props = {};
    switch (this.authType) {
    case "basic":
      props.basicAuthUsername = {
        type: "string",
        label: "Username",
        description: "Enter your username or reference an environment variable. For example, `{{process.env.username}}`.",
      };
      props.basicAuthPassword = {
        type: "string",
        label: "Password",
        description: "Enter your password or reference an environment variable. For example, `{{process.env.password}}`.",
        secret: true,
      };
      break;
    case "bearer":
      props.bearer = {
        type: "string",
        label: "Bearer Token",
        description: "Enter your Bearer Token  or reference an environment variable. For example, `{{process.env.token}}`. **Make sure to include any prepended values**, like `Bearer` for example.",
      };
      break;
    case "key":
      props.key = {
        type: "string",
        label: "API Key",
        description: "Enter your API Key or reference an environment variable. For example, `{{process.env.api_key}}`.",
        secret: true,
      };
      break;
    default:
    }
    return props;
  },
  async run({ $ }) {
    const authType = this.authType;
    const authInput = this.authInput;
    let basicString = "";
    if (authType === "basic") {
      const un = this.basicAuthUsername;
      const pw = this.basicAuthPassword;
      const str = `${un}:${pw}`;
      const buff = Buffer.from(str, "utf-8");
      basicString = `Basic ${buff.toString("base64")}`;
    }
    const authValue = this.bearer ?? this.key ?? basicString;
    if (authInput !== authValue) {
      if (this.customResponse) {
        await $.respond({
          status: 401,
          headers: {},
          body: "Invalid credentials",
        });
      }
      if ($.flow) {
        return $.flow.exit("Invalid credentials");
      } else {
        throw new Error("Invalid credentials");
      }
    }
    $.export("$summary", "HTTP request successfully authenticated");
  },
};
