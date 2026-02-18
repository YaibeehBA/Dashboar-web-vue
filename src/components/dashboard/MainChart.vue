<template>
  <div class="container-fluid mt-4">
    <div class="chart-card main-chart">
      <div class="chart-header">
        <div class="chart-title-group">
          <h5>📈 Análisis Temporal: Precio y Volumen</h5>
          <div class="chart-mode-selector">
            <button 
              :class="['mode-btn', { active: modelValue === 'evolucion' }]"
              @click="$emit('update:modelValue', 'evolucion')"
            >
              Evolución Temporal
            </button>
            <button 
              :class="['mode-btn', { active: modelValue === 'estacionalidad' }]"
              @click="$emit('update:modelValue', 'estacionalidad')"
            >
              Estacionalidad Mensual
            </button>
          </div>
        </div>
        <button 
          class="insight-btn"
          @click="$emit('mostrar-insight', 'estacionalidad')"
          data-bs-toggle="modal" 
          data-bs-target="#insightModal"
        >
          💡 Ver Insight
        </button>
      </div>
      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
      <div class="chart-footer">
        <span class="chart-note">
          {{ modelValue === 'evolucion' 
            ? 'Evolución histórica del precio promedio y volumen total por mes' 
            : 'Patrón estacional promedio del precio y volumen a través del año' 
          }}
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
  name: 'MainChart',
  props: {
    datos: {
      type: Array,
      required: true
    },
    modelValue: {
      type: String,
      default: 'evolucion'
    }
  },
  emits: ['update:modelValue', 'mostrar-insight'],
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    const crearGraficoEvolucion = (ctx) => {
      const porMesAnio = {};
      
      props.datos.forEach(d => {
        // Extraer año y mes de la fecha
        const fecha = new Date(d.fecha);
        const anio = fecha.getFullYear();
        const mes = fecha.getMonth() + 1;
        const key = `${anio}-${String(mes).padStart(2, '0')}`;
        
        if (!porMesAnio[key]) {
          porMesAnio[key] = { 
            precioSuma: 0, 
            volumenSuma: 0, 
            count: 0,
            anio,
            mes
          };
        }
        porMesAnio[key].precioSuma += d.precio_promedio;
        porMesAnio[key].volumenSuma += d.volumen_total;
        porMesAnio[key].count++;
      });

      const datos = Object.entries(porMesAnio)
        .map(([fecha, data]) => ({
          fecha,
          precio: data.precioSuma / data.count,
          volumen: data.volumenSuma / data.count / 1000000,
          anio: data.anio,
          mes: data.mes
        }))
        .sort((a, b) => a.fecha.localeCompare(b.fecha));

      // Formatear etiquetas para mostrar solo año-mes de manera más legible
      const labels = datos.map(d => {
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return `${meses[d.mes - 1]} ${d.anio}`;
      });

      return new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Precio Promedio ($)',
              data: datos.map(d => d.precio),
              borderColor: '#2E7D32',
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              borderWidth: 3,
              tension: 0.4,
              yAxisID: 'y-precio',
              fill: false,
              pointBackgroundColor: '#2E7D32',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6
            },
            {
              label: 'Volumen (millones lb)',
              data: datos.map(d => d.volumen),
              borderColor: '#FF9800',
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              borderWidth: 3,
              tension: 0.4,
              yAxisID: 'y-volumen',
              fill: false,
              pointBackgroundColor: '#FF9800',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6
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
              titleColor: '#fff',
              bodyColor: '#e0e0e0',
              padding: 12,
              callbacks: {
                title: (tooltipItems) => {
                  return tooltipItems[0].label;
                },
                label: (context) => {
                  if (context.dataset.label.includes('Precio')) {
                    return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                  } else {
                    return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}M lb`;
                  }
                }
              }
            },
            datalabels: { display: false }
          },
          scales: {
            'y-precio': {
              type: 'linear',
              display: true,
              position: 'left',
              grid: { color: 'rgba(0,0,0,0.05)' },
              title: {
                display: true,
                text: 'Precio (USD)',
                color: '#2E7D32'
              },
              ticks: {
                callback: (value) => '$' + value.toFixed(2)
              }
            },
            'y-volumen': {
              type: 'linear',
              display: true,
              position: 'right',
              grid: { drawOnChartArea: false },
              title: {
                display: true,
                text: 'Volumen (millones lb)',
                color: '#FF9800'
              },
              ticks: {
                callback: (value) => value.toFixed(2) + 'M'
              }
            },
            x: {
              grid: { display: false },
              ticks: { 
                maxRotation: 45, 
                minRotation: 45,
                maxTicksLimit: 20 // Limitar el número de etiquetas para no saturar
              }
            }
          }
        }
      });
    };

    const crearGraficoEstacionalidad = (ctx) => {
      const porMes = Array(12).fill(0).map(() => ({ 
        precioSuma: 0, 
        volumenSuma: 0, 
        count: 0 
      }));
      
      props.datos.forEach(d => {
        const fecha = new Date(d.fecha);
        const mes = fecha.getMonth();
        porMes[mes].precioSuma += d.precio_promedio;
        porMes[mes].volumenSuma += d.volumen_total;
        porMes[mes].count++;
      });

      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const precios = porMes.map(m => m.count > 0 ? m.precioSuma / m.count : 0);
      const volumenes = porMes.map(m => m.count > 0 ? (m.volumenSuma / m.count) / 1000000 : 0);

      return new Chart(ctx, {
        type: 'bar',
        data: {
          labels: meses,
          datasets: [
            {
              label: 'Precio Promedio ($)',
              data: precios,
              backgroundColor: 'rgba(46, 125, 50, 0.7)',
              yAxisID: 'y-precio',
              borderRadius: 8,
              barPercentage: 0.6
            },
            {
              label: 'Volumen Promedio (millones lb)',
              data: volumenes,
              backgroundColor: 'rgba(255, 152, 0, 0.7)',
              yAxisID: 'y-volumen',
              borderRadius: 8,
              barPercentage: 0.6
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
                  if (context.dataset.label.includes('Precio')) {
                    return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                  } else {
                    return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}M lb`;
                  }
                }
              }
            },
            datalabels: { display: false }
          },
          scales: {
            'y-precio': {
              type: 'linear',
              display: true,
              position: 'left',
              grid: { color: 'rgba(0,0,0,0.05)' },
              title: {
                display: true,
                text: 'Precio (USD)',
                color: '#2E7D32'
              },
              ticks: {
                callback: (value) => '$' + value.toFixed(2)
              }
            },
            'y-volumen': {
              type: 'linear',
              display: true,
              position: 'right',
              grid: { drawOnChartArea: false },
              title: {
                display: true,
                text: 'Volumen (millones lb)',
                color: '#FF9800'
              },
              ticks: {
                callback: (value) => value.toFixed(2) + 'M'
              }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
    };

    const actualizarGrafico = () => {
      if (!chartCanvas.value) return;
      
      const ctx = chartCanvas.value.getContext('2d');
      if (chartInstance) {
        chartInstance.destroy();
      }

      if (props.modelValue === 'evolucion') {
        chartInstance = crearGraficoEvolucion(ctx);
      } else {
        chartInstance = crearGraficoEstacionalidad(ctx);
      }
    };

    onMounted(() => {
      actualizarGrafico();
    });

    watch(() => [props.datos, props.modelValue], () => {
      actualizarGrafico();
    }, { deep: true });

    return {
      chartCanvas
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
}

.chart-card.main-chart {
  max-width: 1400px;
  margin: 0 auto;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-title-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.chart-title-group h5 {
  font-weight: 600;
  color: #1a2e1a;
  margin: 0;
  font-size: 1.2rem;
}

.chart-mode-selector {
  display: flex;
  gap: 0.5rem;
  background: #F5F5F5;
  padding: 0.3rem;
  border-radius: 30px;
}

.mode-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-btn.active {
  background: #2E7D32;
  color: white;
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.3);
}

.insight-btn {
  background: none;
  border: 2px solid #2E7D32;
  color: #2E7D32;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.insight-btn:hover {
  background: #2E7D32;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.chart-container {
  height: 400px;
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
  .chart-title-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>