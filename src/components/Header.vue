<template>
    <header>
        <WalletButton />
        <div class="link-container">
            <a class="head-item" rel="noopener noreferrer" target="_blank" href="https://medium.com/@TriviumNode/preserve-your-privacy-with-blackbox-f7c60b46ee46">About</a>
            <a class="head-item" rel="noopener noreferrer" target="_blank" href="https://discord.gg/tp6PpXdaDn">Support</a>
            <a class="head-item" rel="noopener noreferrer" target="_blank" href="https://github.com/TriviumNode">Github</a>
        </div>
    </header>
</template>

<script>
import WalletButton from './WalletButton.vue'

export default {
    name: `Header`,
    components: {
        WalletButton
    },
}
</script>


<style scoped>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        /* margin-bottom: 20px; */
        background-color: #0B0D17;

        position: absolute;
        width: 100%;
        height: 72px;
        left: 0px;
        top: 0px;

    }

    .link-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        /* margin-bottom: 20px; */
        width: auto;
    }

    .head-item-right {
        text-align: right;
        margin-right: 4vw;
        margin-left: 4vw;
        text-decoration: none;
        color: whitesmoke;
    }

    .head-item-left {
        text-align: right;
        float: right;
        text-decoration: none;
        color: whitesmoke;
    }

    .head-item {
        text-align: right;
        margin-right: 4vw;
        text-decoration: none;
        color: whitesmoke;
    }



</style>