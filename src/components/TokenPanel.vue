<template>
    <div class="action-box popup">

    <div class="token-scroll">
        <div class="token-data pointer" @click="ConfirmToken('sSCRT', 'scrt.svg', 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek', 6)">
            <img class="token" src="/tokenIcons/scrt.svg" alt="">
            <div>sSCRT</div>
        </div>
        <div class="token-data pointer" @click="ConfirmToken('sUSDT', 'usdt_ethereum.svg', 'secret18wpjn83dayu4meu6wnn29khfkwdxs7kyrz9c8f', 6)">
            <img class="token" src="/tokenIcons/usdt_ethereum.svg" alt="">
            <div>sUSDT</div>
        </div>
        <div class="token-data pointer" @click="ConfirmToken('ALTER', 'alter.svg', 'secret12rcvz0umvk875kd6a803txhtlu7y0pnd73kcej', 6)">
            <img class="token" src="/tokenIcons/alter.svg" alt="ALTER">
            <div>ALTER</div>
        </div>
        <div class="token-data pointer" @click="ConfirmToken('sATOM', 'atom.png', 'secret14mzwd0ps5q277l20ly2q3aetqe3ev4m4260gf4', 6)">
            <img class="token" src="/tokenIcons/atom.png" alt="">
            <div>sATOM</div>
        </div>
        <div class="token-data pointer" @click="ConfirmToken('sLUNC', 'luna.png', 'secret1ra7avvjh9fhr7dtr3djutugwj59ptctsrakyyw', 6)">
            <img class="token" src="/tokenIcons/luna.png" alt="">
            <div>sLUNC</div>
        </div>
        <div class="token-data pointer" @click="ConfirmToken('SEFI', 'sefi.svg', 'secret15l9cqgz5uezgydrglaak5ahfac69kmx2qpd6xt', 6)">
            <img class="token" src="/tokenIcons/sefi.svg" alt="">
            <div>SEFI</div>
        </div>
        <div class="token-data pointer" @click="ConfirmToken('sOSMO', 'osmo.png', 'secret1zwwealwm0pcl9cul4nt6f38dsy6vzplw8lp3qg', 6)">
            <img class="token" src="/tokenIcons/osmo.png" alt="">
            <div>sOSMO</div>
        </div>
        <div class="token-data pointer" @click="ConfirmToken('sXMR', 'sxmr.png', 'secret19ungtd2c7srftqdwgq0dspwvrw63dhu79qxv88', 12)">
            <img class="token" src="/tokenIcons/sxmr.png" alt="">
            <div>sXMR</div>
        </div>
        <div class="token-data pointer" @click="ConfirmToken('sWBTC', 'wbtc_ethereum.svg', 'secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a', 8)">
            <img class="token" src="/tokenIcons/wbtc_ethereum.svg" alt="">
            <div>sWBTC</div>
        </div>
        <div class="token-data pointer" @click="ConfirmToken('sBNB', 'bnb_binance.svg', 'secret1tact8rxxrvynk4pwukydnle4l0pdmj0sq9j9d5', 18)">
            <img class="token" src="/tokenIcons/bnb_binance.svg" alt="">
            <div>sBNB</div>
        </div>
        <div class="token-data pointer" @click="ConfirmToken('sUST', 'ust.png', 'secret129h4vu66y3gry6wzwa24rw0vtqjyn8tujuwtn9', 6)">
            <img class="token" src="/tokenIcons/ust.png" alt="">
            <div>sUST</div>
        </div>
        

    </div>

        <img class="return pointer" src="@/assets/BackArrow.svg" alt="Back" v-on:click="ReturnHome">

    </div>
</template>



<script>



export default {
    name: 'TokenPanel',
    components: {

    },
    data() {
        return {
            test: "bing",
            
        }
    },
    methods: {
        ReturnHome: function() {
            this.$emit('ReturnHome')
        },
        ConfirmToken: function(denom, img, address, decimals) {
            this.$emit(`ConfirmToken`, denom, img, address, decimals)
        }
    }
    
}
</script>



<style scoped>



.popup{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 55vh;
    height: 70vh;
    background: #0B0D17;

}




.token-scroll{
    overflow-y: scroll;
    height: 100%;
    scrollbar-width: none;

}

.token-scroll::-webkit-scrollbar { 
    display: none;  /* Safari and Chrome */
}



.token {
    width: 50px;  
    height: auto;  
}

.token-data {
    margin-top: 40px;
}

.token-data:hover {
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