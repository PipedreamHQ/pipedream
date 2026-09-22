export function normalizePhone(s) {
  return String(s ?? "").replace(/\D/g, "");
}

export function phonesMatch(a, b) {
  const na = normalizePhone(a);
  const nb = normalizePhone(b);
  if (!na || !nb) return false;
  return na === nb || na.endsWith(nb) || nb.endsWith(na);
}

export function getAssignmentUserId(assignment) {
  if (assignment == null) return null;
  if (typeof assignment === "number") return assignment;
  if (typeof assignment === "string") {
    const n = parseInt(assignment, 10);
    return Number.isNaN(n)
      ? null
      : n;
  }
  return (
    assignment.userId ??
    assignment.user_id ??
    assignment.assignedTo ??
    assignment.assigned_to_id ??
    assignment.assignedToUserId ??
    assignment.assigned_to ??
    assignment.user?.id ??
    assignment.id ??
    null
  );
}

export function extractItemPayload(item) {
  return item?.data ?? item;
}

export function getEmailFromAddress(item) {
  const d = extractItemPayload(item);
  const from = d.from;
  if (!from || typeof from !== "object") return null;
  const keys = Object.keys(from);
  return keys[0]
    ? keys[0].toLowerCase()
    : null;
}

export function isInbound(item) {
  const d = extractItemPayload(item);
  if (d.direction === 0 || d.direction === "0") return true;
  if (String(d.direction).toLowerCase() === "inbound") return true;
  return false;
}

export function getMessageId(item) {
  const d = extractItemPayload(item);
  return d.id ?? d.messageId ?? item.timestamp;
}

export function parseUserId(me) {
  if (me == null) return null;
  if (typeof me === "number") return me;
  return (
    me.id ??
    me.user_id ??
    me.userId ??
    me.user?.id ??
    null
  );
}

export function sameUserId(a, b) {
  if (a == null || b == null) return false;
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na === nb;
  return String(a) === String(b);
}

export function getMessageTs(item) {
  const d = extractItemPayload(item);
  const raw = item.timestamp ?? d.date ?? d.createdAt;
  if (typeof raw === "number") {
    return raw < 1e12
      ? raw * 1000
      : raw;
  }
  const t = Date.parse(raw);
  return Number.isNaN(t)
    ? Date.now()
    : t;
}
