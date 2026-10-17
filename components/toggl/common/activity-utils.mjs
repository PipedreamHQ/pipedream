import { createHash } from "node:crypto";

const normalizeText = (value) => String(value ?? "")
  .trim()
  .replace(/\s+/g, " ")
  .toLowerCase();

const stableValue = (value) => {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(Object.keys(value)
    .sort()
    .map((key) => [
      key,
      stableValue(value[key]),
    ]));
};

export const getQuerySignature = (query) => createHash("sha256")
  .update(JSON.stringify(stableValue(query)))
  .digest("hex");

export const matchesDescription = (description, query, mode = "contains") => {
  if (!query) return true;

  const value = normalizeText(description);
  const normalizedQuery = normalizeText(query);

  if (mode === "exact") return value === normalizedQuery;
  if (mode === "all_terms") {
    return normalizedQuery.split(" ").every((term) => value.includes(term));
  }

  return value.includes(normalizedQuery);
};

const getDatePart = (value) => {
  const match = String(value ?? "").match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? null;
};

const getBucket = (start, bucketBy) => {
  const date = getDatePart(start);

  if (bucketBy === "none" || !date) return null;
  if (bucketBy === "month") return date.slice(0, 7);

  const startDate = new Date(`${date}T00:00:00Z`);
  const daysSinceMonday = (startDate.getUTCDay() + 6) % 7;
  startDate.setUTCDate(startDate.getUTCDate() - daysSinceMonday);
  return startDate.toISOString().slice(0, 10);
};

/**
 * Flatten Toggl detailed-report rows into one deterministic object per entry.
 *
 * @param {Array} rows - Raw Toggl detailed-report rows
 * @param {Object} metadata - Resolved projects, users, and tasks
 * @returns {Array} Normalized time entries
 */
export const flattenDetailedRows = (rows, metadata = {}) => {
  const projectsById = new Map((metadata.projects || []).map((project) => [
    Number(project.id ?? project.projectId),
    project,
  ]));
  const usersById = new Map((metadata.users || []).map((user) => [
    Number(user.id ?? user.userId),
    user,
  ]));
  const tasksById = new Map((metadata.tasks || []).map((task) => [
    Number(task.id ?? task.taskId),
    task,
  ]));

  return rows.flatMap((row) => {
    const projectId = Number(row.project_id) || null;
    const userId = Number(row.user_id) || null;
    const taskId = Number(row.task_id) || null;
    const project = projectsById.get(projectId);
    const user = usersById.get(userId);
    const task = tasksById.get(taskId);

    return row.time_entries.map((entry) => ({
      entryId: Number(entry.id),
      userId,
      userName: row.username ?? user?.name ?? user?.fullname ?? null,
      projectId,
      projectName: row.project_name ?? project?.name ?? project?.projectName ?? null,
      clientId: project?.clientId ?? null,
      clientName: row.client_name ?? project?.clientName ?? null,
      taskId,
      taskName: row.task_name ?? task?.name ?? task?.taskName ?? null,
      description: row.description === undefined || row.description === null
        ? null
        : String(row.description),
      start: entry.start ?? null,
      stop: entry.stop ?? null,
      seconds: Number(entry.seconds),
      billable: Boolean(row.billable),
      tagNames: Array.isArray(row.tag_names)
        ? row.tag_names
        : [],
    }));
  });
};

const compareNullable = (left, right) => String(left ?? "").localeCompare(String(right ?? ""));

const buildDigest = (entries, bucketBy, includeEntryIds) => {
  const groups = new Map();

  for (const entry of entries) {
    const normalizedDescription = normalizeText(entry.description);
    const bucket = getBucket(entry.start, bucketBy);
    const key = JSON.stringify([
      bucket,
      entry.projectId,
      entry.taskId,
      normalizedDescription,
    ]);
    const group = groups.get(key) || {
      bucket,
      projectId: entry.projectId,
      projectName: entry.projectName,
      clientId: entry.clientId,
      clientName: entry.clientName,
      taskId: entry.taskId,
      taskName: entry.taskName,
      description: entry.description?.trim() || null,
      descriptionVariants: new Set(),
      contributors: new Map(),
      firstStart: entry.start,
      lastStop: entry.stop,
      entryCount: 0,
      trackedSeconds: 0,
      billableSeconds: 0,
      entryIds: [],
    };

    if (entry.description?.trim()) group.descriptionVariants.add(entry.description.trim());
    const contributorKey = entry.userId ?? entry.userName ?? "unknown";
    group.contributors.set(contributorKey, {
      userId: entry.userId,
      userName: entry.userName,
    });
    if (entry.start && (!group.firstStart || entry.start < group.firstStart)) {
      group.firstStart = entry.start;
    }
    if (entry.stop && (!group.lastStop || entry.stop > group.lastStop)) {
      group.lastStop = entry.stop;
    }
    group.entryCount++;
    group.trackedSeconds += entry.seconds;
    if (entry.billable) group.billableSeconds += entry.seconds;
    if (includeEntryIds) group.entryIds.push(entry.entryId);
    groups.set(key, group);
  }

  return [
    ...groups.values(),
  ].map((group) => {
    const descriptionVariants = [
      ...group.descriptionVariants,
    ];

    return {
      bucket: group.bucket,
      projectId: group.projectId,
      projectName: group.projectName,
      clientId: group.clientId,
      clientName: group.clientName,
      taskId: group.taskId,
      taskName: group.taskName,
      description: group.description,
      ...descriptionVariants.length > 1 && {
        descriptionVariants,
      },
      contributors: [
        ...group.contributors.values(),
      ].sort((a, b) => compareNullable(a.userName, b.userName)),
      firstStart: group.firstStart,
      lastStop: group.lastStop,
      entryCount: group.entryCount,
      trackedSeconds: group.trackedSeconds,
      billableSeconds: group.billableSeconds,
      ...includeEntryIds && {
        entryIds: group.entryIds.sort((a, b) => a - b),
      },
    };
  }).sort((a, b) => compareNullable(a.bucket, b.bucket)
    || compareNullable(a.projectName, b.projectName)
    || compareNullable(a.taskName, b.taskName)
    || compareNullable(a.description, b.description));
};

export const buildProjectActivityOutput = ({
  entries,
  responseMode,
  bucketBy,
  includeEntryIds,
}) => {
  const blankDescriptionCount = entries.filter((entry) => !entry.description?.trim()).length;

  if (responseMode === "individual_entries") {
    return {
      entries: entries.sort((a, b) => compareNullable(a.start, b.start)
        || a.entryId - b.entryId),
      blankDescriptionCount,
    };
  }

  return {
    activities: buildDigest(entries, bucketBy, includeEntryIds),
    blankDescriptionCount,
  };
};
