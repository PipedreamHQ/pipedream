"use client";

import { useConnectSDK } from "./ConnectSDKContext";
import SDKButton from "./SDKButton";

export default function GenerateTokenButton() {
  const {
    actions, tokenLoading,
  } = useConnectSDK();

  return (
    <SDKButton
      onClick={actions.generateToken}
      loading={tokenLoading}
    >
      Generate Token
    </SDKButton>
  );
}
