module.exports = {
  rules: {
    "async-func-name": {
      create: function (context) {
        return {
          FunctionDeclaration(node) {
            if (node.async && !/Async$/.test(node.id.name)) {
              context.report({
                node,
                message: "Async function name must end in 'Async'",
              });
            }
          },
        };
      },
    },
    "required-properties-key": {
      create: function (context) {
        return {
          ExpressionStatement(node) {
            const {
              left,
              right,
            } = node.expression;
            // Validate that this is the module.exports expression
            if (!left.object || !left.property) return;
            if (left.object.name !== "module" || left.property.name !== "exports") return;

            // Validate the right expression
            const {
              properties,
              type,
            } = right;
            if (type !== "ObjectExpression") return;
            if (!properties || Object.keys(properties).length === 0) return;

            if (!properties.map((p) => p?.key?.name).includes("key")) {
              context.report({
                node: node,
                message: "Components must export a key property that uniquely identifies the component",
              });
            }

          },
        };
      },
    },
  },
};
