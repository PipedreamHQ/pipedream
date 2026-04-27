import test from "node:test";
import assert from "node:assert/strict";
import { formatContact } from "./contact-output.mjs";
import { formatCompany } from "./company-output.mjs";
import {
  formatLead, formatPrimaryAccount,
} from "./lead-output.mjs";

test("formatContact includes Nutshell getContact email and phone keys", () => {
  const raw = {
    id: 42,
    entityType: "Contacts",
    email: {
      0: "a@b.com",
      assistant: "asst@b.com",
    },
    phone: {
      "7": {
        countryCode: "1",
        number: "209-230-4682",
        extension: null,
      },
      "--primary": {
        countryCode: "1",
        number: "209-230-4682",
        extension: null,
      },
    },
  };
  const out = formatContact(raw);
  assert.deepEqual(out.email, raw.email);
  assert.deepEqual(out.phone, raw.phone);
  assert.equal(out.id, 42);
  assert.equal(out.entityType, "Contacts");
});

test("formatContact still passes stub-style primaryEmail when present", () => {
  const raw = {
    id: 1,
    entityType: "Contacts",
    primaryEmail: "stub@example.com",
    displayName: "Not in allowlist",
  };
  const out = formatContact(raw);
  assert.equal(out.primaryEmail, "stub@example.com");
  assert.equal("displayName" in out, false);
});

test("formatCompany includes Nutshell getAccount email and phone keys", () => {
  const raw = {
    id: 7,
    name: "Acme",
    entityType: "Accounts",
    email: {
      0: "jhalpert@nutshell.com",
      assistant: "dschrute@dunder-mifflin.com",
    },
    phone: {
      home: {
        countryCode: "1",
        number: "995-505-7619",
        extension: null,
      },
    },
  };
  const out = formatCompany(raw);
  assert.deepEqual(out.email, raw.email);
  assert.deepEqual(out.phone, raw.phone);
});

test("formatCompany formats nested contacts with email and phone", () => {
  const raw = {
    id: 1,
    name: "Co",
    entityType: "Accounts",
    contacts: [
      {
        id: 99,
        entityType: "Contacts",
        email: {
          0: "c@d.com",
        },
        phone: {
          "--primary": {
            countryCode: "1",
            number: "111",
            extension: null,
          },
        },
      },
    ],
  };
  const out = formatCompany(raw);
  assert.equal(out.contacts.length, 1);
  assert.deepEqual(out.contacts[0].email, {
    0: "c@d.com",
  });
  assert.equal(out.contacts[0].phone["--primary"].number, "111");
});

test("formatLead passes value and primaryContact (full getLead shape)", () => {
  const raw = {
    id: 1000,
    entityType: "Leads",
    name: "Lead-1000",
    value: {
      currency: "USD",
      amount: "5000",
    },
    customFields: {
      "Tracking #": "T1",
    },
    primaryContact: {
      id: 3,
      entityType: "Contacts",
      name: {
        displayName: "Jane",
      },
      email: {
        0: "jane@example.com",
      },
    },
    sources: [
      {
        id: 1,
      },
    ],
    activitiesCount: {
      "0": 1,
      "1": 0,
      "2": 0,
      "-1": 0,
    },
  };
  const out = formatLead(raw);
  assert.deepEqual(out.value, raw.value);
  assert.equal(out.customFields["Tracking #"], "T1");
  assert.equal(out.primaryContact.name.displayName, "Jane");
  assert.deepEqual(out.primaryContact.email, raw.primaryContact.email);
  assert.equal(out.sources.length, 1);
  assert.equal(out.activitiesCount["0"], 1);
});

test("formatPrimaryAccount includes account email and phone for lead primaryAccount", () => {
  const raw = {
    id: 2,
    name: "Account Co",
    email: {
      0: "info@acme.com",
    },
    phone: {
      "--primary": {
        countryCode: "1",
        number: "333",
        extension: null,
      },
    },
  };
  const out = formatPrimaryAccount(raw);
  assert.deepEqual(out.email, raw.email);
  assert.deepEqual(out.phone, raw.phone);
});
