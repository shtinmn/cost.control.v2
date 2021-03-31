<template>
  <div>
    <vue-csv-import v-model="parseCsv" :map-fields="fields"></vue-csv-import>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import { VueCsvImport } from 'vue-csv-import'

@Component({
  components: {
    VueCsvImport,
  },
})
export default class TheMain extends Vue {
  parseCsv = null
  fields = { field1: 'Label 1', field2: 'Label 2' }
}
</script>
