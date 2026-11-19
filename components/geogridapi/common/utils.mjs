import { ConfigurationError } from "@pipedream/platform";

/**
 * Builds the grid request body from the component props: `place_id` or `query`,
 * `keyword` and the optional format. Undefined values are stripped by the platform axios.
 */
export function buildGridBody({
  placeId, query, keyword, shape, size, density, radiusKm, language, country,
}) {
  if (Boolean(placeId) === Boolean(query)) {
    throw new ConfigurationError("Provide either **Place ID** or **Business Name and City**, not both.");
  }
  let radius;
  if (radiusKm !== undefined && radiusKm !== null && `${radiusKm}`.trim() !== "") {
    radius = Number(radiusKm);
    if (!Number.isFinite(radius)) {
      throw new ConfigurationError("**Radius (km)** must be a number, e.g. `3`.");
    }
  }
  return {
    place_id: placeId || undefined,
    query: query || undefined,
    keyword,
    shape,
    size,
    density,
    radius_km: radius,
    language,
    country,
  };
}

/** The format of a grid in words: `7×7` for a square, `circle (medium)` for a shape. */
export function formatLabel(grid) {
  return grid.shape === "square"
    ? `${grid.size}×${grid.size}`
    : `${grid.shape} (${grid.density ?? "medium"})`;
}

/** One-line result of a finished grid. */
export function gridSummary(grid) {
  const name = grid.place?.name ?? grid.place?.place_id;
  if (grid.status === "failed") {
    const reason = grid.error?.message ?? grid.error?.code ?? "unknown error";
    return `Grid ${grid.id} for "${grid.keyword}" (${name}) failed and was refunded: ${reason}`;
  }
  if (grid.status !== "completed") {
    return `Grid ${grid.id} for "${grid.keyword}" (${name}) is still ${grid.status}; use **Get Grid** later`;
  }
  const average = grid.summary?.average_rank ?? "20+";
  const top3 = grid.summary?.top3_points ?? 0;
  return `Grid ${grid.id}: "${grid.keyword}" for ${name}, ${formatLabel(grid)}, average rank ${average}, top 3 on ${top3}/${grid.points_total} points`;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
