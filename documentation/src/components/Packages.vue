<script setup lang="ts">
const libraries = __libraries__
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <a v-for="library in libraries" class="col-span-1 p-8 library cursor-pointer" :href="library.href">
      <h3 class="font-extrabold">
        {{ library.name }}
      </h3>
      <p>
        {{ library.description }}
      </p>
    </a>
  </div>
</template>

<style scoped lang="stylus">
  .library
    border: 2px solid var(--c-brand)
    border-radius: 10px
</style>
