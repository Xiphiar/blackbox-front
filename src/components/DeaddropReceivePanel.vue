<template>
    <form class="action-box controls">
        <div class="input-section">
            <div class="tx-type-section">
                <span class="unselected pointer" v-on:click="ToSend">Send</span>
                <span> / </span>
                <span class="selected">Receive</span>
            </div>
            <h1>Alias</h1>
            <input type="text" placeholder="optional (limit 1 custom per user)" v-model="state.alias">
        </div>
        <div class="output-section" v-if="state.outAlias">
            <h2>Your alias is:</h2>
            <span class="output-alias">{{ state.outAlias }}</span>
        </div>
        <div class="txbutton" v-if="!state.loading">
            <a @Click=ExecuteReceive><TxSubmit text="Register" /></a>
        </div>
        <div class="spinner" v-else>
            <i class="c-inline-spinner" />
        </div>
        <div class="fee"></div>
        <img class="return pointer" src="@/assets/BackArrow.svg" alt="Back" v-on:click="ReturnHome">
    </form>
</template>



<script>
import { getSigningClient } from '../utils/keplrHelper'
import TxSubmit from './TxSubmit.vue'
import { useToast } from "vue-toastification";
import { deaddropAddress, sscrtAddress } from '../store/config';

export default {
    name: 'DeaddropReceivePanel',
    components: {
        TxSubmit
    },
    data() {
        return {
            state: {
                outAlias: null,
                loading: false,
                alias: null
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
            this.$emit('ReturnHome')
        },
        ToSend: function() {
            this.$emit('UseDeaddrop')
        },
        ExecuteReceive: async function() {
            try{
                this.state.loading= true;
                //ensure signing client is in glibal state
                if (!this.$store.getters.hasSigningClient){
                    this.$store.dispatch("setSigningClient", await getSigningClient());
                }

                //message for the deaddrop contract
                let setMsg;
                if (this.state.alias && this.state.alias.trim()){
                    setMsg = {
                        set_alias : {
                            alias: this.state.alias.trim()
                        }
                    }; 
                } else {
                    setMsg = {
                        set_alias : { }
                    };
                }
                console.log(setMsg)

                const sendMsg = {
                    send: {
                        amount: "0",
                        recipient: deaddropAddress, //deaddrop address
                        msg: Buffer.from(JSON.stringify(setMsg)).toString('base64')
                    }
                }

                this.toast("Transaction Processing...", {
                    id: "tx-processing",
                    timeout: false,
                    closeButton: false
                });

                let response = await this.$store.state.secretJs.tx.compute.executeContract({
                    sender: this.$store.state.secretJs.address,
                    contract_address: sscrtAddress,
                    msg: sendMsg,
                }, { gasLimit: 80_000 });

                this.toast.dismiss("tx-processing");
                
                if (response.code){
                    this.toast.error(`Transaction Failed: ${response.rawLog}`, {
                        timeout: 8000
                    })

                    return;
                }

                console.log(response)
                const wasmLogs = response.jsonLog[0].events.find(e => e.type === "wasm");
                const aliasAttribute = wasmLogs.attributes.find(e => e.key === "alias")?.value;

                this.toast.success("Transaction Succeeded!", {
                    timeout: 8000
                });
                
                if (!aliasAttribute) throw "Failed to fetch alias from transaction. Please check the TX logs in the F12 console."
                this.state.outAlias = aliasAttribute
                
            } catch(e) {
                console.error(e)
                this.toast.error(`${e}`, {
                    timeout: 8000
                })
            } finally {
                this.state.loading= false;
            }

        }
    }
    
}
</script>



<style scoped>
@import "../assets/spinner.css";




.tx-type-section {
    position: fixed;
    transform: translate(21vh, -8vh);

}



.input-section {
    padding-top: 20%;
}

.output-section {
    padding-top: 10%;
}

.output-alias {
    display: block;
    word-wrap: break-word;
    width: 90%;
    margin: auto;
}

.selected {
    color: #2c3e50;
}


.unselected:hover {
    filter: brightness(25%);
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

.spinner {
    position: fixed;
    left: 50%;
    bottom: 15%;
    transform: translate(-50%, -50%);
    margin: 0 auto;

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