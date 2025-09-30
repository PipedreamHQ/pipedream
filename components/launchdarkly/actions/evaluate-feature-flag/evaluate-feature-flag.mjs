import app from "../../launchdarkly.app.mjs";

export default {
  key: "launchdarkly-evaluate-feature-flag",
  name: "Evaluate Feature Flag",
  description: "Evaluates an existing feature flag for a specific user or in a general context. [See the documentation](https://apidocs.launchdarkly.com/tag/Contexts#operation/evaluateContextInstance).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectKey: {
      propDefinition: [
        app,
        "project",
      ],
    },
    environmentKey: {
      propDefinition: [
        app,
        "environment",
        ({ projectKey }) => ({
          projectKey,
        }),
      ],
    },
    flagKey: {
      propDefinition: [
        app,
        "flag",
        ({
          projectKey, environmentKey,
        }) => ({
          projectKey,
          environmentKey,
        }),
      ],
    },
    contextKind: {
      propDefinition: [
        app,
        "contextKind",
        ({ projectKey }) => ({
          projectKey,
        }),
      ],
    },
    contextKey: {
      label: "Context Key",
      description: "The key of the context to evaluate the feature flag against.",
      propDefinition: [
        app,
        "context",
        ({
          projectKey, environmentKey, flagKey, contextKind,
        }) => ({
          projectKey,
          environmentKey,
          key: flagKey,
          kind: contextKind,
        }),
      ],
    },
    otherAttributes: {
      type: "object",
      label: "Other Attributes",
      description: "Additional attributes to include in the context.",
      optional: true,
    },
  },
  methods: {
    evaluateFeatureFlag({
      projectKey, environmentKey, ...args
    }) {
      return this.app.post({
        path: `/projects/${projectKey}/environments/${environmentKey}/flags/evaluate`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      evaluateFeatureFlag,
      projectKey,
      environmentKey,
      contextKind,
      contextKey,
      otherAttributes,
    } = this;

    const response = await evaluateFeatureFlag({
      $,
      projectKey,
      environmentKey,
      data: {
        key: contextKey,
        kind: contextKind,
        ...otherAttributes,
      },
    });

    $.export("$summary", `Successfully evaluated feature flag with \`${response.items.length}\` item(s).`);

    return response;
  },
};
