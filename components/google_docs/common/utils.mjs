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

export default {
  getTextContentFromDocument,
  addTextContentToDocument,
};
