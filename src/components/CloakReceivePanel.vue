<template>
    <form class="action-box controls">
        <div class="input-section">
            <div v-html="getStatus()" />
            <div class="tx-type-section">
                <span class="unselected pointer" v-on:click="ToSend">Send</span>
                <span> / </span>
                <span class="selected">Receive</span>
            </div>
            <h1>TX Key</h1>
            <input type="text" v-model="state.tx_key" placeholder="..." required>

            <h1>Recipient</h1>
            <input type="text" v-model="state.destination" placeholder="secret1..." required>

            <div class="withdraw pointer"><a v-on:click="ToCancel">(Cancel Pending Transactions)</a></div>
        </div>
        <div class="txbutton" v-if="!state.loading">
            <a @click=ExecuteCloak><TxSubmit text="Receive" /></a>
        </div>
        <div class="spinner" v-else>
            <i class="c-inline-spinner" />
        </div>
        <div class="fee"></div>
        <img class="return pointer" src="@/assets/BackArrow.svg" alt="Back" v-on:click="ReturnHome">
    </form>
</template>



<script>
import { getSigningClient, isValidAddress } from '../utils/keplrHelper'
import TxSubmit from './TxSubmit.vue'
import { useToast } from "vue-toastification";
import axios from "axios";

export default {
    name: 'CloakReceivePanel',
    components: {
        TxSubmit
    },
    data() {
        return {
            state: {
                loading: false,
                tx_key: "",
                destination: "",
                status: false,
                loadingStatus: true,
            }
        }
    },
    setup() {
        // Get toast interface
        const toast = useToast();

        // Make toast available inside methods
        return { toast }
    },
    mounted:function(){
        this.CheckStatus() // CheckStatus will execute at pageload
    },
    methods: {
        getStatus(){
            if (( this.state.loadingStatus)) {
                return '<div><span>Service Status:</span> <i class="c-inline-spinner" /></div>'
            }
            if ((this.state.status)){
                return  '<div><span>Service Status:</span> <span style="color: green">Operational</span></div>'
            }
            else return '<div><span>Service Status:</span> <span style="color: red">Offline</span></div>'
        },
        ReturnHome: function() {
            this.$emit('ReturnHome')
        },
        ToSend: function() {
            this.$emit('UseCloak')
        },
        ToCancel: function() {
            this.$emit('UseCancel')
        },
        ExecuteCloak: async function() {
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

                //cancel if recipient is not a valid address
                if (!this.state.destination.trim() || !isValidAddress(this.state.destination.trim())){
                    this.toast.error(`Invalid Recipient Address: ${this.state.destination.trim()}`, {
                        timeout: 6000
                    })
                                        
                    //show button again
                    this.state.loading=false;

                    return false;
                }

                //ensure signing client is in global state
                if (!this.$store.getters.hasSigningClient){
                    this.$store.dispatch("setSigningClient", await getSigningClient("secret-4"));
                }
                
                //show processing toast
                this.toast("Transaction Processing...", {
                    id: "tx-processing",
                    timeout: false,
                    closeButton: false
                });

                //send request to backend
                const response = await axios.get(`${this.$store.state.operator_url}/release?txkey=${this.state.tx_key.trim()}&sender=${this.state.destination.trim()}`)
                console.log(response)

                //show button again
                this.toast.dismiss("tx-processing");
                this.state.loading=false;

                //handle non breaking errors
                if (response.status !== 200){
                    throw `Invalid Response: ${response.data?.message}`
                }

                if (response.data.code){
                    throw `Transaction Failed: ${response.data.raw_log}`
                }

                //show success toast if no error was thrown
                this.toast.success("Transaction Succeeded!", {
                    timeout: 8000
                });

            } catch(e) {
                console.error(e);

                let errorMsg = e.response?.data?.message || e.toString()
                if (errorMsg.includes('Network Error')) errorMsg = 'Failed to contact the Cloak API. Please try again or contact Trivium.';

                //dismiss processing toast
                this.toast.dismiss("tx-processing");

                //show error toast
                this.toast.error(`${errorMsg}`, {
                    timeout: 8000
                })
                                    
                //show button again
                this.state.loading=false;
            }

        },
        CheckStatus: async function() {
            try{
                //replace button with spinner
                this.state.loadingStatus = true;
                //send request to backend
                const response = await axios.get(`${this.$store.state.operator_url}/release/status`)
                console.log(response)

                //handle non breaking errors
                if (response.status !== 200){
                    this.state.status = false;
                    this.state.loadingStatus = false;
                    return;
                }

                if (!response.data.status){
                    this.state.status = false;
                    this.state.loadingStatus = false;
                    return;
                }

                this.state.status = true;
                this.state.loadingStatus = false;

            } catch(e) {
                const errorMsg = e.response?.data?.message || e.toString()
                //log error to console
                console.error(errorMsg)
                this.state.loadingStatus=false;
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


.tx-type-section {
    position: fixed;
    transform: translate(21vh, -8vh);

}


.selected {
    color: #2c3e50;
}

.unselected:hover {
    filter: brightness(25%);
}

</style>