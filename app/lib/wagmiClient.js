// lib/wagmiClient.js
import { createClient, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { sepolia } from "wagmi/chains";

const { provider, webSocketProvider } = configureChains(
  [mainnet, sepolia],
  [publicProvider()]
);

export const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});
