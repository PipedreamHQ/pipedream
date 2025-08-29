import { ConfigurableProps } from "@pipedream/sdk";
import { useComponent } from "../hooks/use-component";
import {
  ComponentForm, type ComponentFormProps,
} from "./ComponentForm";

// given
// key: string // in future, can be [@<owner>/]<key>[@<version>] -- for now just key
// load a component and pass it down
type ComponentFormContainerProps<T extends ConfigurableProps> = Omit<ComponentFormProps<T>, "component"> & {
  componentKey: string;
} & (
    // Either externalUserId or userId must be provided
    | { externalUserId: string; userId?: never }
    | { userId: string; externalUserId?: never }
  );

export function ComponentFormContainer<T extends ConfigurableProps>(props: ComponentFormContainerProps<T>) {
  const {
    isLoading,
    error,
    component,
  } = useComponent({
    key: props.componentKey,
  });

  if (!props.componentKey) {
    throw new Error("componentKey required");
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!component) {
    return <p>Component not found</p>;
  }

  // TODO move / improve lib.ts and make sure V1Component and it match / are shared
  return <ComponentForm component={component} {...props} />;
}
