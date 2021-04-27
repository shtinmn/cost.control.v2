<template>
  <v-container>
    <v-text-field v-mask="'########'" v-model="plannedExpensePerMonth" label="Планируемые расходы на месяц" outlined />
    <v-text-field v-mask="'#.#'" v-model="weekendMultiplier" label="Множитель выходного дня" outlined />
    <!-- <vue-csv-import v-model="parseCsv" :map-fields="fields"></vue-csv-import> -->
    <ChartBarBusiness :expensePerMonth="plannedExpensePerMonth" :weekendMultiplier="weekendMultiplier" />
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import ChartBarBusiness from '@/components/ChartBarBusiness.vue'

import { mask } from 'vue-the-mask'

// import { VueCsvImport } from 'vue-csv-import'

@Component({
  components: {
    ChartBarBusiness,
    // VueCsvImport,
  },
  directives: {
    mask,
  },
})
export default class TheMain extends Vue {
  plannedExpensePerMonth = 100000
  weekendMultiplier = 3
  // parseCsv = null
  // fields = ['Label 1', 'Label 2']
}
</script>
