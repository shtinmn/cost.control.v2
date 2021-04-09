<template>
  <!-- <ChartBarView :chart-data="chartData" :options="options" /> -->
  <ChartBarView2 :chart-data="chartData" :options="options" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import ChartBarView2 from '@/components/ChartBarView2.vue'

import type { ChartData, ChartOptions } from 'chart.js'

@Component({
  components: {
    ChartBarView2,
  },
})
export default class ChartBarBusiness extends Vue {
  @Prop({ default: 80000 })
  readonly expensePerMonth!: number

  @Prop({ default: new Date().getMonth() })
  readonly currentMonth!: number

  @Prop({
    default() {
      return [1344, 359, 6798, 4743, 2273, 1926, 2219, 2040, 179]
    },
  })
  readonly actualExpenses!: Array<number>

  @Prop({ default: 2 })
  readonly weekendMultiplier!: number

  options: ChartOptions = {
    plugins: {
      datalabels: {
        anchor: 'center',
        color: 'black',
        rotation: -90,
      },
    },
  }

  get chartData(): ChartData {
    return {
      labels: this.labels,
      datasets: [
        {
          label: 'Сколько можно тратить в день',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: this.plannedExpenses,
        },
        {
          label: 'Сколько было потрачено',
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          data: this.actualExpenses,
        },
      ],
    }
  }

  get lastDayOfMonth(): number {
    return new Date(new Date().getFullYear(), this.currentMonth + 1, 0).getDate()
  }

  get labels(): Array<string> {
    const labels = []
    for (let i = 1; i <= this.lastDayOfMonth; i++) {
      labels.push(
        new Date(new Date().getFullYear(), this.currentMonth, i).toLocaleDateString('Ru-ru', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      )
    }
    return labels
  }

  get plannedExpenses(): Array<number> {
    const plannedExpenses = []
    let amountOfMoneySpent = 0

    for (let i = 0; i < this.lastDayOfMonth; i++) {
      let dividend = this.expensePerMonth
      if (i !== 0) {
        if (this.actualExpenses[i - 1]) amountOfMoneySpent += this.actualExpenses[i - 1]
        else amountOfMoneySpent += plannedExpenses[i - 1]

        dividend = this.expensePerMonth - amountOfMoneySpent
      }

      if (this.isDayOff(i)) {
        plannedExpenses.push(Math.round(this.weekendMultiplier * (dividend / this.getDivisor(i))))
      } else {
        plannedExpenses.push(Math.round(dividend / this.getDivisor(i)))
      }
    }
    return plannedExpenses
  }

  getDivisor(currentDay: number): number {
    let divisor = this.lastDayOfMonth - currentDay
    if (this.weekendMultiplier === 1) return divisor
    else {
      let i = currentDay
      for (; i < this.lastDayOfMonth; i++) {
        if (this.isDayOff(i)) divisor += 1 * this.weekendMultiplier - 1
      }
      return divisor
    }
  }

  isDayOff(currentDay: number): boolean {
    if (
      new Date(new Date().getFullYear(), this.currentMonth, currentDay + 1).getDay() > 5 ||
      new Date(new Date().getFullYear(), this.currentMonth, currentDay + 1).getDay() === 0
    )
      return true
    else return false
  }
}
</script>
