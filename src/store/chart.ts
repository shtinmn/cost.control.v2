import { Getters, Mutations, Actions, Module } from 'vuex-smart-module'

import type { days } from '@/types/chart'

export class ChartState {
  selectedMonth = new Date().getMonth()
  plannedExpensePerMonth = 120000
  weekendMultiplier = 3
  actualExpenses: Array<number> = []
}

export class ChartGetters extends Getters<ChartState> {
  getSumDaysInSelectedMonth(): number {
    return new Date(new Date().getFullYear(), this.state.selectedMonth + 1, 0).getDate()
  }
  getNameMonth(): string {
    return new Date(new Date().getFullYear(), this.state.selectedMonth, 1).toLocaleDateString('Ru-ru', {
      year: 'numeric',
      month: 'long',
    })
  }
}

export class ChartMutations extends Mutations<ChartState> {
  setMonth(month: number): void {
    this.state.selectedMonth = month
  }
  setPlannedExpensePerMonth(plannedExpensePerMonth: number): void {
    this.state.plannedExpensePerMonth = plannedExpensePerMonth
  }
  setWeekendMultiplier(weekendMultiplier: number): void {
    this.state.weekendMultiplier = weekendMultiplier
  }
  setActualExpenses(days: days): void {
    const actualExpenses = Object.values(days)
    const removeEmptyValue = (): void => {
      if (actualExpenses[actualExpenses.length - 1] === '') {
        actualExpenses.pop()
        removeEmptyValue()
      }
    }
    removeEmptyValue()
    this.state.actualExpenses = actualExpenses.map(item => Number(item))
  }
}

export class ChartActions extends Actions<ChartState, ChartGetters, ChartMutations> {}

export const chartModule = new Module({
  state: ChartState,
  getters: ChartGetters,
  mutations: ChartMutations,
  actions: ChartActions,
})
