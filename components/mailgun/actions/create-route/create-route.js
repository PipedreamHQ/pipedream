const mailgun = require("../../mailgun.app.js");
const { props, withErrorHandler } = require("../common");

module.exports = {
  key: "mailgun-create-route",
  name: "Mailgun Create Route",
  description: "Create a new route",
  version: "0.0.1",
  type: "action",
  props: {
    mailgun,
    priority: {
      propDefinition: [
        mailgun,
        "priority",
      ],
    },
    description: {
      propDefinition: [
        mailgun,
        "description",
      ],
    },
    match: {
      type: "string",
      label: "Filter On",
      description: "For more information, see the [route filters API documentation]" +
        "(https://documentation.mailgun.com/en/latest/api-routes.html#filters)",
      options: [
        "recipient",
        "header",
        "catch_all"
      ],
    },
    match_expression: {
      type: "string",
      label: "Filter Expression",
      description: "For the `recipient` filter, specify a regex expression like `.*@gmail.com`. " +
        "For the `header` filter, specify a header name followed by a colon followed by a regex, " +
        "like `subject:.*support`. For the `catch_all` filters, leave this blank.",
    },
    action: {
      type: "string",
      label: "Action",
      description: "For more information, see the [route actions API documentation]" +
        "[https://documentation.mailgun.com/en/latest/api-routes.html#actions]",
      options: [
        "forward",
        "store",
        "stop",
      ],
    },
    action_expression: {
      type: "string",
      label: "Action Expression",
      description: "For the `forward` action, specify a destination email address or URL. " +
        "For the `store` action, (optionally) specify a webhook URL to notify. " +
        "For the `stop` action, leave this blank.",
    },
    ...props,
  },
  methods: {
    _expression (filter, expression) {
      switch (filter) {
        case "catch_all":
          return "catch_all()";
        case "recipient":
          return `match_recipient("${expression}")`;
        case "header":
          let [header, header_expression] = expression.split(":");
          if (Array.isArray(header_expression)) {
            header_expression = header_expression.join(":");
          }
          return `match_header("${header}", "${header_expression}")`;
        default:
          throw new Error(`Unsupported filter: ${filter}`);
      }
    },
    _action (action, arg) {
      switch (action) {
        case "forward":
          return `forward("${arg}")`;
        case "store":
          if (expression.length > 0) {
            return `store(notify="${arg}")`;
          } else {
            return "store()";
          }
        case "stop":
          return "stop()";
        default:
          throw new Error(`Unsupported action: ${action}`);
      }
    },
  },
  run: withErrorHandler(
    async function () {
      const data = {
        priority: this.priority,
        description: this.description,
        expression: this._expression(this.match, this.match_expression),
        action: [
          this._action(this.action, this.action_expression),
        ],
      };
      return await this.mailgun.api("routes").create(data);
    }
  )
};
