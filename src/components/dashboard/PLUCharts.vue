<template>
  <div class="container-fluid mt-4">
    <div class="charts-grid-2col">
      <!-- Distribución por Tipo de Producto (PLU) -->
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
          <canvas ref="tipoProductoChart"></canvas>
        </div>
        <div class="chart-footer">
          <span class="chart-note">Distribución de volumen por código PLU (4046, 4225, 4770)</span>
        </div>
      </div>

      <!-- Evolución de Variedades PLU por Año -->
      <div class="chart-card">
        <div class="chart-header">
          <h5>📈 Evolución de Variedades PLU por Año</h5>
          <button 
            class="insight-btn small"
            @click="$emit('mostrar-insight', 'tendencias')"
            data-bs-toggle="modal" 
            data-bs-target="#insightModal"
          >
            💡
          </button>
        </div>
        <div class="chart-container">
          <canvas ref="pluEvolutionChart"></canvas>
        </div>
        <div class="chart-footer">
          <span class="chart-note">Tendencia anual del volumen por tipo de aguacate</span>
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
  name: 'PLUCharts',
  props: {
    datos: {
      type: Array,
      required: true
    }
  },
  emits: ['mostrar-insight'],
  setup(props) {
    const tipoProductoChart = ref(null);
    const pluEvolutionChart = ref(null);
    let tipoProductoInstance = null;
    let pluEvolutionInstance = null;

    // Mapeo de códigos PLU a nombres descriptivos
    const pluNames = {
      '4046': 'Pequeño (PLU 4046)',
      '4225': 'Mediano (PLU 4225)',
      '4770': 'Grande (PLU 4770)'
    };

    const crearGraficoDistribucionPLU = (ctx) => {
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
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: { 
              position: 'bottom',
              labels: {
                padding: 20,
                font: { size: 12 }
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
              formatter: (value) => {
                const percentage = ((value / total) * 100).toFixed(1);
                return percentage + '%';
              },
              color: '#fff',
              font: {
                weight: 'bold',
                size: 12
              }
            }
          }
        }
      });
    };

    const crearGraficoEvolucionPLU = (ctx) => {
      // Agrupar por año
      const porAnio = {};
      
      props.datos.forEach(d => {
        const anio = d.anio;
        if (!porAnio[anio]) {
          porAnio[anio] = {
            '4046': 0,
            '4225': 0,
            '4770': 0,
            total: 0
          };
        }
        porAnio[anio]['4046'] += d.volumen_tipo_4046 || 0;
        porAnio[anio]['4225'] += d.volumen_tipo_4225 || 0;
        porAnio[anio]['4770'] += d.volumen_tipo_4770 || 0;
        porAnio[anio].total += (d.volumen_tipo_4046 || 0) + (d.volumen_tipo_4225 || 0) + (d.volumen_tipo_4770 || 0);
      });

      // Ordenar años
      const años = Object.keys(porAnio).sort((a, b) => a - b);
      
      // Calcular porcentajes
      const data4046 = años.map(anio => ((porAnio[anio]['4046'] / porAnio[anio].total) * 100).toFixed(1));
      const data4225 = años.map(anio => ((porAnio[anio]['4225'] / porAnio[anio].total) * 100).toFixed(1));
      const data4770 = años.map(anio => ((porAnio[anio]['4770'] / porAnio[anio].total) * 100).toFixed(1));

      return new Chart(ctx, {
        type: 'line',
        data: {
          labels: años,
          datasets: [
            {
              label: 'PLU 4046 (Pequeño)',
              data: data4046,
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              borderWidth: 3,
              tension: 0.4,
              fill: false,
              pointBackgroundColor: '#4CAF50',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7
            },
            {
              label: 'PLU 4225 (Mediano)',
              data: data4225,
              borderColor: '#FF9800',
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              borderWidth: 3,
              tension: 0.4,
              fill: false,
              pointBackgroundColor: '#FF9800',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7
            },
            {
              label: 'PLU 4770 (Grande)',
              data: data4770,
              borderColor: '#f44336',
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              borderWidth: 3,
              tension: 0.4,
              fill: false,
              pointBackgroundColor: '#f44336',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7
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
                boxWidth: 6
              }
            },
            tooltip: {
              backgroundColor: '#1a2e1a',
              callbacks: {
                label: (context) => {
                  return `${context.dataset.label}: ${context.parsed.y}%`;
                }
              }
            },
            datalabels: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: { color: 'rgba(0,0,0,0.05)' },
              title: {
                display: true,
                text: 'Porcentaje del volumen total',
                color: '#666'
              },
              ticks: {
                callback: (value) => value + '%'
              }
            },
            x: {
              grid: { display: false },
              title: {
                display: true,
                text: 'Año',
                color: '#666'
              }
            }
          }
        }
      });
    };

    const actualizarGraficos = () => {
      if (tipoProductoChart.value) {
        if (tipoProductoInstance) tipoProductoInstance.destroy();
        tipoProductoInstance = crearGraficoDistribucionPLU(tipoProductoChart.value.getContext('2d'));
      }

      if (pluEvolutionChart.value) {
        if (pluEvolutionInstance) pluEvolutionInstance.destroy();
        pluEvolutionInstance = crearGraficoEvolucionPLU(pluEvolutionChart.value.getContext('2d'));
      }
    };

    onMounted(() => {
      actualizarGraficos();
    });

    watch(() => props.datos, () => {
      actualizarGraficos();
    }, { deep: true });

    return {
      tipoProductoChart,
      pluEvolutionChart
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