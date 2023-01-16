import { createStore } from 'vuex'

export default createStore({
    state: {
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