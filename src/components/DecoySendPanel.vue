<template>
    <form class="action-box controls">
        <div class="input-section">
            <h1>Recipient Address</h1>
            <input type="text" placeholder="..." required v-model="state.destination">
            <h1>Amount</h1>
            <div class="balance">Balance: 
                <span v-if="!this.$store.getters.hasSigningClient">Connect Wallet</span>
                <span v-else-if="state.loading_balance"><i class="c-inline-spinner" /></span>
                <span v-else-if="state.needs_vk" style="color: red;">No View Key</span>
                <span v-else v-html="this.state.balance" />
            </div>
            <div class="dropdownContainer pointer" v-on:click="SelectToken">
                <img class="token" :src="TokenImage" alt="">
                <div class="bottomRight">▼</div>
            </div>
            <input type="text" :placeholder="TokenDenom" required v-model="state.amount">
        </div>
        <div class="txbutton" v-if="!state.loading">
            <a @Click=ExecuteSend><TxSubmit text="Send" /></a>
        </div>
        <div class="spinner" v-else>
            <i class="c-inline-spinner" />
        </div>
        <img class="return pointer" src="@/assets/BackArrow.svg" alt="Back" v-on:click="ReturnHome">
        <SNIP25Panel v-if="TokenSelect" v-on:ConfirmToken25="UseToken" v-on:WalletConnected="RefreshBalance" v-on:ReturnHome="CancelSelectToken" />
    </form>
</template>



<script>
import { getSigningClient, countDecimals } from '../utils/keplrHelper'
import TxSubmit from './TxSubmit.vue'
import SNIP25Panel from './SNIP25Panel.vue'
import { useToast } from "vue-toastification";
import snip25 from '../store/snip25.json'
import { getDecoys, getBalance } from '../utils/helpers'
import { queryJs } from '../store/config';




export default {
    name: 'DecoySendPanel',
    components: {
        TxSubmit,
        SNIP25Panel
    },
    data() {
        return {
            state: {
                loading: false,
                amount: undefined,
                destination: undefined,
                balance: undefined,
                loading_balance: true,
                needs_vk: false,
            },
            TokenSelect: false,
            TokenDenom: snip25[0].symbol,
            TokenAddress: snip25[0].address,
            TokenImage: `/tokenIcons/${snip25[0].image}`,
            TokenDecimals: snip25[0].decimals,

        }
    },
    setup() {
      // Get toast interface
      const toast = useToast();

      // Make it available inside methods
      return { toast }
    },
    mounted() {
        // 2. The DOM is ready to go now
        this.RefreshBalance();
    },
    computed: {
        isConnected() {
            return !!this.$store.state.secretJs;
        }
    },
    watch: {
        isConnected (newValue) {
            if (newValue) this.RefreshBalance();
        }
    },
    methods: {
        ReturnHome: function() {
            this.$emit('ReturnHome')
        },
        SelectToken: function() {
            this.TokenSelect = true
        },
        CancelSelectToken: function() {
            this.TokenSelect = false
        },
        UseToken: function(newDenom, newImg, newAddress, newDecimals) {
            this.TokenSelect = false
            this.TokenDenom = newDenom
            this.TokenImage = "/tokenIcons/" + newImg
            this.TokenAddress = newAddress
            this.TokenDecimals = newDecimals
            this.RefreshBalance()
        },
        RefreshBalance: async function() {
            if (!this.$store.state.secretJs?.address) return;
            try {
                this.state.loading_balance = true;

                const {balance, needs_vk} = await getBalance(queryJs, this.TokenAddress, this.$store.state.secretJs.address);
                if (needs_vk) {
                    this.state.needs_vk = true;
                    this.state.loading_balance = false;
                    return;
                } else {
                    this.state.needs_vk = false;
                }

                

                const humanAmount = parseInt(balance) / 10**(this.TokenDecimals)
                console.log('humanAmount', humanAmount);
                this.state.balance = humanAmount;
                this.state.loading_balance = false;
            } catch(e) {
                this.toast.error(`Error checking balance: ${e}`, {
                    timeout: 8000
                })
            }
        },
        ExecuteSend: async function() {
            try{
                //replace button with spinner
                this.state.loading=true;

                //ensure signing client is in global state
                if (!this.$store.getters.hasSigningClient){
                    this.$store.dispatch("setSigningClient", await getSigningClient());
                }

                //cancel if no destination
                console.log(this.state.destination);
                if (!this.state.destination || !this.state.destination.trim()){
                    this.toast.error(`Please enter a destination address.`, {
                        timeout: 6000
                    })
                    
                    //show button again
                    this.state.loading=false;

                    return false;
                }

                //cancel if invalid number
                if (!this.state.amount || !this.state.amount.trim() || isNaN(this.state.amount.trim())){
                    this.toast.error(`Invalid Amount: "${this.state.amount}"`, {
                        timeout: 6000
                    })
                    
                    //show button again
                    this.state.loading=false;

                    return false;
                }

                //cancel if more than token's decimals
                if (countDecimals(this.state.amount.trim()) > this.TokenDecimals){
                    this.toast.error(`Amount "${this.state.amount.trim()}" has too many decimals. ${this.TokenDenom} only has ${this.TokenDecimals} decimal places.`, {
                        timeout: 6000
                    })
                    
                    //show button again
                    this.state.loading=false;

                    return false;
                }

                this.toast("Fetching Decoys...", {
                    id: "get-decoys",
                    timeout: false,
                    closeButton: false
                });
                // Get Decoy Addresses
                const decoys = await getDecoys(this.TokenAddress);
                console.log(decoys);
                this.toast.dismiss("get-decoys");

                //set amount in uTOKEN
                const amount = this.state.amount.trim() * 10**(this.TokenDecimals)

                //message for the snip25 contract
                const snip25Handle = {
                    transfer: {
                        recipient: this.state.destination.trim(),
                        amount: amount.toString(),
                        decoys,
                    }
                }; 

                this.toast("Transaction Processing...", {
                    id: "tx-processing",
                    timeout: false,
                    closeButton: false
                });
                
                let response = await this.$store.state.secretJs.tx.compute.executeContract({
                    sender: this.$store.state.secretJs.address,
                    contract_address: this.TokenAddress,
                    msg: snip25Handle,
                }, { gasLimit: 160_000 });

                this.toast.dismiss("tx-processing");

                if (response.code) {
                    console.error(response.rawLog)
                    this.toast.error(`Transaction Failed: ${response.rawLog}`, {
                        timeout: 8000
                    })

                    //stop execution
                    return false;
                }

                this.toast.success("Transaction Succeeded!", {
                    timeout: 8000
                });
            } catch(e) {
                this.toast.error(`Unknown error occured: ${e}`, {
                    timeout: 8000
                })
                this.toast.dismiss("get-decoys");
                this.toast.dismiss("tx-processing");
            } finally {
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



.tx-type-section {
    position: fixed;
    transform: translate(21vh, -8vh);

}

.token {
    width: 50px;  
    height: auto;  
    position: fixed;
    transform: translate(-125%, -20%);
}


.input-section {
    padding-top: 20%;
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

.dropdownContainer {
  position: fixed;
  transform: translate(135%);
  text-align: center;
  color: white;
  width: 50px;
  height: 50px;
}
.dropdownContainer:hover {
    filter: brightness(25%);
}

.bottomRight {
  position: fixed;
  bottom: 0px;
  right: 30px;
}

.balance {
    margin-bottom: 6px;
}

</style>