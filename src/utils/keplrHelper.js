import { Bech32 } from "@iov/encoding";
import { chainId, lcd, rpc } from "../store/config"

const { SecretNetworkClient } = require('secretjs');

async function suggestPulsar() {
    await window.keplr.experimentalSuggestChain({
        chainId: chainId,
        chainName: 'Secret Pulsar',
        rpc: rpc,
        rest: lcd,
        bip44: {
            coinType: 529,
        },
        coinType: 529,
        stakeCurrency: {
            coinDenom: 'SCRT',
            coinMinimalDenom: 'uscrt',
            coinDecimals: 6,
        },
        bech32Config: {
            bech32PrefixAccAddr: 'secret',
            bech32PrefixAccPub: 'secretpub',
            bech32PrefixValAddr: 'secretvaloper',
            bech32PrefixValPub: 'secretvaloperpub',
            bech32PrefixConsAddr: 'secretvalcons',
            bech32PrefixConsPub: 'secretvalconspub',
        },
        currencies: [
            {
                coinDenom: 'SCRT',
                coinMinimalDenom: 'uscrt',
                coinDecimals: 6,
            },
        ],
        feeCurrencies: [
            {
                coinDenom: 'SCRT',
                coinMinimalDenom: 'uscrt',
                coinDecimals: 6,
            },
        ],
        gasPriceStep: {
            low: 0.1,
            average: 0.25,
            high: 0.4,
        },
        features: ['secretwasm', "ibc-go", "ibc-transfer"],
    });
}

async function getSigningClient() {
    if (!window.keplr) throw 'Keplr Wallet not found. Is it enabled and unlocked?';

    if (chainId.includes('pulsar')){
        await suggestPulsar();
    }

    window.keplr.enable(chainId);
    const offlineSigner = window.getOfflineSigner(chainId);
    const encryptionUtils = window.getEnigmaUtils(chainId);
    const accounts = await offlineSigner.getAccounts();
    return new SecretNetworkClient({
        url: lcd,
        chainId,
        wallet: offlineSigner,
        walletAddress: accounts[0].address,
        encryptionUtils,
    })
}

function isValidAddress(address) {
    try {
      const { prefix, data } = Bech32.decode(address);
      if (prefix !== "secret") {
        return false;
      }
      return data.length === 20;
    } catch {
      return false;
    }
  }

function countDecimals(value) {
    if(Math.floor(value) === value) return 0;
    return value.toString().split(".")[1]?.length || 0; 
}

const gasPriceUscrt = 0.1;
function getFeeForExecute(gas) {
  return {
    amount: [{ amount: String(Math.floor(gas * gasPriceUscrt) + 1), denom: 'uscrt' }],
    gas: String(gas),
  };
}

export { getSigningClient, isValidAddress, countDecimals, getFeeForExecute }