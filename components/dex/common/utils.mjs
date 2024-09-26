export default {
  getCurrentDatetime() {
    return new Date().toISOString()
      .slice(0, 19)
      .replace("T", " ") + "Z";
  },
  buildContactData(contactIds) {
    return contactIds?.map((contactId) => ({
      contact_id: contactId,
    })) || [];
  },
  cleanObject(o) {
    for (var k in o || {}) {
      if (typeof o[k] === "undefined") {
        delete o[k];
      }
    }
    return o;
  },
};
