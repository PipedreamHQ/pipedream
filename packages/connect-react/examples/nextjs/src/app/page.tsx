"use client";

import { useState } from "react";
import { createFrontendClient } from "@pipedream/sdk/browser";
import {
  ComponentFormContainer, FrontendClientProvider,
} from "@pipedream/connect-react";
import { fetchToken } from "./actions";

export default function Home() {
  const userId = "demo-32aaf9cd-5df0-4ffe-86b5-db43a61a842c"; //gmail-new-email-received
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

  const [
    errors,
    setErrors,
  ] = useState<unknown[] | unknown | undefined>(undefined);

  const handleDynamicProps = (dynamicProps: { id: string | undefined }) => {
    setDynamicPropsId(dynamicProps.id)
  }

  return (
    <>
      <div>My application</div>
      <FrontendClientProvider client={client}>
        <ComponentFormContainer
          userId={userId}
          componentKey="gmail-new-email-received"
          configuredProps={configuredProps}
          onUpdateDynamicProps={handleDynamicProps}
          onUpdateConfiguredProps={setConfiguredProps}
          sdkErrors={errors}
          onSubmit={async () => {
            try {
              const result = await client.actionRun({
                userId,
                actionId: "gmail-new-email-received",
                configuredProps,
                dynamicPropsId,
              });
              setErrors(result?.os)
            } catch (error) {
              setErrors(error as unknown)
              console.error("Action run failed:", error);
            }
          }}
        />
      </FrontendClientProvider>
    </>
  );
}
