<template>
  <ChartBarView :chart-data="chartData" :options="options" />
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

import ChartBarView from '@/components/ChartBarView.vue'

import type { ChartData, ChartOptions } from 'chart.js'
import { Context } from 'chartjs-plugin-datalabels'

@Component({
  components: {
    ChartBarView,
  },
})
export default class ChartBarBusiness extends Vue {
  @Prop({ default: 80000 })
  readonly expensePerMonth!: number

  @Prop({ default: new Date().getMonth() })
  readonly currentMonth!: number

  @Prop({
    default() {
      return [
        1344,
        359,
        6798,
        4743,
        2273,
        1926,
        2219,
        2040,
        4433,
        13432,
        4100,
        1812,
        1763,
        2914,
        3525,
        2805,
        4894,
        3959,
        2101,
        763,
      ]
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
        display(context: Context) {
          return context.dataset.data[context.dataIndex] ? true : false
        },
        formatter: Math.abs,
      },
    },
    maintainAspectRatio: false,

    onClick: e => {
      console.log('event', e)
      // const canvasPosition = Chart.helpers.getRelativePosition(e, chart);

      // Substitute the appropriate scale IDs
      // const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
      // const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  }

  get chartData(): ChartData {
    return {
      labels: this.labels,
      datasets: [
        {
          label: 'Планируемый расход или меньше',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: this.expenditure,
        },
        {
          label: 'Остаток',
          backgroundColor: 'rgba(0, 128, 0, 0.5',
          borderColor: 'rgba(0, 128, 0, 1)',
          borderWidth: 1,
          data: this.underspending,
        },
        {
          label: 'Перерасход',
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
          borderColor: 'rgba(255, 0, 0, 1)',
          borderWidth: 1,
          data: this.overspending,
        },
        {
          label: 'Планируемые траты минус реальные ',
          data: this.dataForLineChart,
          backgroundColor: 'green',
          borderColor: 'green',
          type: 'line',
          tension: 0.4,
          order: 0,
          datalabels: {
            labels: {
              title: null,
            },
          },
        },
      ],
    }
  }

  created(): void {
    this.generatedChartData()
  }

  @Watch('weekendMultiplier')
  @Watch('expensePerMonth')
  generatedChartData(): void {
    this.plannedExpenses.forEach((plannedExpense, index) => {
      if (!this.actualExpenses[index]) {
        this.expenditure.push(plannedExpense)
        this.underspending.push(0)
        this.overspending.push(0)
      } else if (plannedExpense >= this.actualExpenses[index]) {
        this.underspending.push(plannedExpense - this.actualExpenses[index])
        this.expenditure.push(this.actualExpenses[index])
        this.overspending.push(0)
      } else {
        this.underspending.push(0)
        this.expenditure.push(plannedExpense)
        this.overspending.push(plannedExpense - this.actualExpenses[index])
      }
    })
  }

  underspending: Array<number> = []

  expenditure: Array<number> = []

  overspending: Array<number> = []

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

  get dataForLineChart(): Array<number> {
    if (!this.actualExpenses.length) return []
    let sumPlannedExpenses = 0
    let sumActualExpenses = 0
    let data = []
    for (let i = 0; this.actualExpenses.length >= i; i++) {
      if (this.actualExpenses.length >= i) {
        sumPlannedExpenses += this.plannedExpenses[i]
        sumActualExpenses += this.actualExpenses[i]
      }
      data.push(sumPlannedExpenses - sumActualExpenses)
    }
    return data
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
