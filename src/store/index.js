import { createStore } from 'vuex'
const { CosmWasmClient } = require('secretjs');

export default createStore({
    state: {
        operator_url: "https://api.blackbox.cash",
        //operator_url: "http://localhost:3000",

        //MAINNET
        queryJs: new CosmWasmClient("https://lcd.spartanapi.dev"),
        chainId: "secret-4",
        token_address: "secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek",
        token_code_hash: "AF74387E276BE8874F07BEC3A87023EE49B0E7EBE08178C49D0A49C3C98ED60E",

        //TESTNET
        //queryJs: new CosmWasmClient("http://66.85.142.147:11317"),
        //chainId: "pulsar-2",
        //token_address: "secret12uqy5szfp62c55wp7ft24fu7de0c6xw3tz5hr6",
        //token_code_hash: "7a155a3514f403c44db71f49e2a555bdfa90ff67e2011544f717a54a16ff2b06",
        
        cloak_address: "secret132u3k3snt949r2kvetj6j2csjketjaz3lgrlez",
        cloak_code_hash: "7ec1e44a473eb58404ce4b3b5e2efa3435e8da0b6e7743a75d33115308049a70",
        deaddrop_address: "secret17sx7jrdwr2uy6n3uzk5tykdgydp73mwsfhpenw",
        deaddrop_code_hash: "f7b091ee44afe253981a74d846ed1b59a166b18e1edd8040c60ae53ebc5faf8c",

        //DO NOT CHANGE
        key_history: JSON.parse(localStorage.getItem('cloak_key_history')) || [],
        secretJs: null,
      },
    mutations: {
        UPDATE_SIGNER(state, payload){
            state.secretJs = payload
        },
        UPDATE_KEY_HISTORY(state, payload){
            state.key_history.push(payload);
            localStorage.setItem('cloak_key_history', JSON.stringify(state.key_history))
        }
    },
    actions: {
        setSigningClient(context, payload) {
            context.commit('UPDATE_SIGNER', payload)
        },
        addKeyHistory(context, payload){
            context.commit('UPDATE_KEY_HISTORY', payload)
        }
    },
    getters: {
        hasSigningClient: function (state) {
            if (!state.secretJs) {
                return false;
            }
            return true;
        },
        getAddress: function (state) {
            if (!state.secretJs) {
                return undefined;
            }
            return state.secretJs.senderAddress;
        },
        getKeyHistory: function (state) {
            if (!state.secretJs) {
                return false;
            }
            return true;
        }
    }
})