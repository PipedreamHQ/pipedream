const path = require("path");

function isModuleExports(node) {
  if (!node) return false;
  if (!node?.object || !node?.property) return false;
  if (node.object.name !== "module" || node.property.name !== "exports") return false;
  return true;
}

function isObjectWithProperties(node) {
  if (!node) return false;
  const {
    properties,
    type,
  } = node;
  if (type !== "ObjectExpression") return false;
  if (!properties || Object.keys(properties).length === 0) return false;
  return true;
}

function componentContainsPropertyCheck(context, node, propertyName, message) {
  const {
    left,
    right,
  } = node.expression;
  if (!isModuleExports(left)) return;
  if (!isObjectWithProperties(right)) return;

  if (!right.properties.map((p) => p?.key?.name).includes(propertyName)) {
    context.report({
      node: node,
      message: message ?? `Components must export a ${propertyName} property. See https://pipedream.com/docs/components/guidelines/#required-metadata`,
    });
  }
}

function componentPropsContainsPropertyCheck(context, node, propertyName) {
  const {
    left,
    right,
  } = node.expression;
  if (!isModuleExports(left)) return;
  if (!isObjectWithProperties(right)) return;

  const { properties } = right;
  const propertyNames = properties.map((p) => p?.key?.name);
  if (propertyNames.includes("props") || propertyNames.includes("propDefinitions")) {
    const props = properties.find((p) => p?.key?.name === "props" || p?.key?.name === "propDefinitions");
    if (!isObjectWithProperties(props?.value)) return;
    for (const prop of props.value?.properties) {
      const {
        key,
        value: propDef,
      } = prop;

      // We don't want to lint app props or props that are defined in another place
      if (!isObjectWithProperties(propDef)) continue;
      if (!isObjectWithProperties(right)) continue;
      const propProperties = propDef.properties.map((p) => p?.key?.name);
      if (propProperties.includes("propDefinition")) continue;

      if (!propProperties.includes(propertyName)) {
        context.report({
          node: prop,
          message: `Component prop ${key?.name} must have a ${propertyName}`,
        });
      }
    }
  }
}

module.exports = {
  rules: {
    "required-properties-key": {
      create: function (context) {
        return {
          ExpressionStatement(node) {
            componentContainsPropertyCheck(context, node, "key");
          },
        };
      },
    },
    "required-properties-name": {
      create: function (context) {
        return {
          ExpressionStatement(node) {
            componentContainsPropertyCheck(context, node, "name");
          },
        };
      },
    },
    "required-properties-version": {
      create: function (context) {
        return {
          ExpressionStatement(node) {
            componentContainsPropertyCheck(context, node, "version");
          },
        };
      },
    },
    "required-properties-description": {
      create: function (context) {
        return {
          ExpressionStatement(node) {
            componentContainsPropertyCheck(context, node, "description");
          },
        };
      },
    },
    "required-properties-type": {
      create: function (context) {
        return {
          ExpressionStatement(node) {
            componentContainsPropertyCheck(context, node, "type", "Components must export a type property (\"source\" or \"action\")");
          },
        };
      },
    },
    "props-label": {
      create: function (context) {
        return {
          ExpressionStatement(node) {
            componentPropsContainsPropertyCheck(context, node, "label");
          },
        };
      },
    },
    "props-description": {
      create: function (context) {
        return {
          ExpressionStatement(node) {
            componentContainsPropertyCheck(context, node, "type", "Components must export a type property (\"source\" or \"action\")");
          },
        };
      },
    },
    "default-value-required-for-optional-props": {
      create: function (context) {
        return {
          ExpressionStatement(node) {
            componentContainsPropertyCheck(context, node, "type", "Components must export a type property (\"source\" or \"action\")");
          },
        };
      },
    },
    "source-name": {
      create: function (context) {
        return {
          ExpressionStatement(node) {
            componentContainsPropertyCheck(context, node, "type", "Components must export a type property (\"source\" or \"action\")");
          },
        };
      },
    },
    "source-description": {
      create: function (context) {
        return {
          ExpressionStatement(node) {
            componentContainsPropertyCheck(context, node, "type", "Components must export a type property (\"source\" or \"action\")");
          },
        };
      },
    },
    // TODO: this won't run when it needs to, since we only lint on
    // **/actions/**/*.js (and the same for sources)
    "correct-directory": {
      create: function (context) {
        return {
          Program: function () {
            const parentOfParentDir = path.basename(path.resolve(context.getFilename(), "../.."));
            console.log(parentOfParentDir);
            if (![
              "actions",
              "sources",
            ].includes(parentOfParentDir)) {
              context.report({
                message: "Sources and actions must be kept within \"sources\" and \"actions\" directories",
              });
            }
          },
        };
      },
    },
  },
};
