import assert from "node:assert/strict";
import {
  afterEach, mock, test,
} from "node:test";
import React, {
  useEffect, useState, type ReactNode,
} from "react";
import {
  cleanup, fireEvent, render, screen, waitFor,
} from "@testing-library/react";
import {
  useQueryClient, type QueryClient,
} from "@tanstack/react-query";
import { createFrontendClient } from "@pipedream/sdk/browser";
import type {
  Component, ConfigurableProps, DynamicProps,
} from "@pipedream/sdk";
import { ComponentForm } from "../src/components/ComponentForm";
import { ComponentFormContainer } from "../src/components/ComponentFormContainer";
import { FrontendClientProvider } from "../src/hooks/frontend-client-context";

const queryClients = new Set<QueryClient>();
afterEach(() => {
  cleanup();
  for (const client of queryClients) client.clear();
  queryClients.clear();
});

const component: Component = {
  key: "synthetic-action",
  name: "Synthetic action",
  version: "1.0.0",
  configurableProps: [
    {
      name: "variant",
      label: "Variant",
      type: "string",
      reloadProps: true,
    },
    {
      name: "title",
      label: "Title",
      type: "string",
    },
  ],
};

const snapshot: DynamicProps = {
  id: "synthetic-alpha",
  configurableProps: [
    ...component.configurableProps,
    {
      name: "details",
      label: "Details",
      type: "string",
    },
    {
      name: "enabled",
      label: "Enabled",
      type: "boolean",
      optional: true,
      default: true,
    },
    {
      name: "count",
      label: "Count",
      type: "integer",
      optional: true,
      default: 7,
    },
    {
      name: "choice",
      label: "Choice",
      type: "string",
      remoteOptions: true,
    },
  ],
};

const savedValues = {
  variant: "alpha",
  title: "Saved title",
  details: "Saved details",
  enabled: false,
  count: 0,
  choice: {
    __lv: {
      label: "Saved option",
      value: "saved",
    },
  },
};

function fixture() {
  const client = createFrontendClient({
    externalUserId: "synthetic-user",
    tokenCallback: async () => { throw new Error("Tests must not request a token"); },
  });
  const configure = mock.fn(async () => ({
    options: [
      {
        label: "Server option",
        value: "server",
      },
    ],
  }));
  const reload = mock.fn(async () => ({
    dynamicProps: snapshot,
  }));
  client.components.retrieve = mock.fn(async () => ({
    data: component,
  }));
  client.components.configureProp = configure;
  client.components.reloadProps = reload;

  // Clear query timers after observers unmount, without changing the package provider.
  function TrackCache() {
    const queryClient = useQueryClient();
    queryClient.setDefaultOptions({
      queries: {
        ...queryClient.getDefaultOptions().queries,
        gcTime: Infinity,
      },
    });
    useEffect(() => { queryClients.add(queryClient); }, [
      queryClient,
    ]);
    return null;
  }
  function Wrapper({ children }: { children: ReactNode }) {
    return <FrontendClientProvider client={client}>
      <TrackCache />
      {children}
    </FrontendClientProvider>;
  }
  return {
    configure,
    reload,
    wrapper: Wrapper,
  };
}

