import mailgun from "../../mailgun.app.mjs";
import common from "../common.mjs";

export default {
  key: "mailgun-create-route",
  name: "Create Route",
  description: "Create a new route. [See the docs here](https://documentation.mailgun.com/en/latest/api-routes.html#actions)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        "catch_all",
      ],
    },
    matchExpression: {
      type: "string",
      label: "Filter Expression",
      description: "For the `recipient` filter, specify a regex expression like `.*@gmail.com`. " +
        "For the `header` filter, specify a header name followed by a colon followed by a regex, " +
        "like `subject:.*support`. For the `catch_all` filters, leave this blank.",
    },
    action: {
      type: "string",
      label: "Action",
      description: "The route action to execute when the route expression evaluates to True. For" +
        "more information, see the [route actions API documentation]" +
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
    ...common.props,
  },
  methods: {
    _expression (filter, expression) {
      switch (filter) {
      case "catch_all":
        return "catch_all()";
      case "recipient":
        return `match_recipient("${expression}")`;
      case "header": {
        let [
          header,
          headerExpression,
        ] = expression.split(":");
        if (Array.isArray(headerExpression)) {
          headerExpression = headerExpression.join(":");
        }
        return `match_header("${header}", "${headerExpression}")`;
      }
      default:
        throw new Error(`Unsupported filter: ${filter}`);
      }
    },
    _action (action, arg) {
      switch (action) {
      case "forward":
        return `forward("${arg}")`;
      case "store":
        if (arg.length > 0) {
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
    ...common.methods,
  },
  async run({ $ }) {
    const opts = {
      priority: this.priority,
      description: this.description,
      expression: this._expression(this.match, this.matchExpression),
      action: [
        this._action(this.action, this.action_expression),
      ],
    };
    const resp = await this.withErrorHandler(this.mailgun.createRoute, opts);
    $.export("$summary", "Successfully created route");
    return resp;
  },
};
