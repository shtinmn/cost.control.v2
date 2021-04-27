<template>
  <v-col class="chartBarWrapper">
    <canvas ref="chartBar" id="chartBar" class="chartBar" />
  </v-col>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref, Watch } from 'vue-property-decorator'

import Chart from 'chart.js/auto'

import ChartDataLabels from 'chartjs-plugin-datalabels'

import type { ChartData, ChartOptions, Chart as ChartType } from 'chart.js'

@Component
export default class ChartBarView extends Vue {
  @Ref('chartBar')
  refChartBar!: HTMLCanvasElement

  @Prop()
  readonly chartData!: ChartData

  @Prop()
  readonly options: ChartOptions | undefined

  chartBar!: ChartType

  mounted(): void {
    this.chartBar = new Chart(this.refChartBar, {
      plugins: [ChartDataLabels],
      type: 'bar',
      data: this.chartData,
      options: this.options,
    })
  }

  @Watch('chartData')
  @Watch('options')
  updateChart(): void {
    this.chartBar.data.datasets = this.chartData.datasets

    this.chartBar.update()
  }
}
</script>
<style lang="sass" scoped>
.chartBarWrapper
  position: relative
  width: 100%
  min-height: 60vh
  overflow-x: auto
</style>