for (const controlled of [
  false,
  true,
]) {
  test(`restores saved fields and remote option identity (${controlled
    ? "controlled"
    : "uncontrolled"})`, async () => {
    const {
      configure, reload, wrapper,
    } = fixture();
    const updates: Record<string, unknown>[] = [];
    const dynamicUpdates = mock.fn();
    const submit = mock.fn();
    function Editor() {
      const [
        values,
        setValues,
      ] = useState<Record<string, unknown>>(savedValues);
      return <ComponentFormContainer<ConfigurableProps>
        externalUserId="synthetic-user"
        componentKey={component.key}
        configuredProps={values}
        initialDynamicProps={snapshot}
        onUpdateConfiguredProps={controlled
          ? (next) => {
            updates.push(next);
            setValues(next);
          }
          : undefined}
        onUpdateDynamicProps={dynamicUpdates}
        onSubmit={submit}
      />;
    }
    render(<Editor />, {
      wrapper,
    });

    assert.equal((await screen.findByLabelText("Details")).value, "Saved details");
    await waitFor(() => {
      assert.equal(screen.getByLabelText("Count").value, "0");
      assert.equal(screen.getByLabelText("Enabled").checked, false);
    });
    await waitFor(() => assert.ok(configure.mock.calls.length > 0));
    assert.ok(configure.mock.calls.every(({
      arguments: [
        input,
      ],
    }) => input.dynamicPropsId === "synthetic-alpha"));
    fireEvent.keyDown(screen.getByRole("combobox"), {
      key: "ArrowDown",
    });
    await screen.findByText("Server option");
    fireEvent.click(screen.getByRole("button", {
      name: /submit/i,
    }));
    await waitFor(() => assert.equal(submit.mock.calls.length, 1));
    assert.deepEqual(submit.mock.calls[0].arguments[0].configuredProps, savedValues);
    assert.ok(updates.every((values) => values.details === "Saved details" && values.count === 0 && values.enabled === false));
    assert.equal(reload.mock.calls.length, 0);
    assert.equal(dynamicUpdates.mock.calls.length, 0);
  });
}

test("reopens a saved snapshot under the same provider", async () => {
  const {
    reload, wrapper,
  } = fixture();
  function Editor() {
    const [
      open,
      setOpen,
    ] = useState(true);
    const [
      values,
      setValues,
    ] = useState<Record<string, unknown>>({
      title: "Saved title",
    });
    const [
      dynamicProps,
      setDynamicProps,
    ] = useState<DynamicProps>();
    return <>
      <button onClick={() => setOpen(!open)}>{open
        ? "Close editor"
        : "Open editor"}</button>
      {open && <ComponentForm<ConfigurableProps>
        component={component}
        externalUserId="synthetic-user"
        configuredProps={values}
        initialDynamicProps={dynamicProps}
        onUpdateConfiguredProps={setValues}
        onUpdateDynamicProps={setDynamicProps}
      />}
    </>;
  }
  render(<Editor />, {
    wrapper,
  });
  fireEvent.change(screen.getByLabelText("Variant"), {
    target: {
      value: "alpha",
    },
  });
  fireEvent.change(await screen.findByLabelText("Details"), {
    target: {
      value: "Written before closing",
    },
  });
  fireEvent.click(screen.getByRole("button", {
    name: "Close editor",
  }));
  assert.equal(screen.queryByLabelText("Details"), null);
  fireEvent.click(screen.getByRole("button", {
    name: "Open editor",
  }));
  assert.equal((await screen.findByLabelText("Details")).value, "Written before closing");
  assert.equal(reload.mock.calls.length, 1);
});

test("restores an optional reload field without manufacturing an edit", async () => {
  const {
    reload, wrapper,
  } = fixture();
  const optionalSnapshot: DynamicProps = {
    ...snapshot,
    configurableProps: snapshot.configurableProps.map((prop) => prop.name === "variant"
      ? {
        ...prop,
        optional: true,
      }
      : prop),
  };
  render(<ComponentForm
    component={component}
    externalUserId="synthetic-user"
    configuredProps={savedValues}
    initialDynamicProps={optionalSnapshot}
  />, {
    wrapper,
  });
  assert.equal((await screen.findByLabelText("Variant")).value, "alpha");
  assert.equal(screen.getByLabelText("Details").value, "Saved details");
  assert.equal(reload.mock.calls.length, 0);
  fireEvent.change(screen.getByLabelText("Variant"), {
    target: {
      value: "beta",
    },
  });
  await waitFor(() => assert.equal(reload.mock.calls.length, 1));
});

