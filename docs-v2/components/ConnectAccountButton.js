"use client";

import { useConnectSDK } from "./ConnectSDKContext";
import SDKButton from "./SDKButton";

export default function ConnectAccountButton() {
  const {
    actions, isTokenGenerated,
  } = useConnectSDK();

  return (
    <SDKButton
      onClick={actions.connectAccount}
      disabled={!isTokenGenerated}
    >
      Connect Account
    </SDKButton>
  );
}
