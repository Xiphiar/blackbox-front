<template>
    <form class="action-box controls">
        <div class="input-section">
            <h1>TX Key</h1>
            <input type="text" v-model="state.tx_key" placeholder="..." required>
        </div>
        <div class="txbutton" v-if="!state.loading">
            <a @click=ExecuteCancel><TxSubmit text="Cancel" /></a>
        </div>
        <div class="spinner" v-else>
            <i class="c-inline-spinner" />
        </div>
        <div class="fee"></div>
        <img class="return pointer" src="@/assets/BackArrow.svg" alt="Back" v-on:click="ReturnHome">
    </form>
</template>



<script>
import { getFeeForExecute, getSigningClient } from '../utils/keplrHelper'
import TxSubmit from './TxSubmit.vue'
import { useToast } from "vue-toastification";
import { cloakAddress } from '../store/config';

export default {
    name: 'CloakCancelPanel',
    components: {
        TxSubmit
    },
    data() {
        return {
            state: {
                loading: false,
                tx_key: ""
            }
        }
    },
    setup() {
      // Get toast interface
      const toast = useToast();

      // Make it available inside methods
      return { toast }
    },
    methods: {
        ReturnHome: function() {
            this.$emit('UseCloak')
        },
        ExecuteCancel: async function() {
            try{
                //replace button with spinner
                this.state.loading=true;

                //verify tx key is valid
                if (this.state.tx_key?.length !== 64){
                    this.toast.error(`Invalid TX Key: TX Key should be 64 characters.`, {
                        timeout: 8000
                    })
                    this.state.loading=false;
                    return;
                }

                //ensure signing client is in global state
                if (!this.$store.getters.hasSigningClient){
                    this.$store.dispatch("setSigningClient", await getSigningClient());
                }

                //message for the cloak contract
                const cloakMsg = {
                    exit_pool : {
                        tx_key: this.state.tx_key
                    }
                }; 

                //"Sync" broadcast mode returns tx hash only (or error if it failed to enter the mempool)
                let response = await this.$store.state.secretJs.execute(cloakAddress, cloakMsg, '', [], getFeeForExecute(80_000));
                if (response.code){
                    this.toast.error(`Transaction Failed: ${response.raw_log}`, {
                        timeout: 8000
                    })
                                        
                    //show button again
                    this.state.loading=false;

                    return false;

                } else {
                    this.toast("Transaction Processing...", {
                        id: "tx-processing",
                        timeout: false,
                        closeButton: false
                    });
                }

                //poll tx's endpoint every 4000ms up to 15 times to check when tx is processed. Returns full tx object
                let data = await this.$store.state.secretJs.checkTx(response.transactionHash,4000,15)
                console.log(data)
                this.toast.dismiss("tx-processing");
                                    
                //show button again
                this.state.loading=false;

                //if error
                if (data.code){
                    this.toast.error(`Transaction Failed: ${data.raw_log}`, {
                        timeout: 8000
                    })
                } else {
                    this.toast.success("Transaction Succeeded!", {
                        timeout: 8000
                    });
                }
            } catch(e) {
                this.toast.error(`Unknown error occured: ${e}`, {
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
@import "../assets/spinner.css";

.spinner {
    position: fixed;
    left: 50%;
    bottom: 15%;
    transform: translate(-50%, -50%);
    margin: 0 auto;

}

.withdraw {
    font-size: 90%;
    margin-top: 30px;

}
.withdraw:hover {
    filter: brightness(25%);
}



.input-section {
    padding-top: 20%;
}


input {
    border-radius: 26px;
    width: 50%;
    padding: 5px 15px 7px;
    font-size: 14px;
    text-align: center;
}



.txbutton {
    position: fixed;
    left: 50%;
    bottom: 20px;
    transform: translate(-50%, -50%);
    margin: 0 auto;

}

.txbutton:hover {
    filter: brightness(25%);
}


.fee {
    position: fixed;
    left: 50%;
    bottom: 20px;
    transform: translate(-50%, -50%);
    margin: 0 auto;
    
    
    
}

.return {
    position: fixed;
    left: 10%;
    bottom: 20px;
    transform: translate(-50%, -50%);
    margin: 0 auto;
    
}

.return:hover {
    filter: brightness(25%);
}

.pointer {
    cursor: pointer;
}




</style>