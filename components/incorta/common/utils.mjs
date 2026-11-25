function getItemName(item) {
  if (typeof item === "string") {
    return item;
  }
  return item.name ?? item.tableName ?? item.schemaName;
}

function namesOf(list) {
  return (list ?? []).map(getItemName);
}

// Items processed concurrently per batch by `settleInBatches`.
const BATCH_SIZE = 5;

// Runs `task` over `items` in small concurrent batches rather than one at a
// time (or all at once). allSettled so one failing item doesn't discard the
// results that did load.
async function settleInBatches(items, task, batchSize = BATCH_SIZE) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    results.push(...await Promise.allSettled(batch.map(task)));
  }
  return results;
}

export default {
  getItemName,
  namesOf,
  settleInBatches,
};
