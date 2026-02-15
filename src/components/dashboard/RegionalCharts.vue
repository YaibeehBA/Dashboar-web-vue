<template>
  <div class="container-fluid mt-4">
    <div class="chart-card">
      <div class="chart-header">
        <h5>🏆 Análisis Regional: Volumen y Precio por Región</h5>
        <button 
          class="insight-btn small"
          @click="$emit('mostrar-insight', 'concentracion')"
          data-bs-toggle="modal" 
          data-bs-target="#insightModal"
        >
          💡 Ver Insight
        </button>
      </div>
      <div class="chart-container">
        <canvas ref="regionalChart"></canvas>
      </div>
      <div class="chart-footer">
        <span class="chart-note">
          Comparativa de volumen total (barras verdes) y precio promedio (barras naranjas) por región - Top 10 por volumen
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { onMounted, watch, ref } from 'vue';

Chart.register(...registerables, ChartDataLabels);

export default {
  name: 'RegionalCharts',
  props: {
    ranking: {
      type: Array,
      required: true
    }
  },
  emits: ['mostrar-insight'],
  setup(props) {
    const regionalChart = ref(null);
    let chartInstance = null;

    const crearGraficoRegional = (ctx) => {
      const top10 = props.ranking.slice(0, 10);
      
      // Ordenar por volumen descendente (ya viene así del ranking)
      const labels = top10.map(r => r.region);
      const volumenData = top10.map(r => r.volumen / 1000000); // Convertir a millones
      const precioData = top10.map(r => r.precio);

      return new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Volumen (millones lb)',
              data: volumenData,
              backgroundColor: '#4CAF50',
              yAxisID: 'y-volumen',
              borderRadius: 8,
              barPercentage: 0.7,
              order: 1
            },
            {
              label: 'Precio Promedio ($)',
              data: precioData,
              backgroundColor: '#FF9800',
              yAxisID: 'y-precio',
              borderRadius: 8,
              barPercentage: 0.7,
              order: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                boxWidth: 8,
                padding: 15
              }
            },
            tooltip: {
              backgroundColor: '#1a2e1a',
              callbacks: {
                label: (context) => {
                  if (context.dataset.label.includes('Volumen')) {
                    return `Volumen: ${context.parsed.y.toFixed(2)}M lb`;
                  } else {
                    return `Precio: $${context.parsed.y.toFixed(2)}`;
                  }
                }
              }
            },
            datalabels: {
              display: false
            }
          },
          scales: {
            'y-volumen': {
              type: 'linear',
              display: true,
              position: 'left',
              grid: { color: 'rgba(0,0,0,0.05)' },
              title: {
                display: true,
                text: 'Volumen (millones lb)',
                color: '#4CAF50'
              },
              ticks: {
                callback: (value) => value.toFixed(2) + 'M'
              }
            },
            'y-precio': {
              type: 'linear',
              display: true,
              position: 'right',
              grid: { drawOnChartArea: false },
              title: {
                display: true,
                text: 'Precio (USD)',
                color: '#FF9800'
              },
              ticks: {
                callback: (value) => '$' + value.toFixed(2)
              }
            },
            x: {
              grid: { display: false },
              ticks: {
                maxRotation: 45,
                minRotation: 45,
                font: {
                  size: 11
                }
              }
            }
          }
        }
      });
    };

    const actualizarGrafico = () => {
      if (!regionalChart.value) return;
      
      const ctx = regionalChart.value.getContext('2d');
      if (chartInstance) {
        chartInstance.destroy();
      }
      chartInstance = crearGraficoRegional(ctx);
    };

    onMounted(() => {
      actualizarGrafico();
    });

    watch(() => props.ranking, () => {
      actualizarGrafico();
    }, { deep: true });

    return {
      regionalChart
    };
  }
};
</script>

<style scoped>
.chart-card {
  background: white;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0,0,0,0.05);
  max-width: 1400px;
  margin: 0 auto;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-header h5 {
  font-weight: 600;
  color: #1a2e1a;
  margin: 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.insight-btn.small {
  background: none;
  border: 2px solid #2E7D32;
  color: #2E7D32;
  padding: 0.5rem 1.2rem;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.insight-btn.small:hover {
  background: #2E7D32;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.chart-container {
  height: 450px;
  position: relative;
}

.chart-footer {
  margin-top: 1rem;
  text-align: center;
}

.chart-note {
  font-size: 0.85rem;
  color: #999;
  font-style: italic;
}

@media (max-width: 768px) {
  .chart-container {
    height: 500px;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>