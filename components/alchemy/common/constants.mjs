const NETWORKS = [
  "ETH_MAINNET",
  "ETH_SEPOLIA",
  "ETH_HOLESKY",
  "ARBMAINNET",
  "ARBSEPOLIA",
  "ARBNOVA_MAINNET",
  "MATICMAINNET",
  "MATICMUMBAI",
  "OPTMAINNET",
  "OPTGOERLI",
  "BASE_MAINNET",
  "BASE_SEPOLIA",
  "ZKSYNC_MAINNET",
  "ZKSYNC_SEPOLIA",
  "LINEA_MAINNET",
  "LINEA_SEPOLIA",
  "GNOSIS_MAINNET",
  "GNOSIS_CHIADO",
  "FANTOM_MAINNET",
  "FANTOM_TESTNET",
  "METIS_MAINNET",
  "BLAST_MAINNET",
  "BLAST_SEPOLIA",
  "SHAPE_SEPOLIA",
  "ZETACHAIN_MAINNET",
  "ZETACHAIN_TESTNET",
  "WORLDCHAIN_MAINNET",
  "WORLDCHAIN_SEPOLIA",
  "BNB_MAINNET",
  "BNB_TESTNET",
  "AVAX_MAINNET",
  "AVAX_FUJI",
  "SONEIUM_MINATO",
  "GEIST_POLTER",
];

const FULL_BLOCK_RECEIPTS = `
{
  block {
    hash,
    number,
    timestamp,
    logs(filter: {addresses: [], topics: []}) {
      data,
      topics,
      index,
      account {
        address
      },
      transaction {
        hash,
        nonce,
        index,
        from {
          address
        },
        to {
          address
        },
        value,
        gasPrice,
        maxFeePerGas,
        maxPriorityFeePerGas,
        gas,
        status,
        gasUsed,
        cumulativeGasUsed,
        effectiveGasPrice,
        createdContract {
          address
        }
      }
    }
  }
}
`;

export default {
  NETWORKS,
  FULL_BLOCK_RECEIPTS,
};
