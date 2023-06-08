import { SigningCosmWasmClient } from 'secretjs';
import retry from 'async-await-retry';
const textEncoding = require('text-encoding');
const TextDecoder = textEncoding.TextDecoder;
//const encoding_1 = require("@iov/encoding");

export const sleep = duration => new Promise(res => setTimeout(res, duration));

export class ExtendedSender extends SigningCosmWasmClient {

    AsyncTxById = async(txHash) => {
        const res = await this.restClient.txById(txHash);
        let logs = {};
        console.log("res", res);
        res.logs[0].events[1].attributes.map((obj) => { logs[obj.key.trim()] = obj.value.trim() });
        res.wasm_logs=logs;
        return {
            ...res,
            transactionHash: txHash,
        };
    }

    //convert tx logs into key-value pairs
    processLogs = (tx) => {
        let logs = {};
        let wasmLogs = {};

        tx.logs[0].events.map((obj) => { logs[obj.type.trim()] = obj.attributes });

        logs.wasm.map((obj) => { 
            //logs.wasm[obj.key.trim()] = obj.value.trim()
            wasmLogs[obj.key.trim()] = obj.value.trim()
        });
        logs.wasm = wasmLogs;

        console.log("**TX LOGS**", logs)
        tx.kv_logs=logs;
        return tx;
    }

    //poll for if TX hash has been processed
    checkTx = async(txHash, interval=5000, retries=5) => {
        try {
            await sleep(3000);
            let res = await retry(
                () => {
                return this.restClient.txById(txHash);
                },
                undefined,
                { retriesMax: retries, interval: interval },
            );

            if (res.code){
                return {
                    ...res,
                    transactionHash: txHash,
                }; 
            }

            let data=this.decodeResponse(res);
            //data=this.processLogs(data);
            return {
                ...data,
                transactionHash: txHash,
            };

        } catch (e) {
            console.error(`Timed out while waiting for transaction: ${e}`);
            throw(`Timed out while waiting for transaction: ${e}`)
            //let error = new CustomError(`Timed out while waiting for transaction`);
            //error.txHash = tx.transactionHash;
            //throw e;
        }
    }

  decodeResponse = (tx) => {
    if (new TextDecoder().decode(tx.data)){
      tx.data = JSON.parse(new TextDecoder().decode(tx.data));
    }

    return tx;
  }
}