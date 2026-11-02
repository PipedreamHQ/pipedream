import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";
import utils from "../../common/utils.mjs";

// Shared by the smart-chip actions (Insert Person, Insert Rich Link, Insert
// Date). Each action supplies `chipRequest()`, returning the batchUpdate
// request name and its chip properties; this base decides where the chip goes.
//
// An omitted Tab ID never falls through to the document's first tab: a
// positioned chip in a multi-tab document needs an explicit tab, and a
// placeholder is searched for in every tab.
export default {
  props: {
    googleDocs,
    documentId: {
      propDefinition: [
        googleDocs,
        "documentId",
      ],
    },
    placeholder: {
      type: "string",
      label: "Placeholder",
      description: "Existing text to replace with the chip, matched exactly (case-sensitive) — typically a placeholder you wrote with **Insert Text**, such as `{{owner}}`, or a name already in the document. Searches every tab unless **Tab ID** is set. When set, **Position** is ignored. This is the reliable way to put a chip mid-sentence: no character index needed.",
      optional: true,
    },
    occurrence: {
      propDefinition: [
        googleDocs,
        "occurrence",
      ],
      description: "Which matches of **Placeholder** become chips: `all` (default) or `first`.",
      default: "all",
    },
    position: {
      propDefinition: [
        googleDocs,
        "position",
      ],
      description: "Where to insert the chip when no **Placeholder** is given: `end` to append to the end of the tab (default), `beginning`, or a numeric character index (e.g. `12`) from **Get Document**. The chip joins the paragraph at that point, so to start a new line insert a newline with **Insert Text** first.",
    },
    tabId: {
      propDefinition: [
        googleDocs,
        "contentTabId",
      ],
      description: "For a multi-tab document, the ID of the tab to insert into (e.g. `t.0`); get IDs from **List Tabs**, or use the ID returned by **Create Tab**. Required when the document has more than one tab and the chip is placed by **Position** — the tool will not guess, so a chip never lands in the first tab by accident. With **Placeholder**, omit it to search every tab.",
    },
  },
  methods: {
    // Where the chips go: one `{ tabId, startIndex, endIndex }` range per
    // placeholder match, or a single `{ tabId }` for a positioned insert. A
    // placeholder search also returns the revision it read, so the write can
    // be applied against that revision.
    async resolveChipTargets() {
      if (this.placeholder) {
        return this.findPlaceholders();
      }
      if (this.tabId) {
        return {
          targets: [
            {
              tabId: this.tabId,
            },
          ],
        };
      }
      const tabs = await this.googleDocs.listTabs(this.documentId);
      if (tabs.length > 1) {
        const available = tabs
          .map(({
            tabId, title,
          }) => `${tabId} ("${title}")`)
          .join(", ");
        throw new ConfigurationError(`Document ${this.documentId} has ${tabs.length} tabs, so set **Tab ID** to choose where the chip goes: ${available}. Or set **Placeholder** to replace text wherever it appears.`);
      }
      return {
        targets: [
          {
            tabId: tabs[0]?.tabId,
          },
        ],
      };
    },
    async findPlaceholders() {
      if (!this.placeholder.trim()) {
        throw new ConfigurationError("Placeholder must contain visible text, e.g. `{{owner}}` — whitespace alone would match every space in the document.");
      }
      const document = await this.googleDocs.getDocument(this.documentId, true);
      const tabs = this.tabId
        ? [
          this.googleDocs._findTab(document, this.tabId),
        ]
        : this.googleDocs._flattenDocumentTabs(document.tabs);
      const ranges = tabs.flatMap((tab) => {
        const content = tab.documentTab?.body?.content ?? [];
        const {
          text, indexMap,
        } = utils.collectTextWithIndices(content);
        // A table of contents repeats heading text, so skip matches inside one
        // and replace only the heading itself.
        const tocs = content.filter(({ tableOfContents }) => tableOfContents);
        return utils.findTextRanges({
          text,
          indexMap,
          needle: this.placeholder,
          matchCase: true,
        })
          // The search skips non-text elements (chips, images), so a match that
          // straddles one spans more indexes than characters; deleting it would
          // take the element with it.
          .filter(({
            startIndex, endIndex,
          }) => endIndex - startIndex === this.placeholder.length
            && !tocs.some((toc) => startIndex >= toc.startIndex && startIndex < toc.endIndex))
          .map((range) => ({
            ...range,
            tabId: tab.tabProperties?.tabId,
          }));
      });
      if (!ranges.length) {
        const where = this.tabId
          ? `tab ${this.tabId} of document`
          : "document";
        throw new ConfigurationError(`Placeholder "${this.placeholder}" was not found in ${where} ${this.documentId}. It must match the document's text exactly, including case — check it with **Get Document**.`);
      }
      return {
        revisionId: document.revisionId,
        targets: (this.occurrence ?? "all") === "all"
          ? ranges
          : [
            ranges[0],
          ],
      };
    },
    // Placeholder replacements run last-match-first so each delete+insert pair
    // leaves the indexes of the matches before it untouched, and they go in one
    // batchUpdate so a failure leaves the document unchanged.
    buildChipRequests(targets, requestName, properties) {
      if (!this.placeholder) {
        return [
          {
            [requestName]: this.googleDocs._buildRequestForPosition(
              properties,
              this.position,
              targets[0].tabId,
            ),
          },
        ];
      }
      return [
        ...targets,
      ]
        .sort((a, b) => b.startIndex - a.startIndex)
        .flatMap(({
          tabId, startIndex, endIndex,
        }) => [
          {
            deleteContentRange: {
              range: {
                startIndex,
                endIndex,
                tabId,
              },
            },
          },
          {
            [requestName]: {
              ...properties,
              location: {
                index: startIndex,
                tabId,
              },
            },
          },
        ]);
    },
    // Each chip's index once every edit has landed: a chip occupies one index,
    // so each earlier replacement in the same tab pulls it back by the
    // placeholder's length minus one. Matches arrive in document order (tab by
    // tab, ascending), which is the order that arithmetic needs. `end` has no
    // index without a re-read.
    describeChips(targets) {
      if (!this.placeholder) {
        const index = this.googleDocs._resolvePositionIndex(this.position);
        return [
          {
            tabId: targets[0].tabId,
            ...(index == null
              ? {
                position: "end",
              }
              : {
                index,
              }),
          },
        ];
      }
      const shiftByTab = {};
      return targets.map(({
        tabId, startIndex, endIndex,
      }) => {
        const shift = shiftByTab[tabId] ?? 0;
        shiftByTab[tabId] = shift + (endIndex - startIndex - 1);
        return {
          tabId,
          index: startIndex - shift,
        };
      });
    },
    async insertChips() {
      const [
        requestName,
        properties,
      ] = this.chipRequest();
      const {
        targets, revisionId,
      } = await this.resolveChipTargets();
      // `targetRevisionId` has Google rebase the placeholder edits onto any
      // change made since the read, so a collaborator typing above the
      // placeholder can't shift the chip onto the wrong text (measured).
      const { data } = await this.googleDocs.batchUpdate(
        this.documentId,
        this.buildChipRequests(targets, requestName, properties),
        revisionId && {
          targetRevisionId: revisionId,
        },
      );
      const chips = this.describeChips(targets);
      const tabIds = [
        ...new Set(chips.map(({ tabId }) => tabId).filter(Boolean)),
      ];
      return {
        documentId: this.documentId,
        url: `https://docs.google.com/document/d/${this.documentId}/edit${tabIds.length === 1
          ? `?tab=${tabIds[0]}`
          : ""}`,
        revisionId: data?.writeControl?.requiredRevisionId,
        chipsInserted: chips.length,
        chips,
      };
    },
  },
};
