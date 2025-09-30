import pipedream_utils from "../../pipedream_utils.app.mjs";
import v8 from "v8";

export default {
  name: "Debug Memory Usage",
  description: "Get memory usage statistics for the current Pipedream workflow.",
  key: "pipedream_utils-debug-memory-usage",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipedream_utils,
  },
  async run({ $ }) {
    function formatBytes(bytes) {
      return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    }

    const stats = v8.getHeapStatistics();

    $.export("$summary", "Successfully exported memory usage statistics");

    return {
      totalHeapSize: formatBytes(stats.total_heap_size),
      totalHeapSizeExecutable: formatBytes(stats.total_heap_size_executable),
      totalPhysicalSize: formatBytes(stats.total_physical_size),
      totalAvailableSize: formatBytes(stats.total_available_size),
      usedHeapSize: formatBytes(stats.used_heap_size),
      heapSizeLimit: formatBytes(stats.heap_size_limit),
    };
  },
};
