<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import type { Chart } from 'chart.js'
import { chartColors, chartColorsAlpha, mergeChartOptions } from '../config/chartTheme'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export interface ChartLineProps {
  /** Unique ID for the chart canvas element (required to prevent Chart.js canvas reuse issues) */
  chartId: string
  /** X-axis labels */
  labels: string[]
  /** Primary dataset values */
  data: number[]
  /** Optional secondary dataset for range (e.g., min/max) */
  dataSecondary?: number[]
  /** Label for primary dataset */
  dataLabel?: string
  /** Label for secondary dataset */
  dataSecondaryLabel?: string
  /** Index of current day to highlight (optional) */
  highlightIndex?: number
  /** Chart height in pixels */
  height?: number
  /** Custom chart options */
  options?: Partial<ChartOptions>
}

const props = withDefaults(defineProps<ChartLineProps>(), {
  dataLabel: 'Value',
  dataSecondaryLabel: 'Value 2',
  height: 300,
})

const chartRef = ref<{ chart: Chart } | null>(null)

/**
 * Prepare chart data with proper styling
 */
const chartData = computed<ChartData<'line'>>(() => {
  const datasets: ChartData<'line'>['datasets'] = [
    {
      label: props.dataLabel,
      data: props.data,
      borderColor: chartColors.primary,
      backgroundColor: chartColorsAlpha.primaryLight,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: props.data.map((_, index) => 
        index === props.highlightIndex ? 6 : 3
      ),
      pointBackgroundColor: props.data.map((_, index) =>
        index === props.highlightIndex ? chartColors.warning : chartColors.primary
      ),
      pointBorderColor: props.data.map((_, index) =>
        index === props.highlightIndex ? chartColors.warning : chartColors.primary
      ),
      pointBorderWidth: props.data.map((_, index) =>
        index === props.highlightIndex ? 3 : 2
      ),
    },
  ]

  // Add secondary dataset if provided
  if (props.dataSecondary && props.dataSecondary.length > 0) {
    datasets.push({
      label: props.dataSecondaryLabel,
      data: props.dataSecondary,
      borderColor: chartColors.secondary,
      backgroundColor: chartColorsAlpha.secondaryLight,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: props.dataSecondary.map((_, index) =>
        index === props.highlightIndex ? 6 : 3
      ),
      pointBackgroundColor: props.dataSecondary.map((_, index) =>
        index === props.highlightIndex ? chartColors.warning : chartColors.secondary
      ),
      pointBorderColor: props.dataSecondary.map((_, index) =>
        index === props.highlightIndex ? chartColors.warning : chartColors.secondary
      ),
      pointBorderWidth: props.dataSecondary.map((_, index) =>
        index === props.highlightIndex ? 3 : 2
      ),
    })
  }

  return {
    labels: props.labels,
    datasets,
  }
})

/**
 * Merge custom options with defaults
 */
const chartOptions = computed(() => {
  return mergeChartOptions({
    ...props.options,
    maintainAspectRatio: false,
  }) as ChartOptions<'line'>
})

/**
 * Update chart when data changes
 */
watch(
  () => [props.data, props.dataSecondary, props.labels, props.highlightIndex],
  () => {
    if (chartRef.value?.chart) {
      chartRef.value.chart.update('none')
    }
  },
  { deep: true }
)

onMounted(() => {
  // Chart is ready
})
</script>

<template>
  <div class="chart-container" :style="{ height: `${height}px` }">
    <Line
      ref="chartRef"
      :chart-id="chartId"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
}
</style>
