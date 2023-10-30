import { CosmWasmClient } from "secretjs";

if (!process.env.VUE_APP_CHAIN_ID) {
    alert('VUE_APP_CHAIN_ID is undefined')
    throw 'VUE_APP_CHAIN_ID is undefined'
}

export const operator_url = "https://api.blackbox.cash";

const MainnetConfig = {
    rpc: 'https://rpc.secret.express:443',
    lcd: 'https://lcd.secret.express:443',
    chainId: 'secret-4',
    sscrtAddress: "secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek",
    sscrtHash: "AF74387E276BE8874F07BEC3A87023EE49B0E7EBE08178C49D0A49C3C98ED60E",
    cloakAddress: "secret132u3k3snt949r2kvetj6j2csjketjaz3lgrlez",
    cloakHash: "7ec1e44a473eb58404ce4b3b5e2efa3435e8da0b6e7743a75d33115308049a70",
    deaddropAddress: "secret17sx7jrdwr2uy6n3uzk5tykdgydp73mwsfhpenw",
    deaddropHash: "f7b091ee44afe253981a74d846ed1b59a166b18e1edd8040c60ae53ebc5faf8c",
}

const TestnetConfig = {
    rpc: 'https://rpc.pulsar.scrttestnet.com',
    lcd: 'https://api.pulsar.scrttestnet.com',
    chainId: 'pulsar-3',
    sscrtAddress: "secret12uqy5szfp62c55wp7ft24fu7de0c6xw3tz5hr6",
    sscrtHash: "7a155a3514f403c44db71f49e2a555bdfa90ff67e2011544f717a54a16ff2b06",
}

const ChainConfig = process.env.VUE_APP_CHAIN_ID.includes('pulsar') ? TestnetConfig : MainnetConfig
export const queryJs = new CosmWasmClient(ChainConfig.lcd);

export const {
    rpc,
    lcd,
    chainId,
    sscrtAddress,
    sscrtHash,
    cloakAddress,
    cloakHash,
    deaddropAddress,
    deaddropHash
} = ChainConfig;