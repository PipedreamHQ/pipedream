function buildClientUpdateBody(client, changes = {}) {
  return {
    name: changes.name ?? client.name,
    address: changes.address ?? client.address,
    note: changes.note ?? client.note,
    archived: changes.archived ?? client.archived,
    // Not editable through these actions, but still part of the replaced resource
    email: client.email,
    ccEmails: client.ccEmails,
    currencyId: client.currencyId,
  };
}

function buildProjectFilter(projectIds) {
  return {
    contains: "CONTAINS",
    ids: projectIds ?? [],
    status: "ALL",
  };
}

export default {
  buildClientUpdateBody,
  buildProjectFilter,
};
