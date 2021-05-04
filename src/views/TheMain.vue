<template>
  <v-container>
    <!-- <vue-csv-import v-model="parseCsv" :map-fields="fields"></vue-csv-import> -->
    <ChartBarBusiness
      :currentMonth="selectedMonth"
      :actualExpenses="actualExpenses"
      :expensePerMonth="plannedExpensePerMonth"
      :weekendMultiplier="weekendMultiplier"
    />

    <v-row no-gutters justify="center" align="center" class="my-2">
      <v-text-field
        v-mask="'########'"
        v-model="plannedExpensePerMonth"
        label="Планируемые расходы на месяц"
        hide-details="auto"
        outlined
        dense
      />
      <v-btn @click="setMonth(chartModule.state.selectedMonth - 1)" class="ml-2" text>
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <div class="mx-2">{{ chartModule.getters.getNameMonth() }}</div>
      <v-btn @click="setMonth(chartModule.state.selectedMonth + 1)" class="mr-2" text>
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-text-field
        v-mask="'#.#'"
        v-model="weekendMultiplier"
        label="Множитель выходного дня"
        hide-details="auto"
        outlined
        dense
      />
    </v-row>

    <v-slide-group show-arrows>
      <v-slide-item v-for="day in chartModule.getters.getSumDaysInSelectedMonth()" :key="day">
        <v-text-field
          :id="`day-${day}`"
          v-mask="'########'"
          v-model="days[day]"
          :disabled="day - 1 > actualExpenses.length"
          class="mx-2 my-1"
          :label="getLabel(day)"
          hide-details="auto"
          outlined
          dense
        />
      </v-slide-item>
    </v-slide-group>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

import ChartBarBusiness from '@/components/ChartBarBusiness.vue'

import { mask } from 'vue-the-mask'

import { chartModule } from '@/store/chart'

import type { days } from '@/types/chart'

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
  chartModule = chartModule.context(this.$store)

  days: days = {
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
    '6': '',
    '7': '',
    '8': '',
    '9': '',
    '10': '',
    '11': '',
    '12': '',
    '13': '',
    '14': '',
    '15': '',
    '16': '',
    '17': '',
    '18': '',
    '19': '',
    '20': '',
    '21': '',
    '22': '',
    '23': '',
    '24': '',
    '25': '',
    '26': '',
    '27': '',
    '28': '',
    '29': '',
    '30': '',
    '31': '',
  }

  @Watch('days', { immediate: true, deep: true })
  changeActualExpenses(): void {
    this.chartModule.mutations.setActualExpenses(this.days)
  }



  get plannedExpensePerMonth(): number {
    return this.chartModule.state.plannedExpensePerMonth
  }

  set plannedExpensePerMonth(value: number) {
    this.chartModule.mutations.setPlannedExpensePerMonth(value)
  }

  get weekendMultiplier(): number {
    return this.chartModule.state.weekendMultiplier
  }

  set weekendMultiplier(value: number) {
    this.chartModule.mutations.setWeekendMultiplier(value)
  }

  get actualExpenses(): Array<number> {
    return this.chartModule.state.actualExpenses
  }

  get selectedMonth(): number {
    return this.chartModule.state.selectedMonth
  }

  setMonth(month: number): void {
    this.chartModule.mutations.setMonth(month)
  }

  getLabel(day: number, year = new Date().getFullYear()): string {
    return new Date(year, this.selectedMonth, day).toLocaleDateString('Ru-ru', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // parseCsv = null
  // fields = ['Label 1', 'Label 2']
}
</script>
