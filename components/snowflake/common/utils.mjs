function estimatePayloadSize(data) {
  try {
    const jsonString = JSON.stringify(data);
    // Use Buffer.byteLength for accurate size calculation in Node.js
    return Buffer.byteLength(jsonString, "utf8");
  } catch (error) {
    // Fallback estimation if JSON.stringify fails
    return data.length * 1000; // Conservative estimate
  }
}

// Helper method to split rows into batches
function createBatches(rows, batchSize) {
  const batches = [];
  for (let i = 0; i < rows.length; i += batchSize) {
    batches.push(rows.slice(i, i + batchSize));
  }
  return batches;
}

export default {
  estimatePayloadSize,
  createBatches,
};
