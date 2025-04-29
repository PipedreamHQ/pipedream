export function adjustPropDefinitions(props, app) {
  return Object.fromEntries(
    Object.entries(props).map(([
      key,
      prop,
    ]) => {
      const {
        propDefinition, ...otherValues
      } = prop;
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
        key,
        value,
      ]) => key != "idNotificationSource" && (value)),
  );
}
