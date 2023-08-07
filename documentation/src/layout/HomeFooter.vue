<script setup lang="ts">
const links = [
  {
    name: 'About',
    items: [
      { name: 'Company', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Careers', href: '#' },
    ],
  },
  {
    name: 'Legal',
    items: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Sitemap', href: '#' },
    ],
  },
  {
    name: 'Visit',
    items: [
      { name: 'Locations', href: '#' },
      { name: 'Culture', href: '#' },
      { name: 'Contact', href: '#' },
    ],
  },
]
</script>

<template>
  <footer class="grid grid-cols-1 md:grid-cols-3">
    <div class="col-span-1" v-for="link in links">
      <h3 class="text-xl font-bold">{{ link.name }}</h3>
      <ul class="pl-0">
        <li class="list-none" v-for="item in link.items">
          <a :href="item.href" class="">{{ item.name }}</a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<style scoped lang="stylus">
footer
  border-top 1px solid var(--c-border)
</style>
