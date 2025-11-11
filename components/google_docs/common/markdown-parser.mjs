/**
 * Markdown to Google Docs converter using markdown-it
 * Converts markdown text to Google Docs API batch update requests
 */

import MarkdownIt from "markdown-it";

/**
 * Create a custom markdown-it instance configured for Google Docs conversion
 * @returns {MarkdownIt} Configured markdown-it instance
 */
function createMarkdownParser() {
  return new MarkdownIt({
    html: false,
    breaks: true,
    linkify: false,
  });
}

/**
 * Parse markdown and convert to Google Docs API requests
 * @param {string} markdown - The markdown text to parse
 * @returns {Object} Object with text and formatting requests
 */
function parseMarkdown(markdown) {
  const md = createMarkdownParser();
  const tokens = md.parse(markdown, {});

  const textContent = [];
  const formattingRequests = [];
  let currentIndex = 1; // Start after document header

  // Store state for heading and list detection
  let nextIsHeading = false;
  let headingLevel = 0;
  let inBulletList = false;
  let inOrderedList = false;
  let listItemStartIndex = -1;

  tokens.forEach((token) => {
    if (token.type === "heading_open") {
      nextIsHeading = true;
      headingLevel = parseInt(token.tag[1], 10);
    } else if (token.type === "inline" && nextIsHeading) {
      const textStartIndex = currentIndex;
      const text = token.content;

      textContent.push(text);
      currentIndex += text.length;

      // Apply heading style
      formattingRequests.push({
        type: "updateParagraphStyle",
        textRange: {
          startIndex: textStartIndex,
          endIndex: currentIndex,
        },
        style: `HEADING_${headingLevel}`,
      });

      nextIsHeading = false;
    } else if (token.type === "heading_close") {
      // Add newline after heading
      textContent.push("\n");
      currentIndex += 1;
    } else if (token.type === "bullet_list_open") {
      inBulletList = true;
    } else if (token.type === "ordered_list_open") {
      inOrderedList = true;
    } else if (token.type === "list_item_open") {
      listItemStartIndex = currentIndex;
    } else if (token.type === "inline" && (inBulletList || inOrderedList)) {
      const text = token.content;

      textContent.push(text);
      currentIndex += text.length;

      // Apply bullet formatting
      const bulletPreset = inOrderedList
        ? "NUMBER_ASCENDING"
        : "BULLET_DISC_CIRCLE_SQUARE";
      formattingRequests.push({
        type: "createParagraphBullets",
        textRange: {
          startIndex: listItemStartIndex,
          endIndex: currentIndex,
        },
        bulletPreset,
      });
    } else if (token.type === "inline") {
      // Regular paragraph text with potential formatting
      const result = processInlineToken(token, textContent, formattingRequests, currentIndex);
      currentIndex = result;
    } else if (token.type === "paragraph_close") {
      // Add newline after paragraph (but not after list items)
      if (!inBulletList && !inOrderedList) {
        textContent.push("\n");
        currentIndex += 1;
      }
    } else if (token.type === "list_item_close") {
      // Add newline after list item
      textContent.push("\n");
      currentIndex += 1;
    } else if (token.type === "bullet_list_close") {
      inBulletList = false;
      // Add newline after list
      textContent.push("\n");
      currentIndex += 1;
    } else if (token.type === "ordered_list_close") {
      inOrderedList = false;
      // Add newline after list
      textContent.push("\n");
      currentIndex += 1;
    }
  });

  return {
    text: textContent.join(""),
    formattingRequests,
  };
}

/**
 * Process inline token content with formatting
 * @returns {number} Updated currentIndex
 */
