<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import { VueConstructor } from 'vue'

import { Bar, mixins } from 'vue-chartjs'

import type { ChartData } from 'chart.js'

const VueBar = Vue as VueConstructor<Vue & Bar>

@Component({
  extends: Bar,
  mixins: [mixins.reactiveProp],
})
export default class ChartBarView extends VueBar {
  @Prop()
  readonly chartData!: ChartData

  options = {
    responsive: true,
    maintainAspectRatio: false,
  }

  mounted(): void {
    this.renderChart(this.chartData, this.options)
  }
}
</script>
