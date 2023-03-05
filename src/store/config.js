import { CosmWasmClient } from "secretjs";

export const operator_url = "https://api.blackbox.cash";
//export const operator_url = "http://localhost:3000",

//MAINNET
export const queryJs = new CosmWasmClient("https://secret-4.api.trivium.network:1317");
export const chainId = "secret-4";
export const token_address = "secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek";
export const token_code_hash = "AF74387E276BE8874F07BEC3A87023EE49B0E7EBE08178C49D0A49C3C98ED60E";

//TESTNET
//queryJs = new CosmWasmClient("http://66.85.142.147:11317")
//chainId = "pulsar-2"
//token_address = "secret12uqy5szfp62c55wp7ft24fu7de0c6xw3tz5hr6"
//token_code_hash = "7a155a3514f403c44db71f49e2a555bdfa90ff67e2011544f717a54a16ff2b06"

export const cloak_address = "secret132u3k3snt949r2kvetj6j2csjketjaz3lgrlez";
export const cloak_code_hash = "7ec1e44a473eb58404ce4b3b5e2efa3435e8da0b6e7743a75d33115308049a70";
export const deaddrop_address = "secret17sx7jrdwr2uy6n3uzk5tykdgydp73mwsfhpenw";
export const deaddrop_code_hash = "f7b091ee44afe253981a74d846ed1b59a166b18e1edd8040c60ae53ebc5faf8c";