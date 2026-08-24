import docs from "@googleapis/docs";
import googleDrive from "@pipedream/google_drive";
import { ConfigurationError } from "@pipedream/platform";
import utils from "./common/utils.mjs";
import markdownParser from "./common/markdown-parser.mjs";
import { OCCURRENCES } from "./common/constants.mjs";

export default {
  type: "app",
  app: "google_docs",
  propDefinitions: {
    ...googleDrive.propDefinitions,
    // Static, MCP-compatible document identifier. Prefer this over `docId`
    // (which carries an `async options()` dropdown invisible to MCP).
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the Google Doc. This is the long string in the document's URL: `https://docs.google.com/document/d/{DOCUMENT_ID}/edit`. Use **Find Document** to resolve a document's name to its ID.",
    },
    // Static insert position shared by insert-text/table/image/page-break.
    position: {
      type: "string",
      label: "Position",
      description: "Where to insert the content: `end` to append to the end of the document (default), `beginning` to insert at the start, or a numeric character index (e.g., `1`) for a specific location.",
      optional: true,
      default: "end",
    },
    // Static, MCP-compatible folder selector for the create actions. Kept as a
    // separate key so the inherited Drive `folderId` (async dropdown) stays
    // available to out-of-scope consumers like the sources/triggers.
    documentFolderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the Drive folder to place the new document in (the string after `/folders/` in a Drive folder URL). If omitted, the document is created in the root of My Drive.",
      optional: true,
    },
    docId: {
      type: "string",
      label: "Document",
      description: "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`).",
      useQuery: true,
      async options({
        prevContext, driveId, query,
      }) {
        const { nextPageToken } = prevContext;
        return this.listDocsOptions(driveId, query, nextPageToken);
      },
    },
    imageId: {
      type: "string",
      label: "Image ID",
      description: "The Image ID",
      async options({ documentId }) {
        const { inlineObjects: images } = await this.getDocument(documentId);
        if (!images) return [];
        return Object.values(images)
          .map((image) => ({
            label: image.inlineObjectProperties?.embeddedObject?.imageProperties?.sourceUri,
            value: image.objectId,
          }))
          .filter((image) => image.label);
      },
    },
    tabId: {
      type: "string",
      label: "Tab ID",
      description: "The Tab ID",
      optional: true,
      async options({ documentId }) {
        const { tabs } = await this.getDocument(documentId, true);
        return Object.values(tabs).map(({ tabProperties }) => ({
          label: tabProperties.title,
          value: tabProperties.tabId,
        }));
      },
    },
    imageUri: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image you want to insert into the doc",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Enter static text (e.g., `hello world`) or a reference to a string exported by a previous step (e.g., `{{steps.foo.$return_value}}`).",
    },
    appendAtBeginning: {
      type: "boolean",
      label: "Append at Beginning",
      description: "Whether to append at the beginning (`true`) of the document or at the end (`false`). Defaults to `false`",
      default: false,
      optional: true,
    },
    matchCase: {
      type: "boolean",
      label: "Match Case",
      description: "Case sensitive search (`true`) or not (`false`). Defaults to `false`",
      default: false,
      optional: true,
    },
    findText: {
      type: "string",
      label: "Find Text",
      description: "The text to style. The action locates it in the document and styles each match selected by **Occurrence**. Leave blank only if you are supplying **Start Index** and **End Index** instead.",
      optional: true,
    },
    occurrence: {
      type: "string",
      label: "Occurrence",
      description: "Which matches of **Find Text** to style: `first` (default) or `all`.",
      options: OCCURRENCES,
      default: "first",
      optional: true,
    },
    startIndex: {
      type: "integer",
      label: "Start Index",
      description: "Character index to style from, inclusive. Use with **End Index** instead of **Find Text**. Indices come from **Get Document** and shift after every edit, so prefer **Find Text**.",
      optional: true,
    },
    endIndex: {
      type: "integer",
      label: "End Index",
      description: "Character index to style up to, exclusive. Must be greater than **Start Index**.",
      optional: true,
    },
    styleTabId: {
      type: "string",
      label: "Tab ID",
      description: "For a multi-tab document, restrict the operation to this tab (e.g. `t.0`). Copy it from **Get Document**. Omit to search every tab.",
      optional: true,
    },
  },
  methods: {
    ...googleDrive.methods,
    docs() {
      const auth = new docs.auth.OAuth2();
      auth.setCredentials({
        access_token: this.$auth.oauth_access_token,
      });
      return docs.docs({
        version: "v1",
        auth,
      });
    },
    _insertAtBeginning(requestObj) {
      return {
        ...requestObj,
        location: {
          index: 1,
        },
      };
    },
    _insertAtEnd(requestObj) {
      return {
        ...requestObj,
        endOfSegmentLocation: {},
      };
    },
    _buildRequest(requestObj, atBeginning) {
      return atBeginning
        ? this._insertAtBeginning(requestObj)
        : this._insertAtEnd(requestObj);
    },
    // Resolve a static `position` value (`beginning` | `end` | numeric index) into
    // either `null` (append at end) or the concrete character index it refers to.
    _resolvePositionIndex(position) {
      if (position == null || position === "end") {
        return null;
      }
      // Only accept "beginning", "end", or a string of pure digits — parseInt would
      // otherwise silently accept "1.5"/"1abc" as 1 and target the wrong index.
      const index = position === "beginning"
        ? 1
        : (/^\d+$/.test(String(position))
          ? parseInt(position, 10)
          : NaN);
      if (!Number.isInteger(index) || index < 1) {
        throw new ConfigurationError(`Invalid position "${position}". Use "beginning", "end", or a positive integer index.`);
      }
      return index;
    },
    // Resolve a static `position` value into the location field a batchUpdate
    // insert request expects.
    _buildRequestForPosition(requestObj, position) {
      const index = this._resolvePositionIndex(position);
      return index == null
        ? this._insertAtEnd(requestObj)
        : {
          ...requestObj,
          location: {
            index,
          },
        };
    },
    _batchUpdate(documentId, requestName, request) {
      return this.docs().documents.batchUpdate({
        documentId,
        requestBody: {
          requests: [
            {
              [requestName]: request,
            },
          ],
        },
      });
    },
    batchUpdate(documentId, requests) {
      return this.docs().documents.batchUpdate({
        documentId,
        requestBody: {
          requests,
        },
      });
    },
    async findDocuments({
      query, limit = 25,
    } = {}) {
      let q = "mimeType='application/vnd.google-apps.document' and trashed=false";
      if (query) {
        const escaped = query.replace(/'/g, "\\'");
        q += ` and (name contains '${escaped}' or fullText contains '${escaped}')`;
      }
      const { data } = await this.drive().files.list({
        q,
        pageSize: limit,
        fields: "files(id,name,modifiedTime,webViewLink)",
        orderBy: "modifiedTime desc",
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });
      return (data.files || []).map((f) => ({
        id: f.id,
        name: f.name,
        url: f.webViewLink || `https://docs.google.com/document/d/${f.id}/edit`,
        modifiedTime: f.modifiedTime,
      }));
    },
    async getDocument(documentId, includeTabsContent = false, fields) {
      const params = {
        documentId,
        includeTabsContent,
      };
      if (fields) {
        params.fields = fields;
      }
      const { data } = await this.docs().documents.get(params);
      // A field mask can return a body-less document; skip the textContent
      // enrichment in that case so the response is returned as-is.
      if (!fields && !includeTabsContent) {
        return utils.addTextContentToDocument(data);
      }
      return data;
    },
    async createEmptyDoc(title) {
      const { data: createdDoc } = await this.docs().documents.create({
        requestBody: {
          title,
        },
      });
      return createdDoc;
    },
    async insertText(documentId, text, atBeginning = false) {
      const request = this._buildRequest(text, atBeginning);
      return this._batchUpdate(documentId, "insertText", request);
    },
    async replaceText(documentId, text) {
      return this._batchUpdate(documentId, "replaceAllText", text);
    },
    async appendImage(documentId, image, atBeginning = false) {
      const request = this._buildRequest(image, atBeginning);
      return this._batchUpdate(documentId, "insertInlineImage", request);
    },
    async replaceImage(documentId, image) {
      return this._batchUpdate(documentId, "replaceImage", image);
    },
    async insertTable(documentId, table) {
      return this._batchUpdate(documentId, "insertTable", table);
    },
    // Top-level tables in a document body, in document order. Tables nested
    // inside another table's cell are not included.
    flattenTables(content) {
      return utils.flattenTables(content);
    },
    _flattenDocumentTabs(tabs) {
      return (tabs || []).flatMap((tab) => [
        tab,
        ...this._flattenDocumentTabs(tab.childTabs),
      ]);
    },
    async resolveTableLocation(documentId, {
      find, matchCase = false, tableIndex, tableStartIndex, tabId,
    }) {
      if (tableStartIndex != null) {
        return {
          index: tableStartIndex,
          ...(tabId && {
            tabId,
          }),
        };
      }

      const document = await this.getDocument(documentId, true);
      const tabs = this._flattenDocumentTabs(document.tabs)
        .filter(({ tabProperties }) => !tabId || tabProperties?.tabId === tabId);

      if (!tabs.length) {
        throw new ConfigurationError(`No tab with ID "${tabId}" found in document ${documentId}.`);
      }

      const tables = tabs.flatMap((tab) => this.flattenTables(tab.documentTab?.body?.content)
        .map((table) => ({
          ...table,
          tabId: tab.tabProperties?.tabId,
        })));

      if (!tables.length) {
        throw new ConfigurationError(`Document ${documentId} contains no tables.`);
      }

      if (find) {
        const match = tabs.flatMap((tab) => {
          const {
            text, indexMap,
          } = utils.collectTextWithIndices(tab.documentTab?.body?.content);
          return utils.findTextRanges({
            text,
            indexMap,
            needle: find,
            matchCase,
          }).map((range) => ({
            ...range,
            tabId: tab.tabProperties?.tabId,
          }));
        })[0];

        if (!match) {
          throw new ConfigurationError(`Text "${find}" was not found in document ${documentId}.`);
        }
        const containing = tables.find(({
          startIndex, endIndex, tabId: tableTabId,
        }) => tableTabId === match.tabId
          && startIndex <= match.startIndex && match.endIndex <= endIndex);

        if (!containing) {
          throw new ConfigurationError(`Text "${find}" was found in document ${documentId} but is not inside a table. Use Find Table Text that appears in a cell, or address the table by Table Index.`);
        }
        return {
          index: containing.startIndex,
          ...(containing.tabId && {
            tabId: containing.tabId,
          }),
        };
      }

      if (tableIndex != null) {
        const table = tables[tableIndex];
        if (!table) {
          throw new ConfigurationError(`Table Index ${tableIndex} is out of range: document ${documentId} has ${tables.length} table${tables.length === 1
            ? ""
            : "s"} (indices 0-${tables.length - 1}).`);
        }
        return {
          index: table.startIndex,
          ...(table.tabId && {
            tabId: table.tabId,
          }),
        };
      }

      if (tables.length > 1) {
        throw new ConfigurationError(`Document ${documentId} has ${tables.length} tables. Identify one with Find Table Text or Table Index (0-${tables.length - 1}).`);
      }
      return {
        index: tables[0].startIndex,
        ...(tables[0].tabId && {
          tabId: tables[0].tabId,
        }),
      };
    },
    async resolveStyleRanges(documentId, {
      find, matchCase = false, occurrence = "first", startIndex, endIndex, tabId,
    }) {
      if (startIndex != null || endIndex != null) {
        if (startIndex == null || endIndex == null) {
          throw new ConfigurationError("Start Index and End Index must be provided together.");
        }
        if (endIndex <= startIndex) {
          throw new ConfigurationError(`End Index (${endIndex}) must be greater than Start Index (${startIndex}).`);
        }
        return [
          {
            startIndex,
            endIndex,
            ...(tabId && {
              tabId,
            }),
          },
        ];
      }

      if (!find) {
        throw new ConfigurationError("Provide Find Text, or an explicit Start Index and End Index.");
      }

      const document = await this.getDocument(documentId, true);
      const tabs = this._flattenDocumentTabs(document.tabs)
        .filter(({ tabProperties }) => !tabId || tabProperties?.tabId === tabId);

      if (!tabs.length) {
        throw new ConfigurationError(`No tab with ID "${tabId}" found in document ${documentId}. Call Get Document without a Tab ID to list the document's tabs.`);
      }

      const ranges = tabs.flatMap((tab) => {
        const {
          text, indexMap,
        } = utils.collectTextWithIndices(tab.documentTab?.body?.content);
        return utils.findTextRanges({
          text,
          indexMap,
          needle: find,
          matchCase,
        }).map((range) => ({
          ...range,
          tabId: tab.tabProperties?.tabId,
        }));
      });

      if (!ranges.length) {
        throw new ConfigurationError(`Text "${find}" was not found in document ${documentId}.`);
      }

      return occurrence === "all"
        ? ranges
        : [
          ranges[0],
        ];
    },
    async deleteTable(documentId, {
      startIndex, endIndex,
    }) {
      return this._batchUpdate(documentId, "deleteContentRange", {
        range: {
          startIndex,
          endIndex,
        },
      });
    },
    async writeTable(documentId, {
      rows, position, hasHeaderRow,
    }) {
      // Validate before making any request: a bad cell value here should
      // never leave an empty table behind from a partially-applied insert.
      const invalidValue = rows.flat().find((value) => value != null && typeof value === "object");
      if (invalidValue !== undefined) {
        throw new ConfigurationError(
          `Table Data cells must be strings, numbers, or booleans, not a nested ${
            Array.isArray(invalidValue)
              ? "array"
              : "object"
          }. Example: [["Name","Role"],["Ada","Engineer"]]`,
        );
      }

      const numRows = rows.length;
      const numColumns = rows.reduce((max, row) => Math.max(max, row.length), 0);

      const { body: beforeBody } = await this.getDocument(documentId, false, "body");
      const beforeTables = this.flattenTables(beforeBody?.content);

      const insertRequest = this._buildRequestForPosition({
        rows: numRows,
        columns: numColumns,
      }, position);
      await this._batchUpdate(documentId, "insertTable", insertRequest);

      // The insertTable reply carries no location info, so re-fetch the
      // document and select the new table by ordinal position (see
      // selectInsertedTable) rather than by startIndex — inserting
      // immediately before an existing table gives the new table that
      // table's old startIndex, so comparing index values can't tell them
      // apart.
      const { body } = await this.getDocument(documentId, false, "body");
      const tables = this.flattenTables(body?.content);
      const requestedIndex = this._resolvePositionIndex(position);
      const table = utils.selectInsertedTable(beforeTables, tables, requestedIndex);
      if (!table) {
        throw new Error("Could not locate the table that was just created. The table was inserted but no cell data was written.");
      }

      const cells = [];
      table.table.tableRows.forEach((row, rowIndex) => {
        row.tableCells.forEach((cell, columnIndex) => {
          const paragraph = cell.content?.find((element) => element.paragraph);
          if (paragraph) {
            cells.push({
              rowIndex,
              columnIndex,
              startIndex: paragraph.startIndex,
            });
          }
        });
      });

      // Fill cells from the last one to the first. Inserting text only shifts
      // indices that come after it, so walking backwards keeps every
      // not-yet-written cell's precomputed startIndex valid throughout.
      const requests = [];
      [
        ...cells,
      ].reverse().forEach(({
        rowIndex, columnIndex, startIndex,
      }) => {
        const value = rows[rowIndex]?.[columnIndex];
        if (value == null || value === "") {
          return;
        }
        const text = String(value);
        requests.push({
          insertText: {
            location: {
              index: startIndex,
            },
            text,
          },
        });
        if (hasHeaderRow && rowIndex === 0) {
          requests.push({
            updateTextStyle: {
              range: {
                startIndex,
                endIndex: startIndex + text.length,
              },
              textStyle: {
                bold: true,
              },
              fields: "bold",
            },
          });
        }
      });

      if (requests.length) {
        await this.batchUpdate(documentId, requests);
      }

      return this.getDocument(documentId);
    },
    async insertPageBreak(documentId, request) {
      return this._batchUpdate(documentId, "insertPageBreak", request);
    },
    async createDocument(request) {
      const { data } = await this.docs().documents.create({
        requestBody: request,
      });
      return data;
    },
    async listDocsOptions(driveId, query, pageToken = null) {
      let q = "mimeType='application/vnd.google-apps.document'";
      if (query) {
        q = `${q} and name contains '${query}'`;
      }
      let request = {
        q,
      };
      if (driveId) {
        request = {
          ...request,
          corpora: "drive",
          driveId,
          pageToken,
          includeItemsFromAllDrives: true,
          supportsAllDrives: true,
        };
      }
      return this.listFilesOptions(pageToken, request);
    },
    async insertMarkdownText(documentId, markdown) {
      try {
        const parseResult = markdownParser.parseMarkdown(markdown);
        const batchRequests = markdownParser.convertToGoogleDocsRequests(parseResult);

        if (batchRequests.length === 0) {
          return null;
        }

        // Execute all requests in a single batch update
        return this.docs().documents.batchUpdate({
          documentId,
          requestBody: {
            requests: batchRequests,
          },
        });
      } catch (error) {
        throw new Error(`Failed to insert markdown text: ${error.message}`);
      }
    },
    async replaceTextWithMarkdown({
      documentId,
      textToReplace,
      markdownReplacement,
      matchCase = false,
      tabIds = null,
    }) {
      try {
        // Parse the markdown replacement text
        const parseResult = markdownParser.parseMarkdown(markdownReplacement);
        const {
          text: replacementText,
          formattingRequests: markdownFormatting,
        } = parseResult;

        // Build the initial replace request
        const requests = [
          {
            replaceAllText: {
              containsText: {
                text: textToReplace,
                matchCase: matchCase || false,
              },
              replaceText: replacementText,
              tabsCriteria: tabIds
                ? {
                  tabIds,
                }
                : undefined,
            },
          },
        ];

        if (markdownFormatting.length === 0) {
          // No formatting needed, just do the plain text replacement
          return this.docs().documents.batchUpdate({
            documentId,
            requestBody: {
              requests,
            },
          });
        }

        // For markdown with formatting, we need to find where the text will be replaced
        // and then apply formatting to it
        // First, do the replacement
        await this.docs().documents.batchUpdate({
          documentId,
          requestBody: {
            requests,
          },
        });

        // Get the document AFTER replacement
        const { data: updatedDocData } = await this.docs().documents.get({
          documentId,
        });

        // Find all occurrences of the replacement text in the updated document
        const formattingRequests = markdownParser.buildFormattingRequestsForReplacement(
          markdownFormatting,
          updatedDocData,
          replacementText,
        );

        // Apply formatting if any matches were found
        if (formattingRequests.length > 0) {
          return this.docs().documents.batchUpdate({
            documentId,
            requestBody: {
              requests: formattingRequests,
            },
          });
        }

        // Return updated document even if no formatting was applied
        return updatedDocData;
      } catch (error) {
        throw new Error(`Failed to replace text with markdown: ${error.message}`);
      }
    },
  },
};
