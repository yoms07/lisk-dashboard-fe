export function isValidEthereumAddress(address: string): boolean {
  // Ethereum address regex pattern
  const ethereumAddressPattern = /^0x[a-fA-F0-9]{40}$/;

  // Check if the address matches the pattern
  return ethereumAddressPattern.test(address);
}
