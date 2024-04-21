export function adjustPropDefinitions(props, app) {
  return Object.fromEntries(
    Object.entries(props).map(([
      key,
      {
        propDefinition, ...otherValues
      },
    ]) => {
      if (propDefinition) {
        const [
          , ...otherDefs
        ] = propDefinition;
        return [
          key,
          {
            propDefinition: [
              app,
              ...otherDefs,
            ],
            ...otherValues,
          },
        ];
      }
      return [
        key,
        otherValues.type === "app"
          ? null
          : otherValues,
      ];
    })
      .filter(([
        , value,
      ]) => value),
  );
}