test("keeps a newer reload when the initial snapshot is echoed", async () => {
  const {
    reload, configure, wrapper,
  } = fixture();
  const nextSnapshot: DynamicProps = {
    id: "synthetic-beta",
    configurableProps: [
      ...component.configurableProps,
      {
        name: "beta",
        label: "Beta details",
        type: "string",
        default: "Beta default",
      },
      {
        name: "choice",
        label: "Choice",
        type: "string",
        remoteOptions: true,
      },
    ],
  };
  reload.mock.mockImplementation(async () => ({
    dynamicProps: nextSnapshot,
  }));
  const props = {
    component,
    externalUserId: "synthetic-user",
    configuredProps: savedValues,
  };
  const { rerender } = render(<ComponentForm {...props} initialDynamicProps={snapshot} />, {
    wrapper,
  });
  assert.equal(screen.getByLabelText("Details").value, "Saved details");
  fireEvent.change(screen.getByLabelText("Variant"), {
    target: {
      value: "beta",
    },
  });
  await screen.findByLabelText("Beta details");
  rerender(<ComponentForm {...props} initialDynamicProps={{
    ...snapshot,
  }} />);
  assert.equal(screen.queryByLabelText("Details"), null);
  assert.equal(screen.getByLabelText("Beta details").value, "Beta default");
  await waitFor(() => assert.ok(configure.mock.calls.some(({
    arguments: [
      input,
    ],
  }) => input.dynamicPropsId === "synthetic-beta")));
  assert.equal(reload.mock.calls.length, 1);
});

for (const identity of [
  "configuration",
  "component",
  "external user",
]) {
  test(`replaces the editing session for a keyed ${identity} change`, async () => {
    const {
      configure, wrapper,
    } = fixture();
    const { rerender } = render(<ComponentForm
      key="configuration-a"
      component={component}
      externalUserId="synthetic-user"
      configuredProps={savedValues}
      initialDynamicProps={snapshot}
    />, {
      wrapper,
    });
    await screen.findByLabelText("Details");
    const replacementComponent = identity === "component"
      ? {
        ...component,
        key: "synthetic-other-action",
        version: "2.0.0",
      }
      : component;
    const externalUserId = identity === "external user"
      ? "synthetic-other-user"
      : "synthetic-user";
    const replacement: DynamicProps = {
      id: "synthetic-replacement",
      configurableProps: [
        ...replacementComponent.configurableProps,
        {
          name: "replacement",
          label: "Replacement",
          type: "string",
        },
        {
          name: "choice",
          label: "Choice",
          type: "string",
          remoteOptions: true,
        },
      ],
    };
    configure.mock.resetCalls();
    rerender(<ComponentForm
      key="configuration-b"
      component={replacementComponent}
      externalUserId={externalUserId}
      configuredProps={{
        variant: "replacement",
        title: "Other title",
        replacement: "Other value",
        choice: savedValues.choice,
      }}
      initialDynamicProps={replacement}
    />);
    assert.equal(screen.queryByLabelText("Details"), null);
    assert.equal(screen.getByLabelText("Replacement").value, "Other value");
    await waitFor(() => assert.ok(configure.mock.calls.length > 0));
    assert.ok(configure.mock.calls.every(({
      arguments: [
        input,
      ],
    }) =>
      input.dynamicPropsId === "synthetic-replacement" && input.externalUserId === externalUserId && input.id === replacementComponent.key));
  });
}

test("does not apply a late initializer to an existing editing session", async () => {
  const {
    reload, wrapper,
  } = fixture();
  const props = {
    component,
    externalUserId: "synthetic-user",
    configuredProps: {
      variant: "alpha",
      title: "Static title",
    },
  };
  const { rerender } = render(<ComponentForm {...props} />, {
    wrapper,
  });
  rerender(<ComponentForm {...props} initialDynamicProps={snapshot} />);
  assert.equal(screen.queryByLabelText("Details"), null);
  assert.equal(screen.getByLabelText("Title").value, "Static title");
  assert.equal(reload.mock.calls.length, 0);
});
