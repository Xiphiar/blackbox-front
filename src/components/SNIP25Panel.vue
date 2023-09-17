<template>
    <div class="action-box popup">

    <div class="token-scroll">

        <div v-for="(token, index) in tokenList" :key="index" class="token-data pointer" @click="ConfirmToken(token.symbol, token.image, token.address, token.decimals)">
            <img class="token" :src="token.image ? `/tokenIcons/${token.image}` : `/tokenIcons/default.svg`" alt="">
            <div>{{ token.symbol }}</div>
        </div>
        
    </div>

        <img class="return pointer" src="@/assets/BackArrow.svg" alt="Back" v-on:click="ReturnHome">

    </div>
</template>



<script>
    // import { tokenList } from '../store/tokens'
    import snip25 from '../store/snip25.json'

    const tokenList = snip25.sort((a, b) => {
        // if (a.symbol.startsWith('sa') && !b.symbol.startsWith('sa')) return -1;
        // if (b.symbol.startsWith('sa') && !a.symbol.startsWith('sa')) return 1;
        // if (b.symbol.startsWith('sa') && a.symbol.startsWith('sa')) {
        //     if (a.symbol < b.symbol) {
        //         return -1;
        //     }
        //         if (a.symbol > b.symbol) {
        //         return 1;
        //     }
        // }

        if (a.symbol.startsWith('sst') && !b.symbol.startsWith('sst')) return 1;
        if (b.symbol.startsWith('sst') && !a.symbol.startsWith('sst')) return -1;
        if (b.symbol.startsWith('sst') && a.symbol.startsWith('sst')) {
            if (a.symbol < b.symbol) {
                return -1;
            }
                if (a.symbol > b.symbol) {
                return 1;
            }
        }

        if (a.symbol < b.symbol) {
            return -1;
        }
        if (a.symbol > b.symbol) {
            return 1;
        }
        return 0;
    })

    export default {
        name: 'SNIP25Panel',
        components: {

        },
        data() {
            return {
                test: "bing",
                tokenList
            }
        },
        methods: {
            ReturnHome: function() {
                this.$emit('ReturnHome')
            },
            ConfirmToken: function(denom, img, address, decimals) {
                this.$emit(`ConfirmToken25`, denom, img, address, decimals)
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
    margin-bottom: 40px;
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