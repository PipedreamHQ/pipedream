function getTextContentFromDocument(content) {
  let textContent = "";
  content.forEach((element) => {
    if (element.paragraph) {
      element.paragraph.elements.forEach((textRun) => {
        if (textRun.textRun) {
          textContent += textRun.textRun.content;
        }
      });
    }
  });
  return textContent;
}

function addTextContentToDocument(response) {
  const textContent = getTextContentFromDocument(response.body.content);
  return {
    textContent,
    ...response,
  };
}

function adjustPropDefinitions(props, app) {
  return Object.fromEntries(
    Object.entries(props).map(([
      key,
      prop,
    ]) => {
      if (typeof prop === "string") return [
        key,
        prop,
      ];
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
        , value,
      ]) => value),
  );
}

export default {
  getTextContentFromDocument,
  addTextContentToDocument,
  adjustPropDefinitions,
};
