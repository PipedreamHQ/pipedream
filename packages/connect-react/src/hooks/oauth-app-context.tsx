import { createContext, useContext, ReactNode } from "react";

export type OAuthAppContextValue = {
  oauthAppId?: string;
};

const OAuthAppContext = createContext<OAuthAppContextValue>({});

export const useOAuthAppContext = () => {
  return useContext(OAuthAppContext);
};

export type OAuthAppProviderProps = {
  children: ReactNode;
  oauthAppId?: string;
};

export function OAuthAppProvider({ children, oauthAppId }: OAuthAppProviderProps) {
  return (
    <OAuthAppContext.Provider value={{ oauthAppId }}>
      {children}
    </OAuthAppContext.Provider>
  );
}