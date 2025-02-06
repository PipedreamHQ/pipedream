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

  const [
    sdkResponse,
    setSdkResponse,
  ] = useState<unknown | undefined>(undefined);

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
          sdkResponse={sdkResponse}
          enableDebugging={true}
          onSubmit={async () => {
            try {
              const response = await client.runAction({
                userId,
                actionId: "slack-send-message",
                configuredProps,
                dynamicPropsId,
              });
              setSdkResponse(response)
            } catch (error) {
              console.error("Action run failed:", error);
            }
          }}
        />
      </FrontendClientProvider>
    </>
  );
}
