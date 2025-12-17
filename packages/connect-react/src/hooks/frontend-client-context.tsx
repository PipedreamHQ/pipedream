import {
  createContext, useContext, useState, type ReactNode, type FC,
} from "react";
import {
  QueryClient, QueryClientProvider,
} from "@tanstack/react-query";
import type { PipedreamClient } from "@pipedream/sdk/browser";

const FrontendClientContext = createContext<PipedreamClient | undefined>(
  undefined,
);

export const useFrontendClient = () => {
  const context = useContext(FrontendClientContext);

  if (!context) {
    throw new Error("Must be used inside FrontendClientProvider");
  }

  return context;
};

type FrontendClientProviderProps = { children: ReactNode; client: PipedreamClient; };

export const FrontendClientProvider: FC<FrontendClientProviderProps> = ({
  children,
  client,
}: FrontendClientProviderProps) => {
  // Use useState to ensure QueryClient is only created once per component instance
  const [
    queryClient,
  ] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 60,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <FrontendClientContext.Provider value={client}>
        {children}
      </FrontendClientContext.Provider>
    </QueryClientProvider>
  );
};
