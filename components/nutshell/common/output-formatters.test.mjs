import test from "node:test";
import assert from "node:assert/strict";
import { formatContact } from "./contact-output.mjs";
import { formatCompany } from "./company-output.mjs";

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
