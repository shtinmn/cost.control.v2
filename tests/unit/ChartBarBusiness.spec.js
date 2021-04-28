import Vue from 'vue'
import Vuetify from 'vuetify'

import ChartBarBusiness from '@/components/ChartBarBusiness.vue'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

Vue.use(Vuetify)

describe('ChartBarBusiness.vue', () => {
  let localVue

  beforeEach(() => {
    localVue = createLocalVue()
  })

  const factoryWrapper = options => {
    return shallowMount(ChartBarBusiness, { localVue, ...options })
  }

  const getSumArrayItems = arr => {
    let sum = 0
    arr.forEach(item => (sum += Math.abs(item)))
    return sum
  }

  it('внутри лежит canvas элемент', () => {
    const wrapper = mount(ChartBarBusiness, { localVue })

    expect(wrapper.find('canvas').element).toBeTruthy()
  })

  describe('проверка вычисляемого значения amountDaysInMonth', () => {
    const options = { propsData: { currentMonth: 0 } }
    it('в январе 31 день', () => {
      expect(factoryWrapper(options).vm.amountDaysInMonth).toBe(31)
    })
    it('в феврале более 27 дней', () => {
      options.propsData.currentMonth = 1
      expect(factoryWrapper(options).vm.amountDaysInMonth).toBeGreaterThanOrEqual(28)
    })
    it('в марте 31 день', () => {
      options.propsData.currentMonth = 2
      expect(factoryWrapper(options).vm.amountDaysInMonth).toBe(31)
    })
    it('в апреле 30 дней', () => {
      options.propsData.currentMonth = 3
      expect(factoryWrapper(options).vm.amountDaysInMonth).toBe(30)
    })
  })

  describe('проверка вычисляемого значения labels', () => {
    const options = { propsData: { currentMonth: 4 } }
    const labels = factoryWrapper(options).vm.labels
    it('длина labels ровна количеству дней выбранного месяца', () => {
      expect(labels).toHaveLength(31)
    })
    it('проверка формата данных в массиве', () => {
      expect(labels[10]).toBe('11 мая 2021 г.')
      expect(labels[20]).toBe('21 мая 2021 г.')
      expect(labels[25]).toBe('26 мая 2021 г.')
      expect(labels[35]).toBeUndefined()
    })
    it.todo('добавить возможность выбирать формат данных')
  })

  describe('проверка метода isDayOff', () => {
    const options = { propsData: { currentMonth: 5 } }
    it('12 июня выходной день', () => {
      expect(factoryWrapper(options).vm.isDayOff(12)).toBeTruthy()
    })
    it('15 июня будний день', () => {
      expect(factoryWrapper(options).vm.isDayOff(15)).toBeFalsy()
    })
  })

  describe('проверка метода getRemainingAmountDivisor', () => {
    const options = { propsData: { currentMonth: 6, weekendMultiplier: 1 } }
    it('при отсутствии множителя выходного дня, делитель равен количеству оставшихся в месяце дней', () => {
      expect(factoryWrapper(options).vm.getRemainingAmountDivisor(10)).toBe(22)
    })
    it('при наличии множителя выходного дня, делитель должен быть равен количеству будних дней + количеству выходных, умноженных на множитель', () => {
      options.propsData.weekendMultiplier = 3
      expect(factoryWrapper(options).vm.getRemainingAmountDivisor(20)).toBe(18)
    })
    it.todo('добавить возможность выбирать на любой день недели или месяца любой множитель')
  })

  describe('проверка метода getPlannedExpensesForCurrentDay', () => {
    const options = { propsData: { currentMonth: 7, weekendMultiplier: 1 } }

    it('планируемый расход на день при отсутствии множителя выходного дня', () => {
      expect(factoryWrapper(options).vm.getPlannedExpensesForCurrentDay(15, 34000)).toBe(2000)
    })
    it('планируемый расход на день при наличии множителя выходного дня', () => {
      options.propsData.weekendMultiplier = 3
      expect(factoryWrapper(options).vm.getPlannedExpensesForCurrentDay(25, 22000)).toBe(2000)
    })
  })

  describe('проверка метода getAmountOfMoneySpentYesterday', () => {
    const options = { propsData: { actualExpenses: [1000, 2000, 3000] } }
    const vm = factoryWrapper(options).vm
    it('получение суммы потраченых вчера денег', () => {
      expect(vm.getAmountOfMoneySpentYesterday(1)).toBe(0)
      expect(vm.getAmountOfMoneySpentYesterday(2)).toBe(1000)
      expect(vm.getAmountOfMoneySpentYesterday(3)).toBe(2000)
      expect(vm.getAmountOfMoneySpentYesterday(4)).toBe(3000)
      expect(vm.getAmountOfMoneySpentYesterday(5)).toBe(0)
    })
    it.todo('добавить возможность добавлять значение в середину массива (const x = []; x[5] = 1000;)')
  })

  describe('проверка вычисляемого значения dynamicallyPlannedExpenses', () => {
    const options = {
      propsData: {
        expensePerMonth: 28000,
        currentMonth: 1,
        actualExpenses: [],
        weekendMultiplier: 1,
      },
    }

    it('actualExpenses - [], weekendMultiplier - 1', () => {
      const dynamicallyPlannedExpenses = factoryWrapper(options).vm.dynamicallyPlannedExpenses
      expect(dynamicallyPlannedExpenses[1]).toBe(1000)
      expect(dynamicallyPlannedExpenses[10]).toBe(1000)
      expect(dynamicallyPlannedExpenses[20]).toBe(1000)
      expect(dynamicallyPlannedExpenses[27]).toBe(1000)
      expect(dynamicallyPlannedExpenses).toHaveLength(28)
    })
    it('actualExpenses - [1000 x 7], weekendMultiplier - 1', () => {
      options.propsData.actualExpenses = [1000, 1000, 1000, 1000, 1000, 1000, 1000]
      const dynamicallyPlannedExpenses = factoryWrapper(options).vm.dynamicallyPlannedExpenses
      expect(dynamicallyPlannedExpenses[0]).toBe(1000)
      expect(dynamicallyPlannedExpenses[5]).toBe(1000)
      expect(dynamicallyPlannedExpenses[10]).toBe(1000)
      expect(dynamicallyPlannedExpenses[20]).toBe(1000)
      expect(dynamicallyPlannedExpenses[27]).toBe(1000)
      expect(dynamicallyPlannedExpenses).toHaveLength(28)
    })
    it('actualExpenses - [500 x 3], weekendMultiplier - 1', () => {
      options.propsData.actualExpenses = [500, 500, 500]
      const dynamicallyPlannedExpenses = factoryWrapper(options).vm.dynamicallyPlannedExpenses
      expect(dynamicallyPlannedExpenses[0]).toBe(1000)
      expect(dynamicallyPlannedExpenses[1]).toBe(1019)
      expect(dynamicallyPlannedExpenses[2]).toBe(1038)
      expect(dynamicallyPlannedExpenses[3]).toBe(1060)
      expect(dynamicallyPlannedExpenses[10]).toBe(1060)
      expect(dynamicallyPlannedExpenses[20]).toBe(1060)
      expect(dynamicallyPlannedExpenses[27]).toBe(1060)
      expect(dynamicallyPlannedExpenses).toHaveLength(28)
    })
    it('actualExpenses - [1500 x 3], weekendMultiplier - 1', () => {
      options.propsData.actualExpenses = [1500, 1500, 1500]
      const dynamicallyPlannedExpenses = factoryWrapper(options).vm.dynamicallyPlannedExpenses
      expect(dynamicallyPlannedExpenses[0]).toBe(1000)
      expect(dynamicallyPlannedExpenses[1]).toBe(981)
      expect(dynamicallyPlannedExpenses[2]).toBe(962)
      expect(dynamicallyPlannedExpenses[3]).toBe(940)
      expect(dynamicallyPlannedExpenses[10]).toBe(940)
      expect(dynamicallyPlannedExpenses[20]).toBe(940)
      expect(dynamicallyPlannedExpenses[27]).toBe(940)
      expect(dynamicallyPlannedExpenses).toHaveLength(28)
    })
    it('actualExpenses - [500 x 3, 3000 x 3], weekendMultiplier - 1', () => {
      options.propsData.actualExpenses = [500, 500, 500, 3000, 3000, 3000]
      const dynamicallyPlannedExpenses = factoryWrapper(options).vm.dynamicallyPlannedExpenses
      expect(dynamicallyPlannedExpenses[0]).toBe(1000)
      expect(dynamicallyPlannedExpenses[1]).toBe(1019)
      expect(dynamicallyPlannedExpenses[2]).toBe(1038)
      expect(dynamicallyPlannedExpenses[3]).toBe(1060)
      expect(dynamicallyPlannedExpenses[4]).toBe(979)
      expect(dynamicallyPlannedExpenses[5]).toBe(891)
      expect(dynamicallyPlannedExpenses[6]).toBe(795)
      expect(dynamicallyPlannedExpenses[10]).toBe(796)
      expect(dynamicallyPlannedExpenses[20]).toBe(796)
      expect(dynamicallyPlannedExpenses[27]).toBe(795)
      expect(dynamicallyPlannedExpenses).toHaveLength(28)
    })
    it('actualExpenses - [], weekendMultiplier - 5', () => {
      options.propsData = {
        ...options.propsData,
        actualExpenses: [],
        expensePerMonth: 60000,
        weekendMultiplier: 5,
      }
      const dynamicallyPlannedExpenses = factoryWrapper(options).vm.dynamicallyPlannedExpenses
      expect(dynamicallyPlannedExpenses[0]).toBe(1000)
      expect(dynamicallyPlannedExpenses[4]).toBe(1000)
      expect(dynamicallyPlannedExpenses[5]).toBe(5000)
      expect(dynamicallyPlannedExpenses[6]).toBe(5000)
      expect(dynamicallyPlannedExpenses[7]).toBe(1000)
      expect(dynamicallyPlannedExpenses).toHaveLength(28)
    })
    it('actualExpenses - [500 x 3, 1026 x 2, 5132, 10000], weekendMultiplier - 5', () => {
      options.propsData = {
        ...options.propsData,
        actualExpenses: [500, 500, 500, 1026, 1026, 5132, 10000],
        expensePerMonth: 60000,
        weekendMultiplier: 5,
      }
      const dynamicallyPlannedExpenses = factoryWrapper(options).vm.dynamicallyPlannedExpenses
      expect(dynamicallyPlannedExpenses[0]).toBe(1000)
      expect(dynamicallyPlannedExpenses[1]).toBe(1008)
      expect(dynamicallyPlannedExpenses[2]).toBe(1017)
      expect(dynamicallyPlannedExpenses[3]).toBe(1026)
      expect(dynamicallyPlannedExpenses[4]).toBe(1026)
      expect(dynamicallyPlannedExpenses[5]).toBe(5132)
      expect(dynamicallyPlannedExpenses[6]).toBe(5132)
      expect(dynamicallyPlannedExpenses[7]).toBe(918)
      expect(dynamicallyPlannedExpenses[27]).toBe(4591)
      expect(dynamicallyPlannedExpenses).toHaveLength(28)
    })
  })

  describe('проверка вычисляемого значения staticallyPlannedExpenses', () => {
    it('expensePerMonth - 28000, weekendMultiplier - 1', () => {
      const options = {
        propsData: {
          expensePerMonth: 28000,
          weekendMultiplier: 1,
          currentMonth: 1,
        },
      }
      const staticallyPlannedExpenses = factoryWrapper(options).vm.staticallyPlannedExpenses
      expect(staticallyPlannedExpenses[0]).toBe(1000)
      expect(staticallyPlannedExpenses[6]).toBe(1000)
    })
    it('expensePerMonth - 60000, weekendMultiplier - 5', () => {
      const options = {
        propsData: {
          expensePerMonth: 60000,
          weekendMultiplier: 5,
          currentMonth: 1,
        },
      }
      const staticallyPlannedExpenses = factoryWrapper(options).vm.staticallyPlannedExpenses
      expect(staticallyPlannedExpenses[0]).toBe(1000)
      expect(staticallyPlannedExpenses[6]).toBe(5000)
    })
  })

  describe('проверка метода generatedChartData', () => {
    const options = {
      propsData: {
        currentMonth: 1,
        actualExpenses: [500, 500, 500, 1026, 1026, 5132, 10000],
        expensePerMonth: 60000,
        weekendMultiplier: 5,
      },
    }
    const dynamicallyPlannedExpenses = factoryWrapper(options).vm.dynamicallyPlannedExpenses
    const underspending = factoryWrapper(options).vm.underspending
    const overspending = factoryWrapper(options).vm.overspending
    it('dynamicallyPlannedExpenses - underspending + overspending >= expensePerMonth', () => {
      expect(
        getSumArrayItems(dynamicallyPlannedExpenses) - getSumArrayItems(underspending) + getSumArrayItems(overspending)
      ).toBeGreaterThanOrEqual(60000)
    })
  })

  describe('проверка вычисляемого значения dataForLineChart', () => {
    const options = {
      propsData: {
        currentMonth: 1,
        actualExpenses: [],
        expensePerMonth: 28000,
        weekendMultiplier: 1,
      },
    }
    it('длина массива dataForLineChart должна быть равной длине массива actualExpenses', () => {
      expect(factoryWrapper(options).vm.dataForLineChart).toHaveLength(0)
      options.propsData.actualExpenses = [0, 0, 0, 0, 0]
      expect(factoryWrapper(options).vm.dataForLineChart).toHaveLength(5)
      options.propsData.actualExpenses = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      expect(factoryWrapper(options).vm.dataForLineChart).toHaveLength(10)
    })
    it('actualExpenses - [1000, 3500, 200], expensePerMonth - 28000, weekendMultiplier - 1', () => {
      options.propsData.actualExpenses = [1000, 3500, 200]
      expect(factoryWrapper(options).vm.dataForLineChart[0]).toBe(0)
      expect(factoryWrapper(options).vm.dataForLineChart[1]).toBe(-2500)
      expect(factoryWrapper(options).vm.dataForLineChart[2]).toBe(-1700)
    })
    it('actualExpenses - [1000 x 8], expensePerMonth - 60000, weekendMultiplier - 5', () => {
      options.propsData = {
        ...options.propsData,
        actualExpenses: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
        expensePerMonth: 60000,
        weekendMultiplier: 5,
      }
      const dataForLineChart = factoryWrapper(options).vm.dataForLineChart
      expect(dataForLineChart[0]).toBe(0)
      expect(dataForLineChart[4]).toBe(0)
      expect(dataForLineChart[5]).toBe(4000)
      expect(dataForLineChart[6]).toBe(8000)
      expect(dataForLineChart[7]).toBe(8000)
    })
  })
})
