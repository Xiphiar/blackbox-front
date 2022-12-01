import { Bech32 } from "@iov/encoding";

const { BroadcastMode } = require('secretjs');
const { ExtendedSender } = require('./extendedSigner')

const customFees = {
    exec: {
        gas: "650000",
    }
}

async function suggestPulsar() {
    await window.keplr.experimentalSuggestChain({
        chainId: "pulsar-2",
        chainName: 'Secret Pulsar',
        rpc: "https://rpc.pulsar.griptapejs.com",
        rest: "https://api.pulsar.griptapejs.com",
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

async function getSigningClient(chainId) {
    let apiUrl = "https://lcd.spartanapi.dev"
    if (chainId.includes("ulsar")){
        await suggestPulsar();
        apiUrl = "http://66.85.142.147:11317"
    }
    window.keplr.enable(chainId);
    const offlineSigner = window.getOfflineSigner(chainId);
    const enigmaUtils = window.getEnigmaUtils(chainId);
    const accounts = await offlineSigner.getAccounts();
    return new ExtendedSender(
        apiUrl,
        accounts[0].address,
        offlineSigner,
        enigmaUtils,
        customFees,
        BroadcastMode.Sync
    )
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

export { getSigningClient, isValidAddress, countDecimals }