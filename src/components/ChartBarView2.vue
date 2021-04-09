<template>
  <canvas ref="chartBar" id="chartBar" width="100%" />
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator'

import Chart from 'chart.js/auto'

import ChartDataLabels from 'chartjs-plugin-datalabels'

import type { ChartData, ChartOptions } from 'chart.js'

@Component
export default class ChartBarView2 extends Vue {
  @Ref('chartBar')
  refChartBar!: HTMLCanvasElement

  @Prop()
  readonly chartData!: ChartData

  @Prop()
  readonly options: ChartOptions | undefined

  mounted(): void {
    new Chart(this.refChartBar, {
      plugins: [ChartDataLabels],
      type: 'bar',
      data: this.chartData,
      options: this.options,
    })
  }
}
</script>
