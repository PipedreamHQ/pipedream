import app from "../../tmetric.app.mjs";

export default {
  key: "tmetric-modify-time-entry",
  name: "Modify Time Entry",
  description: "Modify the specified Time Entry. [See the documentation](https://app.tmetric.com/api-docs/?_gl=1*n76hcy*_gcl_aw*R0NMLjE3NjQwOTU2MDguQ2owS0NRaUF4SlhKQmhEX0FSSXNBSF9KR2pncU8zZzgxcHp3VUhQWGdjazEyUWFTaThXeE00ZTBUZ1hvak5ma1AzeG10a1pGYWJuek8wOGFBbC1KRUFMd193Y0I.*_gcl_au*MjU2MzU4NTI3LjE3NjQwOTU2MDg.*_ga*ODE4ODUyMDE2LjE3NjQwOTU2MDM.*_ga_66EFKVJKC5*czE3NjQwOTU2MDMkbzEkZzEkdDE3NjQwOTYyODkkajQzJGwwJGgw#/Time%20Entries/put-accounts-accountId-timeentries-timeEntryId)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    timeEntryId: {
      propDefinition: [
        app,
        "timeEntryId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    startTime: {
      propDefinition: [
        app,
        "startTime",
      ],
    },
    endTime: {
      propDefinition: [
        app,
        "endTime",
      ],
    },
    note: {
      propDefinition: [
        app,
        "note",
      ],
    },
    isBillable: {
      propDefinition: [
        app,
        "isBillable",
      ],
    },
    isInvoiced: {
      propDefinition: [
        app,
        "isInvoiced",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.modifyTimeEntry({
      $,
      accountId: this.accountId,
      timeEntryId: this.timeEntryId,
      data: {
        startTime: this.startTime ?? "",
        endTime: this.endTime ?? "",
        note: this.note,
        isBillable: this.isBillable,
        isInvoiced: this.isInvoiced,
      },
    });
    $.export("$summary", "Successfully modified the time entry with ID: " + this.timeEntryId);
    return response;
  },
};
