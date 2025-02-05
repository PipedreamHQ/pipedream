"use client";

import { useState } from "react";
import { createFrontendClient } from "@pipedream/sdk/browser";
import {
  ComponentFormContainer, FrontendClientProvider,
} from "@pipedream/connect-react";
import { fetchToken } from "./actions";

export default function Home() {
  // const userId = "demo-32aaf9cd-5df0-4ffe-86b5-db43a61a842c"; //gmail-new-email-received
  const userId = "demo-937d4e64-100a-4e32-9dbb-a73c279e91b3"; // goole_sheets add new row
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
    sdkErrors,
    setSdkErrors,
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
          componentKey="google_sheets-add-single-row"
          configuredProps={configuredProps}
          onUpdateDynamicProps={handleDynamicProps}
          onUpdateConfiguredProps={setConfiguredProps}
          sdkErrors={sdkErrors}
          environment={client.getEnvironment()}
          onSubmit={async () => {
            try {
              const result = await client.runAction({
                userId,
                actionId: "google_sheets-add-single-row",
                configuredProps,
                dynamicPropsId,
              });
              setSdkErrors(result)
            } catch (error) {
              setSdkErrors(error as unknown)
              console.error("Action run failed:", error);
            }
          }}
        />
      </FrontendClientProvider>
    </>
  );
}
