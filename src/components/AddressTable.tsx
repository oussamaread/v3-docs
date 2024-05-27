import React from "react";
import {
  chainAddresses,
  chainMetadata,
  CoreMainnets,
  CoreTestnets,
} from "@hyperlane-xyz/registry";

export type Environment = "testnet" | "mainnet";

type Props<K extends string> = {
  contract: K;
  environment: Environment;
};

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function camelToTitle(camelCaseString: string) {
  return camelCaseString
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function getChainNames(environment: Environment): string[] {
  return environment === "mainnet" ? CoreMainnets : CoreTestnets;
}

function getChainMetadata(chain: string) {
  const metadata = chainMetadata[chain];
  if (!metadata || !metadata.blockExplorers || metadata.blockExplorers.length === 0) {
    return null;
  }
  return metadata;
}

function AddressTableRow<K extends string>({
  chain,
  contract,
}: {
  chain: string;
  contract: K;
}) {
  const address = chainAddresses[chain]?.[contract];
  if (!address) return null;

  const metadata = getChainMetadata(chain);
  if (!metadata) return null;

  const explorer = metadata.blockExplorers[0].url;
  const url = new URL(explorer);

  return (
    <tr key={chain}>
      <td>{metadata.displayName ?? capitalize(chain)}</td>
      <td>{metadata.domainId}</td>
      <td>
        <code>{address}</code>
      </td>
      <td>
        <a href={`${explorer}/address/${address}`} target="_blank" rel="noopener noreferrer">
          {url.hostname}
        </a>
      </td>
    </tr>
  );
}

export default function AddressTable<K extends string>({ contract, environment }: Props<K>) {
  const chainNames = getChainNames(environment);

  return (
    <table>
      <thead>
        <tr>
          <th>Chain</th>
          <th>Domain</th>
          <th>Address</th>
          <th>Explorer</th>
        </tr>
      </thead>
      <tbody>
        {chainNames.map((chain) => (
          <AddressTableRow key={chain} chain={chain} contract={contract} />
        ))}
      </tbody>
      <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        th {
          padding-top: 12px;
          padding-bottom: 12px;
          text-align: left;
          background-color: #f2f2f2;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #ddd;
        }
      `}</style>
    </table>
  );
}
