<template>
    <button v-bind:class="getClass()" v-bind:disabled="this.$store.getters.hasSigningClient" v-html="getContents()" v-on:click="ConnectWallet" >
    </button>
</template>


<script>
import { getSigningClient } from '../utils/keplrHelper'
import { useToast } from "vue-toastification";

export default {
    name: 'WalletButton',
    data() {
        return {
            state: {
                loading: false,
            },
        }
    },
    setup() {
        // Get toast interface
        const toast = useToast();

        // Make it available inside methods
        return { toast }
    },
    methods:{
        getClass(){
            return {
                '': this.$store.getters.hasSigningClient,  
                'enabled': !this.$store.getters.hasSigningClient}
        },
        getContents(){
            if ((this.$store.getters.hasSigningClient)){
                return  this.$store.getters.getAddress
            }
            else return "Connect Wallet"
        },
        ConnectWallet: async function() {
            console.log('HELLO');
            try{
                //replace button with spinner
                this.state.loading=true;

                //ensure signing client is in glibal state
                if (!this.$store.getters.hasSigningClient){
                    this.$store.dispatch("setSigningClient", await getSigningClient());
                }

                //show button again
                this.state.loading=false;

            } catch(e) {
                this.toast.error(`${e}`, {
                    timeout: 8000
                })

                //show button again
                this.state.loading=false;
            }
        }
    }
}
</script>


<style scoped>

    /* From cssbuttons.io by @adamgiebl */
    button {
        --green: #cff8fb;
        font-size: 14px;
        padding: 0.3em 0.7em;
        letter-spacing: 0.06em;
        position: relative;
        font-family: inherit;
        border-radius: 0.6em;
        overflow: hidden;
        transition: all 0.3s;
        line-height: 1.4em;
        border: 2px solid var(--green);
        background: linear-gradient(to right, rgba(27, 238, 253, 0.1) 1%, transparent 40%,transparent 60% , rgba(27, 238, 253, 0.1) 100%);
        color: var(--green);
        box-shadow: inset 0 0 10px rgba(27, 253, 242, 0.4), 0 0 9px 3px rgba(27, 245, 253, 0.1);

        margin: 6vh;
        width: auto;
        height: 5vh;
        font-size: 2vh;


    }


    button:hover {
        color: #cff8fb;
        box-shadow: inset 0 0 10px rgba(27, 253, 242, 0.6), 0 0 9px 3px rgba(27, 227, 253, 0.2);
    }

    button:before {
        content: "";
        position: absolute;
        left: -4em;
        width: 4em;
        height: 100%;
        top: 0;
        transition: transform .4s ease-in-out;
        background: linear-gradient(to right, transparent 1%, rgba(27, 238, 253, 0.1) 40%,rgba(27, 245, 253, 0.1) 60% , transparent 100%);
    }

    button:hover:before {
        transform: translateX(15em);
    }


    .maintText {
        font-size: 1.5vh;
        color: rgb(255, 65, 65);
    }
  

    .enabled {
        cursor: pointer;
    }


</style>