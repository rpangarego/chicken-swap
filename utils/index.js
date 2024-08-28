export const formatAddress = (address) => {
  if (!address) return "No Address";
  return `${address.slice(0, 5)}...${address.slice(-3)}`;
};

export function isMetaMaskInstalled() {
  return typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;
}
