<template>
  <component :is="$route.meta.template">
    <router-view />
  </component>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import AppTemplate from '@/components/templates/AppTemplate.vue'

@Component({
  components: {
    AppTemplate,
  },
})
export default class App extends Vue {}
</script>