function processInlineToken(token, textContent, formattingRequests, startIndex) {
  if (!token.children) {
    return startIndex;
  }

  let currentIndex = startIndex;
  let isBold = false;
  let isItalic = false;
  let isCode = false;

  token.children.forEach((child) => {
    if (child.type === "text") {
      const textStartIndex = currentIndex;
      const text = child.content;
      textContent.push(text);
      currentIndex += text.length;

      // Apply formatting if needed
      if (isBold || isItalic || isCode) {
        const formatting = {
          bold: isBold,
          italic: isItalic,
          underline: false,
        };

        if (isCode) {
          formatting.weightedFontFamily = {
            fontFamily: "Courier New",
            weight: 400,
          };
          formatting.backgroundColor = {
            color: {
              rgbColor: {
                red: 0.95,
                green: 0.95,
                blue: 0.95,
              },
            },
          };
        }

        formattingRequests.push({
          type: "updateTextStyle",
          textRange: {
            startIndex: textStartIndex,
            endIndex: currentIndex,
          },
          formatting,
        });
      }
    } else if (child.type === "strong_open") {
      isBold = true;
    } else if (child.type === "strong_close") {
      isBold = false;
    } else if (child.type === "em_open") {
      isItalic = true;
    } else if (child.type === "em_close") {
      isItalic = false;
    } else if (child.type === "code_inline") {
      const textStartIndex = currentIndex;
      const text = child.content;
      textContent.push(text);
      currentIndex += text.length;

      formattingRequests.push({
        type: "updateTextStyle",
        textRange: {
          startIndex: textStartIndex,
          endIndex: currentIndex,
        },
        formatting: {
          bold: false,
          italic: false,
          underline: false,
          weightedFontFamily: {
            fontFamily: "Courier New",
            weight: 400,
          },
          backgroundColor: {
            color: {
              rgbColor: {
                red: 0.95,
                green: 0.95,
                blue: 0.95,
              },
            },
          },
        },
      });
    } else if (child.type === "softbreak" || child.type === "hardbreak") {
      textContent.push("\n");
      currentIndex += 1;
    }
  });

  return currentIndex;
}

/**
 * Convert parsed markdown structure to Google Docs batchUpdate requests
 * @param {Object} parseResult - Result from parseMarkdown()
 * @returns {Array} Array of Google Docs API requests
 */
function convertToGoogleDocsRequests(parseResult) {
  const {
    text,
    formattingRequests,
  } = parseResult;
  const batchRequests = [];

  // First, insert all the text
  if (text) {
    batchRequests.push({
      insertText: {
        text,
        location: {
          index: 1,
        },
      },
    });
  }

  // Then apply all formatting requests
  formattingRequests.forEach((req) => {
    const request = buildFormattingRequest(req);
    if (request) {
      batchRequests.push(request);
    }
  });

  return batchRequests;
}

/**
 * Build formatting requests for Google Docs API
 * @param {Object} req - Formatting request from parseMarkdown
 * @returns {Object} Google Docs API request
 */
function buildFormattingRequest(req) {
  switch (req.type) {
  case "updateParagraphStyle":
    return {
      updateParagraphStyle: {
        range: {
          startIndex: req.textRange.startIndex,
          endIndex: req.textRange.endIndex,
        },
        paragraphStyle: {
          namedStyleType: req.style,
        },
        fields: "namedStyleType",
      },
    };

  case "updateTextStyle": {
    const textStyle = {
      bold: req.formatting.bold,
      italic: req.formatting.italic,
      underline: req.formatting.underline,
    };
    const fields = [
      "bold",
      "italic",
      "underline",
    ];

    if (req.formatting.weightedFontFamily) {
      textStyle.weightedFontFamily = req.formatting.weightedFontFamily;
      fields.push("weightedFontFamily");
    }

    if (req.formatting.backgroundColor) {
      textStyle.backgroundColor = req.formatting.backgroundColor;
      fields.push("backgroundColor");
    }

    return {
      updateTextStyle: {
        range: {
          startIndex: req.textRange.startIndex,
          endIndex: req.textRange.endIndex,
        },
        textStyle,
        fields: fields.join(","),
      },
    };
  }

  case "createParagraphBullets":
    return {
      createParagraphBullets: {
        range: {
          startIndex: req.textRange.startIndex,
          endIndex: req.textRange.endIndex,
        },
        bulletPreset: req.bulletPreset || "BULLET_DISC_CIRCLE_SQUARE",
      },
    };

  default:
    return null;
  }
}

export default {
  parseMarkdown,
  convertToGoogleDocsRequests,
};
