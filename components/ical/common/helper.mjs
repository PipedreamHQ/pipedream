export default {
  caldavToIcs(xml) {
    const cdataBlocks = xml.match(/<!\[CDATA\[[\s\S]*?\]\]>/g) || [];
    const calendars = cdataBlocks
      .map((b) => b.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, ""))
      .map((s) => s.trim())
      .filter((s) => s.startsWith("BEGIN:VCALENDAR") && s.includes("END:VCALENDAR"));

    if (calendars.length === 0) {
      return "";
    }

    return calendars.join("\n");
  },
};
