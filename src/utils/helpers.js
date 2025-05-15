import axios from "axios"
import { lcd, chainId } from "../store/config"

export const getKeyHistory = () => {
    const result = localStorage.getItem('cloak_key_history')
    return result ? JSON.parse(result) : []
}

/**
 * Fetches 10 random addresses from LCD.
 * @returns {Promise<string[]>} Array of random addresses.
 */
export const getDecoys = async () => {
    const url = `${lcd}/cosmos/auth/v1beta1/accounts`
    const {data} = await axios.get(url)

    const addresses = data.accounts.map(a=>a.address);
    const shuffled = addresses.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
   
    return selected;
}

/**
 * Fetches 10 recent, random users of the specified contract.
 * @param {string} contract
 * @returns {Promise<string[]>} Array of random addresses.
 */
 export const getDecoys2 = async (contract) => {
    const url = `${lcd}/cosmos/tx/v1beta1/txs?query=execute.contract_address='${contract}'`
    const {data} = await axios.get(url)

    console.log('Results:', data.txs.length);

    const addresses = data.txs.map(tx=>tx.body.messages[0].sender);
    const shuffled = addresses.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
   
    return selected;
}


/**
 * Fetches the balance of a snip20 token.
 * @param {SigningCosmWasmClient} client Signing client
 * @param {string} contract SNIP20 contract
 * @param {string} address Account address
 * @returns {Promise} Balance in base denom (no decimals)
 */
export const getBalance = async (client, contract, address) => {
    const key = await window.keplr.getSecret20ViewingKey(chainId, contract).catch(e=>console.error('Failed to get viewing key:', e.toString()));

    if (!key) return {
        balance: 0,
        needs_vk: true,
    }

    const query = {
        balance: {
            address,
            key,
        }
    };

    const {balance: {amount}} = await client.queryContractSmart(contract, query);
    console.log('GB Amount', amount);

    return {
        balance: amount,
        needs_vk: false,
    }
}