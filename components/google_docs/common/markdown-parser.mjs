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
      // Process inline formatting within list items (bold, italic, code, links, etc.)
      const result = processInlineToken(token, textContent, formattingRequests, currentIndex);
      currentIndex = result;

      // Apply bullet formatting to the entire list item paragraph
      const bulletPreset = inOrderedList
        ? "NUMBERED_DECIMAL_ALPHA_ROMAN"
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
  let linkUrl = null;
  let linkStartIndex = -1;

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

      // Apply link formatting if inside a link
      if (linkUrl) {
        formattingRequests.push({
          type: "updateLink",
          textRange: {
            startIndex: linkStartIndex,
            endIndex: currentIndex,
          },
          url: linkUrl,
        });
        linkUrl = null;
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
    } else if (child.type === "link_open") {
      linkUrl = child.attrGet("href");
      linkStartIndex = currentIndex;
    } else if (child.type === "link_close") {
      // Link closing handled by the next text node
      // This flag will be reset after applying the formatting
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
    // Bullet formatting is not supported for replacement text
    // It only works on paragraph-level, not on text ranges
    return null;

  case "updateLink":
    return {
      updateTextStyle: {
        range: {
          startIndex: req.textRange.startIndex,
          endIndex: req.textRange.endIndex,
        },
        textStyle: {
          link: {
            url: req.url,
          },
        },
        fields: "link",
      },
    };

  default:
    return null;
  }
}

/**
 * Collect all text from the document into a single array
 * Also builds an index map to track original document positions
 */
function collectAllDocumentText(elements, allText, indexMap, state) {
  if (!elements || !Array.isArray(elements)) {
    return;
  }

  elements.forEach((element) => {
    if (element.paragraph) {
      if (element.paragraph.elements && Array.isArray(element.paragraph.elements)) {
        element.paragraph.elements.forEach((el) => {
          if (el.textRun && el.textRun.content) {
            const text = el.textRun.content;
            const startOfText = state.allTextIndex;

            allText.push(text);

            // Record the document index for this position in allText
            for (let i = 0; i < text.length; i++) {
              indexMap[startOfText + i] = state.currentIndex + i;
            }

            state.allTextIndex += text.length;
            state.currentIndex += text.length;
          } else if (el.inlineObject) {
            indexMap[state.allTextIndex] = state.currentIndex;
            state.allTextIndex += 1;
            state.currentIndex += 1;
          } else if (
            el.pageBreak
            || el.columnBreak
            || el.footnoteReference
            || el.endnoteReference
          ) {
            indexMap[state.allTextIndex] = state.currentIndex;
            state.allTextIndex += 1;
            state.currentIndex += 1;
          }
        });
      }
    } else if (element.table) {
      collectTableText(element.table, allText, indexMap, state);
    }
  });
}

/**
 * Collect text from a table recursively
 */
function collectTableText(table, allText, indexMap, state) {
  if (!table.tableRows || !Array.isArray(table.tableRows)) {
    return;
  }

  table.tableRows.forEach((row) => {
    if (row.tableCells && Array.isArray(row.tableCells)) {
      row.tableCells.forEach((cell) => {
        collectAllDocumentText(cell.content, allText, indexMap, state);
      });
    }
  });
}

/**
 * Build formatting requests for replaced text with recursive document scanning
 * Scans the entire document including nested structures (tables, lists) and finds
 * all occurrences of replacementText, applying formatting to each match.
 */
function buildFormattingRequestsForReplacement(markdownFormatting, doc, replacementText) {
  const requests = [];
  const bodyContent = doc?.body?.content || [];

  // First, collect all text from the document and build an index map
  const allText = [];
  const indexMap = []; // Maps position in allText to position in document
  const state = {
    currentIndex: 1,
    allTextIndex: 0,
  };

  // Collect all text
  collectAllDocumentText(bodyContent, allText, indexMap, state);

  const fullText = allText.join("");

  // Now search for the replacement text in the full text
  const matches = [];
  let searchPos = 0;
  let matchPos = fullText.indexOf(replacementText, searchPos);

  while (matchPos !== -1) {
    const docIndex = indexMap[matchPos] || (state.currentIndex + matchPos);
    matches.push({
      startIndex: docIndex,
      endIndex: docIndex + replacementText.length,
    });
    searchPos = matchPos + 1;
    matchPos = fullText.indexOf(replacementText, searchPos);
  }

  // Collect all bullet formatting requests separately
  const bulletRequests = [];

  // For each match found, generate formatting requests
  matches.forEach((match) => {
    markdownFormatting.forEach((req) => {
      // Handle bullet list formatting separately
      if (req.type === "createParagraphBullets") {
        bulletRequests.push({
          match,
          req,
        });
        return;
      }

      const adjustedReq = JSON.parse(JSON.stringify(req));
      // Adjust indices: the formatting is relative to start of replacement text (index 1)
      // We need to offset it to the actual match position in the document
      // match.startIndex is 1-based, so we add (match.startIndex - 1) to shift the formatting range
      const offset = match.startIndex - 1;
      adjustedReq.textRange.startIndex += offset;
      adjustedReq.textRange.endIndex += offset;

      // Validate that the range is not empty and within bounds
      if (adjustedReq.textRange.startIndex >= adjustedReq.textRange.endIndex) {
        return;
      }

      const formattingRequest = buildFormattingRequest(adjustedReq);
      if (formattingRequest) {
        requests.push(formattingRequest);
      }
    });
  });

  // Process bullet requests - apply bullets to the exact ranges from markdown parsing
  bulletRequests.forEach(({
    match,
    req,
  }) => {
    // Adjust the text range to the actual match position in the document
    // req.textRange is relative to the replacement text (starting at index 1)
    // match.startIndex is where the replacement text starts in the document
    const offset = match.startIndex - 1;

    // Find the paragraph that contains this specific range
    const rangeStart = req.textRange.startIndex + offset;
    const rangeEnd = req.textRange.endIndex + offset;

    // For bullet formatting, we only want to include the list item's own paragraph
    // Not any preceding text from a previous paragraph
    // Start from the beginning of the list item itself or the line start
    let paragraphStart = rangeStart;

    // Check if the character before rangeStart is a newline
    // If yes, paragraphStart is already correct (start of current line)
    // If no, scan backwards only one line to find the start of current paragraph
    if (rangeStart > 1 && fullText[rangeStart - 2] !== "\n") {
      // Scan backwards to find the newline that starts this paragraph
      for (let i = rangeStart - 1; i >= 1; i--) {
        if (fullText[i - 1] === "\n") {
          paragraphStart = i;
          break;
        }
        if (i === 1) {
          paragraphStart = 1;
          break;
        }
      }
    }

    // Scan forwards to find paragraph end (look for newline or document end)
    let paragraphEnd = rangeEnd;
    for (let i = rangeEnd; i < fullText.length; i++) {
      if (fullText[i] === "\n") {
        paragraphEnd = i;
        break;
      }
      if (i === fullText.length - 1) {
        paragraphEnd = fullText.length;
        break;
      }
    }

    // Determine bullet preset - use req.bulletPreset if available, otherwise default
    const defaultBulletPreset = req.bulletPreset || "BULLET_DISC_CIRCLE_SQUARE";

    const bulletRequest = {
      createParagraphBullets: {
        range: {
          startIndex: paragraphStart,
          endIndex: paragraphEnd,
        },
        bulletPreset: defaultBulletPreset,
      },
    };
    requests.push(bulletRequest);
  });

  return requests;
}

