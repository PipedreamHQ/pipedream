import zendesk from "../../zendesk.app.mjs";
import listTickets from "./list-tickets.mjs";

async function* paginateResults(items) {
  yield* items;
}

describe("zendesk list-tickets action", () => {
  test("exposes the Zendesk app under the Connect prop name", () => {
    expect(listTickets.props.zendesk).toBe(zendesk);
    expect(listTickets.props.zendesk.type).toBe("app");
    expect(Object.prototype.hasOwnProperty.call(listTickets.props, "app")).toBe(false);
  });

  test("lists tickets through the configured Zendesk app", async () => {
    const tickets = [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ];
    const paginate = jest.fn(() => paginateResults(tickets));
    const listTicketsFn = jest.fn();
    const step = {
      export: jest.fn(),
    };

    const result = await listTickets.run.call({
      zendesk: {
        paginate,
        listTickets: listTicketsFn,
      },
      sortBy: "updated_at",
      sortOrder: "desc",
      customSubdomain: "support",
      limit: 2,
    }, {
      $: step,
    });

    expect(paginate).toHaveBeenCalledWith({
      fn: listTicketsFn,
      args: {
        step,
        customSubdomain: "support",
        params: {
          sort_by: "updated_at",
          sort_order: "desc",
        },
      },
      resourceKey: "tickets",
      max: 2,
    });
    expect(result).toEqual(tickets);
    expect(step.export).toHaveBeenCalledWith(
      "$summary",
      "Successfully retrieved 2 tickets",
    );
  });

  test("returns an empty list and exports a zero-ticket summary", async () => {
    const paginate = jest.fn(() => paginateResults([]));
    const step = {
      export: jest.fn(),
    };

    const result = await listTickets.run.call({
      zendesk: {
        paginate,
        listTickets: jest.fn(),
      },
    }, {
      $: step,
    });

    expect(result).toEqual([]);
    expect(step.export).toHaveBeenCalledWith(
      "$summary",
      "Successfully retrieved 0 tickets",
    );
  });
});
