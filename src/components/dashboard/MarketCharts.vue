<template>
  <div class="container-fluid mt-4">
    <div class="charts-grid-2col">
      <!-- Relación Precio-Volumen -->
      <div class="chart-card">
        <div class="chart-header">
          <h5>📊 Relación Precio vs Volumen</h5>
          <button 
            class="insight-btn small"
            @click="$emit('mostrar-insight', 'elasticidad')"
            data-bs-toggle="modal" 
            data-bs-target="#insightModal"
          >
            💡
          </button>
        </div>
        <div class="chart-container">
          <canvas ref="precioVolumenChart"></canvas>
        </div>
        <div class="chart-footer">
          <span class="chart-note">Análisis de elasticidad precio-demanda</span>
        </div>
      </div>

      <!-- Distribución por Variedad PLU (Gráfico de Anillo con porcentajes dentro) -->
      <div class="chart-card">
        <div class="chart-header">
          <h5>🥑 Distribución por Variedad PLU</h5>
          <button 
            class="insight-btn small"
            @click="$emit('mostrar-insight', 'variedad')"
            data-bs-toggle="modal" 
            data-bs-target="#insightModal"
          >
            💡
          </button>
        </div>
        <div class="chart-container">
          <canvas ref="pluDonutChart"></canvas>
        </div>
        <div class="chart-footer">
          <span class="chart-note">Distribución de volumen por código PLU (4046, 4225, 4770)</span>
        </div>
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
  name: 'MarketCharts',
  props: {
    datos: {
      type: Array,
      required: true
    }
  },
  emits: ['mostrar-insight'],
  setup(props) {
    const precioVolumenChart = ref(null);
    const pluDonutChart = ref(null);
    let precioVolumenInstance = null;
    let pluDonutInstance = null;

    // Mapeo de códigos PLU a nombres descriptivos
    const pluNames = {
      '4046': 'PLU 4046 (Pequeño)',
      '4225': 'PLU 4225 (Mediano)',
      '4770': 'PLU 4770 (Grande)'
    };

    const crearGraficoPrecioVolumen = (ctx) => {
      const datos = props.datos
        .filter((_, i) => i % 5 === 0)
        .map(d => ({
          x: d.volumen_total / 1000000,
          y: d.precio_promedio
        }));

      return new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Precio vs Volumen',
            data: datos,
            backgroundColor: 'rgba(76, 175, 80, 0.6)',
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `Precio: $${context.parsed.y.toFixed(2)} | Volumen: ${context.parsed.x.toFixed(2)}M lb`
              }
            },
            datalabels: { display: false }
          },
          scales: {
            x: {
              title: { display: true, text: 'Volumen (millones lb)', color: '#666' },
              grid: { color: 'rgba(0,0,0,0.05)' }
            },
            y: {
              title: { display: true, text: 'Precio (USD)', color: '#666' },
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                callback: (value) => '$' + value.toFixed(2)
              }
            }
          }
        }
      });
    };

    const crearGraficoDonutPLU = (ctx) => {
      // Calcular volumen por tipo de PLU
      const porTipo = {
        '4046': 0,
        '4225': 0,
        '4770': 0
      };
      
      props.datos.forEach(d => {
        porTipo['4046'] += d.volumen_tipo_4046 || 0;
        porTipo['4225'] += d.volumen_tipo_4225 || 0;
        porTipo['4770'] += d.volumen_tipo_4770 || 0;
      });

      const total = Object.values(porTipo).reduce((sum, val) => sum + val, 0);
      const labels = Object.keys(porTipo).map(codigo => pluNames[codigo] || codigo);
      const valores = Object.values(porTipo);
      const colores = ['#4CAF50', '#FF9800', '#f44336'];

      return new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: valores,
            backgroundColor: colores,
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: { 
              position: 'bottom',
              labels: {
                padding: 20,
                font: { size: 12 },
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              backgroundColor: '#1a2e1a',
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed;
                  const percentage = ((value / total) * 100).toFixed(2);
                  const volumenMiles = (value / 1000000).toFixed(2);
                  return `${label}: ${percentage}% (${volumenMiles}M lb)`;
                }
              }
            },
            datalabels: {
              display: true,
              backgroundColor: function(context) {
                return context.dataset.backgroundColor[context.dataIndex];
              },
              borderRadius: 4,
              color: 'white',
              font: {
                weight: 'bold',
                size: 14
              },
              padding: {
                top: 4,
                bottom: 4,
                left: 8,
                right: 8
              },
              formatter: (value, context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return percentage + '%';
              },
              anchor: 'center',
              align: 'center',
              offset: 0
            }
          },
          layout: {
            padding: {
              top: 20,
              bottom: 20,
              left: 20,
              right: 20
            }
          }
        }
      });
    };

    const actualizarGraficos = () => {
      if (precioVolumenChart.value) {
        if (precioVolumenInstance) precioVolumenInstance.destroy();
        precioVolumenInstance = crearGraficoPrecioVolumen(precioVolumenChart.value.getContext('2d'));
      }

      if (pluDonutChart.value) {
        if (pluDonutInstance) pluDonutInstance.destroy();
        pluDonutInstance = crearGraficoDonutPLU(pluDonutChart.value.getContext('2d'));
      }
    };

    onMounted(() => {
      actualizarGraficos();
    });

    watch(() => props.datos, () => {
      actualizarGraficos();
    }, { deep: true });

    return {
      precioVolumenChart,
      pluDonutChart
    };
  }
};
</script>

<style scoped>
.charts-grid-2col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.chart-card {
  background: white;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0,0,0,0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-header h5 {
  font-weight: 600;
  color: #1a2e1a;
  margin: 0;
  font-size: 1.2rem;
}

.insight-btn.small {
  background: none;
  border: 2px solid #2E7D32;
  color: #2E7D32;
  padding: 0.4rem 0.8rem;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.insight-btn.small:hover {
  background: #2E7D32;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.chart-container {
  height: 350px;
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

@media (max-width: 992px) {
  .charts-grid-2col {
    grid-template-columns: 1fr;
  }
}
</style>