/**
 * Recursively scan document content for all text matches
 * Handles paragraphs, tables, lists, and all nested elements
 * Accumulates character index across all elements
 */
function scanDocumentContent(elements, replacementText, state, matches) {
  if (!elements || !Array.isArray(elements)) {
    return;
  }

  elements.forEach((element) => {
    if (element.paragraph) {
      scanParagraph(element.paragraph, replacementText, state, matches);
    } else if (element.table) {
      scanTable(element.table, replacementText, state, matches);
    } else if (element.sectionBreak) {
      // Sections don't contain text, just update structure
    } else if (element.pageBreak) {
      // Page breaks don't contain searchable text
    } else if (element.tableOfContents) {
      // Table of contents is auto-generated, skip
    }
  });
}

/**
 * Scan a paragraph element for text matches
 */
function scanParagraph(paragraph, replacementText, state, matches) {
  if (!paragraph.elements || !Array.isArray(paragraph.elements)) {
    return;
  }

  paragraph.elements.forEach((element) => {
    if (element.textRun && element.textRun.content) {
      const runText = element.textRun.content;
      const runStartIndex = state.currentIndex;

      // Find all occurrences of replacementText in this text run
      findAllMatches(runText, replacementText, runStartIndex, matches);

      state.currentIndex += runText.length;
    } else if (element.inlineObject) {
      // Inline objects (images, etc.) take up 1 character in index
      state.currentIndex += 1;
    } else if (element.pageBreak) {
      state.currentIndex += 1;
    } else if (element.columnBreak) {
      state.currentIndex += 1;
    } else if (element.footnoteReference) {
      state.currentIndex += 1;
    } else if (element.endnoteReference) {
      state.currentIndex += 1;
    }
  });
}

/**
 * Scan a table element recursively
 * Tables contain rows which contain cells which contain content blocks
 */
function scanTable(table, replacementText, state, matches) {
  if (!table.tableRows || !Array.isArray(table.tableRows)) {
    return;
  }

  table.tableRows.forEach((row) => {
    scanTableRow(row, replacementText, state, matches);
  });
}

/**
 * Scan a table row element
 */
function scanTableRow(row, replacementText, state, matches) {
  if (!row.tableCells || !Array.isArray(row.tableCells)) {
    return;
  }

  row.tableCells.forEach((cell) => {
    scanTableCell(cell, replacementText, state, matches);
  });
}

/**
 * Scan a table cell element
 * Cells contain content blocks similar to document body
 */
function scanTableCell(cell, replacementText, state, matches) {
  if (!cell.content || !Array.isArray(cell.content)) {
    return;
  }

  // Recursively scan cell content (paragraphs, tables, lists, etc.)
  scanDocumentContent(cell.content, replacementText, state, matches);
}

/**
 * Find all occurrences of searchText within a given string
 * Add match objects with exact startIndex and endIndex
 */
function findAllMatches(haystack, needle, baseIndex, matches) {
  if (!haystack || !needle || haystack.length === 0 || needle.length === 0) {
    return;
  }

  let searchStartPos = 0;
  let matchPos = haystack.indexOf(needle, searchStartPos);

  while (matchPos !== -1) {
    matches.push({
      startIndex: baseIndex + matchPos,
      endIndex: baseIndex + matchPos + needle.length,
    });

    // Continue searching for next occurrence
    searchStartPos = matchPos + 1;
    matchPos = haystack.indexOf(needle, searchStartPos);
  }
}

export default {
  parseMarkdown,
  convertToGoogleDocsRequests,
  buildFormattingRequestsForReplacement,
};
