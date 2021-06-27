import { Contract } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';
import { getAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';

const nf = new Intl.NumberFormat();

export function formatNumber(number) {
  return nf.format(Math.floor(number));
}

export function calculatePrice(price, value) {
  return formatNumber(value * price);
}

export function toWei(n) {
  return parseEther(n);
}

export function fromWei(n) {
  return n / BigNumber.from('1000000000000000000');
}

export function formatValue(value) {
  return fromWei(+value.toString()).toFixed(2);
}

export function toBN(n) {
  return BigNumber.from(n);
}

export async function etherBalance(addr, ethers) {
  return await ethers.provider.getBalance(addr);
}

// account is not optional
export function getSigner(library, account) {
  return library.getSigner(account);
}

export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library;
}

// export const getContract = (address, ABI, library, account) => {
//   return new Contract(address, ABI, getProviderOrSigner(library, account));
// };

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// account is optional
export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account));
}
