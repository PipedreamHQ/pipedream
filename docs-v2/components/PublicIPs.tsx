import publicIps from "./publicNodeIps.json";

// Create a React component to display the public IPs in a code block, one IP on each line
export default function PublicIPs() {
  return (
    <pre className="mt-4 nx-bg-primary-700/5 nx-mb-4 nx-overflow-x-auto nx-rounded-xl nx-subpixel-antialiased dark:nx-bg-primary-300/10 nx-text-[.9em] contrast-more:nx-border contrast-more:nx-border-primary-900/20 contrast-more:nx-contrast-150 contrast-more:dark:nx-border-primary-100/40 nx-py-4">
      {publicIps.map((ip) => (
        <code key={ip}>{ip}</code>
      ))}
    </pre>
  );
}
