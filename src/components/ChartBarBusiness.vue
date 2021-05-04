<template>
  <ChartBarView :chart-data="chartData" :options="options" />
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

import ChartBarView from '@/components/ChartBarView.vue'

import { chartModule } from '@/store/chart'

import type { ChartData, ChartOptions, ScriptableContext } from 'chart.js'
import { Context } from 'chartjs-plugin-datalabels'

@Component({
  components: {
    ChartBarView,
  },
})
export default class ChartBarBusiness extends Vue {
  chartModule = chartModule.context(this.$store)

  get currentMonth(): number {
    return this.chartModule.state.selectedMonth
  }

  get expensePerMonth(): number {
    return this.chartModule.state.plannedExpensePerMonth
  }

  get actualExpenses(): Array<number> {
    return this.chartModule.state.actualExpenses
  }

  get weekendMultiplier(): number {
    return this.chartModule.state.weekendMultiplier
  }

  options: ChartOptions = {
    responsive: true,
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
          label: 'Планируемый расход',
          backgroundColor: (context: ScriptableContext<'bar'>): string =>
            context.dataset.data[context?.dataIndex] > 0 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 0, 0, 0.5)',
          borderColor: (context: ScriptableContext<'bar'>): string =>
            context.dataset.data[context.dataIndex] > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 0, 0, 1)',
          borderWidth: 1,
          data: this.expenditure,
        },
        {
          label: 'Недорасход',
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
          label: 'Средний расход',
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
  @Watch('currentMonth')
  @Watch('actualExpenses')
  generatedChartData(): void {
    this.underspending = []
    this.expenditure = []
    this.overspending = []
    this.dynamicallyPlannedExpenses.forEach((plannedExpense, index) => {
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

  get amountDaysInMonth(): number {
    return new Date(new Date().getFullYear(), this.currentMonth + 1, 0).getDate()
  }

  get labels(): Array<string> {
    const labels = []
    for (let day = 1; day <= this.amountDaysInMonth; day++) {
      labels.push(
        new Date(new Date().getFullYear(), this.currentMonth, day).toLocaleDateString('Ru-ru', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      )
    }
    return labels
  }

  get dynamicallyPlannedExpenses(): Array<number> {
    const plannedExpenses = []
    let amountOfMoneySpent = 0
    let remainingAmountOfMoney = this.expensePerMonth

    for (let day = 1; day <= this.amountDaysInMonth; day++) {
      amountOfMoneySpent += this.getAmountOfMoneySpentYesterday(day)

      remainingAmountOfMoney = this.expensePerMonth - amountOfMoneySpent

      plannedExpenses.push(this.getPlannedExpensesForCurrentDay(day, remainingAmountOfMoney))

      if (this.actualExpenses.length < plannedExpenses.length) amountOfMoneySpent += plannedExpenses[day - 1]
    }
    return plannedExpenses
  }

  get staticallyPlannedExpenses(): Array<number> {
    const plannedExpenses = []
    let amountOfMoneySpent = 0
    let remainingAmountOfMoney = this.expensePerMonth
    for (let day = 1; day <= this.amountDaysInMonth; day++) {
      remainingAmountOfMoney = this.expensePerMonth - amountOfMoneySpent

      plannedExpenses.push(this.getPlannedExpensesForCurrentDay(day, remainingAmountOfMoney))

      amountOfMoneySpent += plannedExpenses[day - 1]
    }
    return plannedExpenses
  }

  getAmountOfMoneySpentYesterday(currentDay: number): number {
    if (currentDay === 1) return 0

    if (this.actualExpenses.length + 1 >= currentDay) return this.actualExpenses[currentDay - 2]

    return 0
  }

  getPlannedExpensesForCurrentDay(currendDay: number, remainingAmountOfMoney: number): number {
    if (this.isDayOff(currendDay))
      return Math.round(this.weekendMultiplier * (remainingAmountOfMoney / this.getRemainingAmountDivisor(currendDay)))

    return Math.round(remainingAmountOfMoney / this.getRemainingAmountDivisor(currendDay))
  }

  get dataForLineChart(): Array<number> {
    if (!this.actualExpenses.length) return []
    let sumPlannedExpenses = 0
    let sumActualExpenses = 0
    let data = []
    for (let i = 0; this.actualExpenses.length > i; i++) {
      if (this.actualExpenses.length >= i) {
        sumPlannedExpenses += this.staticallyPlannedExpenses[i]
        sumActualExpenses += this.actualExpenses[i]
      }
      data.push(sumPlannedExpenses - sumActualExpenses)
    }
    return data
  }

  getRemainingAmountDivisor(currentDay: number): number {
    let divisor = this.amountDaysInMonth + 1 - currentDay

    if (this.weekendMultiplier === 1) return divisor

    for (let day = currentDay; day <= this.amountDaysInMonth; day++) {
      if (this.isDayOff(day)) divisor += this.weekendMultiplier - 1
    }

    return divisor
  }

  isDayOff(currentDay: number, year = new Date().getFullYear()): boolean {
    if (
      new Date(year, this.currentMonth, currentDay).getDay() > 5 ||
      new Date(year, this.currentMonth, currentDay).getDay() === 0
    )
      return true

    return false
  }
}
</script>
