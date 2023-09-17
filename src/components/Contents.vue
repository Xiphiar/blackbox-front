<template>
    <body>
        
        <div class="panel">
            <component
                :is="PanelType"
                v-on:UseCloak="SetCloak"
                v-on:UseDeaddrop="SetDeaddrop"
                v-on:UseDecoy="SetDecoy"
                v-on:ReturnHome="SetHome"
                v-on:ToReceive="SetReceive"
                v-on:ToCloakReceive="SetCloakReceive"
                v-on:UseCancel="SetCloakCancel"
            />
        </div>

        <div class="info">
            <!-- <img src="@/assets/BlackBoxTitle.svg" alt="BlackBox" class="logo"> -->
            <img src="blackboxnice-min.png" alt="BlackBox" class="logo" />
            <div class="sub-title"><glitched-writer :text="subtitle" preset="encrypted" :options="{ delay: [100,400] }"/></div>
            <!---<div class="description">{{ description }}</div>--->
            <div class="description"><glitched-writer :text="description" preset="encrypted" :options="{ delay: [100,400] }"/></div>

        </div>
    </body>
</template>


<script>
import CloakPanel from './CloakPanel.vue'
import DeaddropSendPanel from './DeaddropSendPanel.vue'
import DecoySendPanel from './DecoySendPanel.vue'
import DeaddropReceivePanel from './DeaddropReceivePanel.vue'
import CloakReceivePanel from './CloakReceivePanel.vue'
import CloakCancelPanel from './CloakCancelPanel.vue'
import ButtonPanel from './ButtonPanel.vue'
import GlitchedWriter from 'vue-glitched-writer'




export default {
    name: 'Contents',
    components: {
        CloakPanel,
        CloakReceivePanel,
        CloakCancelPanel,
        ButtonPanel,
        DeaddropSendPanel,
        DecoySendPanel,
        DeaddropReceivePanel,
        GlitchedWriter
    },
    data() {
        return {
            PanelType: ButtonPanel,
            subtitle: " ",
            description: "A collection of dapps to bring together privacy and convenience."
        }
    },
    methods: {
        SetCloak: function(){
            this.PanelType = CloakPanel
            this.subtitle = "/Cloak"
            // this.description = "Seed another wallet with SCRT gas without a trace. Escape doxing with no link to your old address."
        },
        SetCloakReceive: function(){
            this.PanelType = CloakReceivePanel
            this.subtitle = "/Cloak"
            // this.description = "Seed another wallet with SCRT gas without a trace. Escape doxing with no link to your old address."
        },
        SetCloakCancel: function(){
            this.PanelType = CloakCancelPanel
            this.subtitle = "/Cloak"
            // this.description = "Seed another wallet with SCRT gas without a trace. Escape doxing with no link to your old address."
        },
        SetDeaddrop: function(){
            this.PanelType = DeaddropSendPanel
            this.subtitle = "/DeadDrop"
            this.description = "Use an alias to receive tokens without having to reveal your address. Generate one randomly or customize your own."
        },
        SetDecoy: function(){
            this.PanelType = DecoySendPanel
            this.subtitle = "/Decoy"
            this.description = "Seed your trail with decoys to send tokens without a trace."
        },
        SetReceive: function(){
            this.PanelType = DeaddropReceivePanel
            this.subtitle = "/DeadDrop"
            this.description = "Use an alias to receive tokens without having to reveal your address. Generate one randomly or customize your own."
        },
        SetHome: function(){
            this.PanelType = ButtonPanel
            this.subtitle = " "
            this.description = "A collection of dapps to bring together privacy and convenience."
            
        }
    }
}
</script>


<style scoped>

body {
    background-image: linear-gradient(180deg, #C4C4C4 0%, rgba(196, 196, 196, 0) 40%), url('../assets/BBBackground.png');
    background-size: cover;
    
    background-position: 0% 50%;
    background-repeat:no-repeat;
    height: 90vh;



}






.panel {
    float: right;
    margin-right: 5%;
    margin-top: 4.5%;
    display: flex;

}

.info {
    margin-top: 10%;
    margin-left: 5%;
    width: 17%;
    float: left;

    display: flex;
    flex-direction: column;
}

.logo {
    left: 0px;
    
    

}

.sub-title {
    margin-top: 3vh;
    font-size: 5vh;
    line-height: 43px;
    text-align: left;
    color: whitesmoke;


}



.description {
    font-size: 3vh;
    line-height: 5vh;
    text-align: left;
    margin-top: 3vh;
    word-break: normal;
    

}

.controls {
    width: 55vh;
    height: 70vh;
    top: 181px;
    
}


</style>