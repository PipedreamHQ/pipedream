// Shared paging for the "List ..." actions: the read loop and the result shape.
// The `maxItems` and `nextToken` inputs live in the app's propDefinitions.

import constants from "./constants.mjs";

/**
 * Reads pages until at least `maxItems` items are collected or the data runs out.
 *
 * @param {Function} fetchPage async `(token) => ({ items, nextToken })`
 * @param {number} maxItems the minimum number of items to collect
 * @param {string} [startToken] the token to resume from
 * @returns {Promise<{ items: Array, nextToken: (string|null) }>} `nextToken` is
 * set whenever more items may remain
 */
async function collectPages(
  fetchPage,
  maxItems = constants.listPaging.DEFAULT_MAX_ITEMS,
  startToken,
) {
  const items = [];
  let token = startToken || undefined;
  do {
    const page = await fetchPage(token);
    items.push(...page.items);
    token = page.nextToken || undefined;
  } while (token && items.length < maxItems);
  return {
    items,
    nextToken: token ?? null,
  };
}

/**
 * Result shape shared by the list actions: whether more exist and how to get
 * them come first, so they are seen before a long list.
 */
function listResult(name, {
  items, nextToken,
}) {
  return {
    truncated: Boolean(nextToken),
    nextToken,
    count: items.length,
    [name]: items,
  };
}

function listSummary(noun, {
  items, nextToken,
}, plural = `${noun}s`) {
  return `Found ${items.length} ${items.length === 1
    ? noun
    : plural}${nextToken
    ? " (more available: pass nextToken to read the next page)"
    : ""}`;
}

export {
  collectPages,
  listResult,
  listSummary,
};
