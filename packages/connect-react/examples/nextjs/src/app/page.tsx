"use client";

import { useState } from "react";
import { createFrontendClient } from "@pipedream/sdk/browser";
import {
  ComponentFormContainer, FrontendClientProvider,
} from "@pipedream/connect-react";
import { fetchToken } from "./actions";

export default function Home() {
  const userId = "my-authed-user-id";
  const client = createFrontendClient({
    environment: "development",
    externalUserId: userId,
    tokenCallback: fetchToken,
  });
  const [
    configuredProps,
    setConfiguredProps,
  ] = useState({
    text: "hello slack!",
  });

  const [
    dynamicPropsId,
    setDynamicPropsId,
  ] = useState<string | undefined>();

  const handleDynamicProps = (dynamicProps: { id: string | undefined }) => {
    setDynamicPropsId(dynamicProps.id)
  }

  return (
    <>
      <div>My application</div>
      <FrontendClientProvider client={client}>
        <ComponentFormContainer
          userId={userId}
          componentKey="slack-send-message"
          configuredProps={configuredProps}
          onUpdateDynamicProps={handleDynamicProps}
          onUpdateConfiguredProps={setConfiguredProps}
          onSubmit={async () => {
            try {
              await client.actionRun({
                userId,
                actionId: "slack-send-message",
                configuredProps,
                dynamicPropsId,
              });
            } catch (error) {
              console.error("Action run failed:", error);
            }
          }}
        />
      </FrontendClientProvider>
    </>
  );
}
