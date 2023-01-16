import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import { chainId, cloak_address, deaddrop_address } from './store/config'
import { tokenList } from './store/tokens';

const whip003 = {
    chains: {
        "secret-network": {
            namespace: "cosmos",
            reference: chainId,
            label: "Secret Network",
            bech32s: "secret"
        }
    },
    coins: {
        "scrt": {
          chain: `cosmos:${chainId}`,
          slip44: 529,
          symbol: "SCRT",
          label: "Secret"
        }
    },
    contracts: {
        cloak: {
            chain: `cosmos:${chainId}`,
            address: cloak_address,
            label: "BlackBox Cloak V3"
          },
        deaddrop: {
            chain: `cosmos:${chainId}`,
            address: deaddrop_address,
            label: "BlackBox DeadDrop"
        },
    }
}

// Add tokens to base and add image links
tokenList.forEach(token=> {
    const jsonData = {
        chain: `cosmos:${chainId}`,
        address: token.address,
        interfaces: {
          snip20: {
            symbol: token.symbol
          }
        },
        label: token.symbol
    }

    whip003.contracts[`token-${token.symbol}`] = jsonData

    const tokenImg = document.createElement('link');
    tokenImg.rel = 'prefetch';
    tokenImg.as = 'image';
    tokenImg.href = `/tokenIcons/${token.icon}`;
    tokenImg.dataset['caip-19'] = `cosmos:${chainId}:${token.address}`;
    document.getElementsByTagName('head')[0].appendChild(tokenImg);
})


// Add JSON to head tag
const script = document.createElement('script');
script.type = 'application/json';
script.dataset['whip-003'] = '';
script.innerHTML = JSON.stringify(whip003, undefined, 2);
document.getElementsByTagName('head')[0].appendChild(script);



const app = createApp(App);
app.use(store)
app.use(Toast)
app.mount('#app');