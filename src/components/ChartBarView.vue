<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'

import { Bar, mixins } from 'vue-chartjs'

import type { ChartData, ChartOptions } from 'chart.js'

@Component({
  mixins: [mixins.reactiveProp],
})
export default class ChartBarView extends Mixins(Bar) {
  @Prop()
  readonly chartData!: ChartData

  @Prop()
  readonly options!: ChartOptions | undefined

  mounted(): void {
    // this.renderChart(this.chartData, this.options)
  }
}
</script>
