<template>
  <footer>
    <!-- Copyright -->
    <div>
      © {{ new Date().getFullYear() }}
      <span><img class="triv-logo" src="@/assets/Trivium_white.svg" alt=""></span>
      <a class="text-dark" href="https://trivium.network/">Trivium</a>
    </div>
    <!-- Copyright -->
  </footer>
</template>

<script>
export default {
    name: `Footer`,
}
</script>


<style scoped>
    footer {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #0B0D17;

        
        width: 100%;
        height: 72px;
        left: 0px;
        bottom: 0px;

    }

    .triv-logo {
        height: 14px;
        width: auto;
        margin-left: auto;
        margin-right: 0.25rem;
    }
</style>