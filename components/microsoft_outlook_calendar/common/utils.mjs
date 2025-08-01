export default {
  parseArray(input) {
    if (!input) {
      return [];
    }

    if (typeof input === "string") {
      try {
        // Try to parse as JSON array first
        const parsed = JSON.parse(input);
        return Array.isArray(parsed)
          ? parsed.map((item) => String(item))
          : [
            String(input),
          ];
      } catch {
        // If JSON parsing fails, treat as single string
        return [
          input,
        ];
      }
    }

    if (Array.isArray(input)) {
      return input.map((item) => String(item));
    }

    if (typeof input === "object") {
      // Convert object to array of its values as strings
      return Object.values(input).map((item) => String(item));
    }

    // For any other type, convert to string and wrap in array
    return [
      String(input),
    ];
  },
};
