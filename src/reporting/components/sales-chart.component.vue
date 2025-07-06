<script>
import Chart from 'primevue/chart';

export default {
  name: "SalesChart",
  components: {
    Chart
  },
  props: {
    dailySales: {
      type: Array,
      required: true
    },
    totalSales: {
      type: Number,
      required: true
    },
    totalTransactions: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      chartData: null,
      chartOptions: null
    };
  },
  mounted() {
    this.setChartData();
    this.setChartOptions();
  },
  watch: {
    dailySales: {
      handler() {
        this.setChartData();
      },
      deep: true
    }
  },
  methods: {
    setChartData() {
      const documentStyle = getComputedStyle(document.documentElement);

      this.chartData = {
        labels: this.dailySales.map(sale => sale.day),
        datasets: [
          {
            label: 'Ventas',
            data: this.dailySales.map(sale => sale.sales),
            backgroundColor: documentStyle.getPropertyValue('--blue-500') || '#3b82f6',
            borderColor: documentStyle.getPropertyValue('--blue-500') || '#3b82f6',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false
          }
        ]
      };
    },
    setChartOptions() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.chartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500
              }
            },
            grid: {
              display: false,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          }
        }
      };
    }
  }
};
</script>

<template>
  <div class="sales-chart-container">
    <div class="chart-header">
      <h3>Ventas por día</h3>
      <div class="chart-summary">
        <div class="summary-item">
          <span class="summary-value">S/ {{ totalSales.toFixed(2) }}</span>
          <span class="summary-label">{{ totalTransactions }} transacciones</span>
        </div>
      </div>
    </div>

    <div class="chart-content">
      <Chart
          type="bar"
          :data="chartData"
          :options="chartOptions"
          style="height: 300px;"
      />
    </div>
  </div>
</template>

<style scoped>
.sales-chart-container {
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  margin: 0;
  color: var(--text-color);
  font-weight: 600;
}

.chart-summary {
  text-align: right;
}

.summary-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
}

.summary-label {
  font-size: 14px;
}

.chart-content {
  width: 100%;
}
</style>