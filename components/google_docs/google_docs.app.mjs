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
      description: "For a multi-tab document, restrict the operation to this tab (e.g. `t.0`). Get tab IDs from **List Tabs**. Omit to apply the operation to every tab.",
      optional: true,
    },
    // Tab selector for content writes (insert/delete). Deliberately separate
    // from `styleTabId`: omitting this one means "the document's first tab", not
    // "every tab", because the Docs API applies an untargeted `Location` /
    // `EndOfSegmentLocation` to the first tab only (measured).
    contentTabId: {
      type: "string",
      label: "Tab ID",
      description: "For a multi-tab document, the ID of the tab to write into (e.g. `t.0`). Get tab IDs from **List Tabs**, or use the ID returned by **Create Tab**. Omit to write into the document's first tab — the Google Docs API sends every untargeted edit there, so pass this whenever the document has more than one tab.",
      optional: true,
    },
    replacementFormat: {
      type: "string",
      label: "Replacement Format",
      description: "How to interpret the replacement text. `plain` inserts it exactly as typed (default). `markdown` converts Markdown syntax (bold, italic, inline code, links, headings, bullet and numbered lists) into native Google Docs formatting. Note that block-level Markdown (headings, lists) restyles the entire paragraph containing the match, since Google Docs applies paragraph styles per paragraph.",
      options: [
        "plain",
        "markdown",
      ],
      default: "plain",
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
    // Every location and range in a batchUpdate carries an optional `tabId`.
    // When it is omitted the Docs API applies the request to the document's
    // FIRST tab (measured), so these builders pass it through rather than
    // letting a tab-targeted edit silently land on tab one.
    _insertAtBeginning(requestObj, tabId) {
      return {
        ...requestObj,
        location: {
          index: 1,
          ...(tabId && {
            tabId,
          }),
        },
      };
    },
    _insertAtEnd(requestObj, tabId) {
      return {
        ...requestObj,
        endOfSegmentLocation: {
          ...(tabId && {
            tabId,
          }),
        },
      };
    },
    _buildRequest(requestObj, atBeginning, tabId) {
      return atBeginning
        ? this._insertAtBeginning(requestObj, tabId)
        : this._insertAtEnd(requestObj, tabId);
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
    _buildRequestForPosition(requestObj, position, tabId) {
      const index = this._resolvePositionIndex(position);
      return index == null
        ? this._insertAtEnd(requestObj, tabId)
        : {
          ...requestObj,
          location: {
            index,
            ...(tabId && {
              tabId,
            }),
          },
        };
    },
    // An unknown tab fails with a bare "Cannot apply request to an invalid tab
    // ID" (measured) that names neither the document nor the IDs that would have
    // worked, so every batchUpdate rewrites it into something the caller can act
    // on. Anything else is rethrown untouched.
    _rethrowBatchUpdateError(error, documentId) {
      if (/invalid tab id/i.test(error?.message ?? "")) {
        throw new ConfigurationError(`Invalid Tab ID for document ${documentId}. Call **List Tabs** to get this document's tab IDs (e.g. \`t.0\`), or omit Tab ID to target the document's first tab.`);
      }
      throw error;
    },
    async _batchUpdate(documentId, requestName, request) {
      try {
        return await this.docs().documents.batchUpdate({
          documentId,
          requestBody: {
            requests: [
              {
                [requestName]: request,
              },
            ],
          },
        });
      } catch (error) {
        this._rethrowBatchUpdateError(error, documentId);
      }
    },
    async batchUpdate(documentId, requests, writeControl) {
      try {
        return await this.docs().documents.batchUpdate({
          documentId,
          requestBody: {
            requests,
            ...(writeControl && {
              writeControl,
            }),
          },
        });
      } catch (error) {
        this._rethrowBatchUpdateError(error, documentId);
      }
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
    // Content-free view of one tab, used everywhere a tab is described.
    _tabSummary(tab) {
      const properties = tab.tabProperties ?? {};
      return {
        tabId: properties.tabId,
        title: properties.title,
        index: properties.index ?? 0,
        nestingLevel: properties.nestingLevel ?? 0,
        ...(properties.parentTabId && {
          parentTabId: properties.parentTabId,
        }),
      };
    },
    // Tabs in document order (each parent immediately followed by its children),
    // metadata only. A `getDocument` without `includeTabsContent` omits `tabs`
    // entirely (measured), so this is the only way to learn a document's tab IDs.
    async listTabs(documentId) {
      const document = await this.getDocument(documentId, true);
      return this._flattenDocumentTabs(document.tabs)
        .map((tab) => this._tabSummary(tab));
    },
    _findTab(document, tabId) {
      const tabs = this._flattenDocumentTabs(document.tabs);
      const tab = tabs.find(({ tabProperties }) => tabProperties?.tabId === tabId);
      if (!tab) {
        const available = tabs
          .map(({ tabProperties }) => `${tabProperties?.tabId} ("${tabProperties?.title}")`)
          .join(", ");
        throw new ConfigurationError(`No tab with ID "${tabId}" found in document ${document.documentId}. This document's tabs are: ${available}.`);
      }
      return tab;
    },
    // Body content of one tab, or of the first tab when no tab is given.
    // `getDocument(id, false)` only ever returns the FIRST tab's body, so a
    // tab-targeted caller has to read through `tabs` instead.
    async getTabBodyContent(documentId, tabId) {
      if (!tabId) {
        const { body } = await this.getDocument(documentId, false, "body");
        return body?.content;
      }
      const document = await this.getDocument(documentId, true);
      return this._findTab(document, tabId).documentTab?.body?.content;
    },
    // One tabs-aware read that keeps the historical response shape. Fetching
    // with `includeTabsContent` moves the content under `tabs[].documentTab` and
    // drops the top-level `body`/`documentStyle`/`namedStyles`, so the first tab
    // is merged back up to where callers have always found it and the tab list is
    // added alongside. Without this, a multi-tab document read as `body` alone
    // looked exactly like a single-tab document — the other tabs were invisible.
    async getDocumentWithTabs(documentId) {
      const document = await this.getDocument(documentId, true);
      const {
        tabs, ...documentFields
      } = document;
      const flattened = this._flattenDocumentTabs(tabs);
      const [
        firstTab,
      ] = flattened;
      const merged = {
        ...documentFields,
        ...(firstTab?.documentTab ?? {}),
      };
      const result = merged.body
        ? utils.addTextContentToDocument(merged)
        : merged;
      return {
        ...result,
        tabCount: flattened.length,
        tabs: flattened.map((tab) => ({
          ...this._tabSummary(tab),
          // Only for a multi-tab document, where the top-level `textContent`
          // (the first tab's) is not the whole document. Every entry carries its
          // own text, including the first: a uniform list reads more easily than
          // one whose first element's text lives somewhere else, and the cost is
          // repeating a single tab's text. A single-tab document skips this
          // entirely, so its response stays byte-for-byte what it always was.
          ...(flattened.length > 1 && {
            textContent: utils.getTextContentFromDocument(tab.documentTab?.body?.content ?? []),
          }),
        })),
      };
    },
    // What a tab-targeted write returns. Plain `getDocument` would hand back the
    // FIRST tab's content, which for an edit that landed in another tab reads as
    // if nothing had happened, so return the tab that was actually written.
    async getWriteResult(documentId, tabId) {
      if (!tabId) {
        return this.getDocument(documentId);
      }
      const document = await this.getDocument(documentId, true);
      const tab = this._findTab(document, tabId);
      return {
        documentId: document.documentId,
        title: document.title,
        revisionId: document.revisionId,
        tab: {
          ...this._tabSummary(tab),
          textContent: utils.getTextContentFromDocument(tab.documentTab?.body?.content ?? []),
          body: tab.documentTab?.body,
        },
      };
    },
    // Adds a tab and returns its `tabProperties`, including the generated
    // `tabId` that every tab-targeted edit needs.
    async addTab(documentId, {
      title, index, parentTabId,
    }) {
      const { data } = await this.batchUpdate(documentId, [
        {
          addDocumentTab: {
            tabProperties: {
              ...(title && {
                title,
              }),
              ...(index != null && {
                index,
              }),
              ...(parentTabId && {
                parentTabId,
              }),
            },
          },
        },
      ]);
      return data?.replies?.[0]?.addDocumentTab?.tabProperties;
    },
    async createEmptyDoc(title) {
      const { data: createdDoc } = await this.docs().documents.create({
        requestBody: {
          title,
        },
      });
      return createdDoc;
    },
    async insertText(documentId, text, atBeginning = false, tabId) {
      const request = this._buildRequest(text, atBeginning, tabId);
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
      startIndex, endIndex, tabId,
    }) {
      return this._batchUpdate(documentId, "deleteContentRange", {
        range: {
          startIndex,
          endIndex,
          ...(tabId && {
            tabId,
          }),
        },
      });
    },
    async writeTable(documentId, {
      rows, position, hasHeaderRow, tabId,
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

      const beforeTables = this.flattenTables(await this.getTabBodyContent(documentId, tabId));

      const insertRequest = this._buildRequestForPosition({
        rows: numRows,
        columns: numColumns,
      }, position, tabId);
      await this._batchUpdate(documentId, "insertTable", insertRequest);

      // The insertTable reply carries no location info, so re-fetch the
      // document and select the new table by ordinal position (see
      // selectInsertedTable) rather than by startIndex — inserting
      // immediately before an existing table gives the new table that
      // table's old startIndex, so comparing index values can't tell them
      // apart.
      const tables = this.flattenTables(await this.getTabBodyContent(documentId, tabId));
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
              ...(tabId && {
                tabId,
              }),
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
                ...(tabId && {
                  tabId,
                }),
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

      return this.getWriteResult(documentId, tabId);
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
    // Replaces text and applies the formatting implied by the Markdown in the
    // replacement string. `replaceAllText` reports how many occurrences it
    // changed but not where they landed, so the ranges to style can only be
    // found by re-reading the document afterwards and locating the inserted
    // text by value.
    async replaceTextWithMarkdown({
      documentId,
      textToReplace,
      markdownReplacement,
      matchCase = false,
      tabIds = null,
    }) {
      const {
        text: parsedText,
        formattingRequests: markdownFormatting,
      } = markdownParser.parseMarkdown(markdownReplacement);

      // parseMarkdown closes every paragraph with a newline, which is right when
      // the markdown is a document body but wrong for an inline replacement: it
      // splits the host sentence across two paragraphs.
      const isBlockLevel = markdownFormatting.some(({ type }) =>
        type === "updateParagraphStyle" || type === "createParagraphBullets");
      const replacementText = isBlockLevel
        ? parsedText
        : parsedText.replace(/\n+$/, "");

      const insertedStartsByTab = new Map();
      if (markdownFormatting.length) {
        const beforeDoc = await this.getDocument(documentId, true);
        const lengthDelta = replacementText.length - textToReplace.length;
        this._flattenDocumentTabs(beforeDoc.tabs)
          .filter(({ tabProperties }) => !tabIds?.length || tabIds.includes(tabProperties?.tabId))
          .forEach((tab) => {
            const starts = markdownParser.findTextOccurrences(
              tab.documentTab,
              textToReplace,
              matchCase,
            );
            insertedStartsByTab.set(
              tab.tabProperties?.tabId,
              new Set(starts.map((start, index) => start + (index * lengthDelta))),
            );
          });
      }

      const { data: replaceData } = await this.batchUpdate(documentId, [
        {
          replaceAllText: {
            containsText: {
              text: textToReplace,
              matchCase,
            },
            replaceText: replacementText,
            tabsCriteria: tabIds?.length
              ? {
                tabIds,
              }
              : undefined,
          },
        },
      ]);
      const occurrencesChanged =
        replaceData?.replies?.[0]?.replaceAllText?.occurrencesChanged ?? 0;

      if (!occurrencesChanged || !markdownFormatting.length) {
        return {
          occurrencesChanged,
          formattingRequestsApplied: 0,
        };
      }

      const updatedDoc = await this.getDocument(documentId, true);

      const targetTabs = this._flattenDocumentTabs(updatedDoc.tabs)
        .filter(({ tabProperties }) => !tabIds?.length || tabIds.includes(tabProperties?.tabId));

      const formattingRequests = targetTabs.flatMap((tab) => {
        const tabId = tab.tabProperties?.tabId;
        const requests = markdownParser.buildFormattingRequestsForReplacement(
          markdownFormatting,
          tab.documentTab,
          replacementText,
          insertedStartsByTab.get(tabId),
        );
        return requests.map((request) => {
          const [
            requestName,
          ] = Object.keys(request);
          return {
            [requestName]: {
              ...request[requestName],
              range: {
                ...request[requestName].range,
                tabId,
              },
            },
          };
        });
      });

      if (formattingRequests.length) {
        await this.batchUpdate(documentId, formattingRequests, updatedDoc.revisionId && {
          requiredRevisionId: updatedDoc.revisionId,
        });
      }

      return {
        occurrencesChanged,
        formattingRequestsApplied: formattingRequests.length,
      };
    },
  },
};
