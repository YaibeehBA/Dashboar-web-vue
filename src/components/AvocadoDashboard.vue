<template>
  <div class="avocado-dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="container-fluid">
        <h1 class="display-4">🥑 Dashboard de Análisis de Aguacates</h1>
        <p class="lead">Análisis de precios, volumen y tendencias de mercado</p>
      </div>
    </header>

    <!-- Filtros -->
    <div class="container-fluid mt-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label fw-bold">Región</label>
              <select v-model="filtros.region" class="form-select" @change="aplicarFiltros">
                <option value="">Todas las regiones</option>
                <option v-for="region in regiones" :key="region" :value="region">
                  {{ region }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label fw-bold">Tipo de Producto</label>
              <select v-model="filtros.tipo" class="form-select" @change="aplicarFiltros">
                <option value="">Todos los tipos</option>
                <option v-for="tipo in tiposProducto" :key="tipo" :value="tipo">
                  {{ tipo }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label fw-bold">Año</label>
              <select v-model="filtros.anio" class="form-select" @change="aplicarFiltros">
                <option value="">Todos los años</option>
                <option v-for="anio in anios" :key="anio" :value="anio">
                  {{ anio }}
                </option>
              </select>
            </div>
            <div class="col-md-3 d-flex align-items-end">
              <button @click="limpiarFiltros" class="btn btn-outline-secondary w-100">
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="container-fluid mt-4">
      <div class="row g-3">
        <div class="col-md-3">
          <div class="card kpi-card shadow-sm border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Precio Promedio</h6>
                  <h3 class="mb-0">${{ kpis.precioPromedio }}</h3>
                </div>
                <div class="kpi-icon precio-icon">💰</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card kpi-card shadow-sm border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Volumen Total</h6>
                  <h3 class="mb-0">{{ kpis.volumenTotal }}</h3>
                  <small class="text-muted">millones de lb</small>
                </div>
                <div class="kpi-icon volumen-icon">📦</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card kpi-card shadow-sm border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Regiones Activas</h6>
                  <h3 class="mb-0">{{ kpis.regionesActivas }}</h3>
                </div>
                <div class="kpi-icon regiones-icon">🗺️</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card kpi-card shadow-sm border-0">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="text-muted mb-1">Registros</h6>
                  <h3 class="mb-0">{{ kpis.totalRegistros }}</h3>
                </div>
                <div class="kpi-icon registros-icon">📊</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos Principales -->
    <div class="container-fluid mt-4">
      <div class="row g-3">
        <!-- Evolución de Precio en el Tiempo -->
        <div class="col-md-8">
          <div class="card shadow-sm">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
              <div>
                <h5 class="mb-0">📈 Evolución del Precio Promedio en el Tiempo</h5>
                <small class="text-muted">Análisis de estacionalidad y tendencias</small>
              </div>
              <button 
                class="btn btn-sm btn-outline-success insight-btn"
                @click="mostrarInsight('estacionalidad')"
                data-bs-toggle="modal" 
                data-bs-target="#insightModal"
              >
                💡 Insight
              </button>
            </div>
            <div class="card-body">
              <canvas ref="precioTiempoChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Top 10 Regiones por Volumen -->
        <div class="col-md-4">
          <div class="card shadow-sm">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
              <div>
                <h5 class="mb-0">🏆 Top 10 Regiones por Volumen</h5>
              </div>
              <button 
                class="btn btn-sm btn-outline-success insight-btn"
                @click="mostrarInsight('concentracion')"
                data-bs-toggle="modal" 
                data-bs-target="#insightModal"
              >
                💡 Insight
              </button>
            </div>
            <div class="card-body">
              <canvas ref="topRegionesChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos Secundarios -->
    <div class="container-fluid mt-4">
      <div class="row g-3">
        <!-- Relación Precio-Volumen -->
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-header bg-white d-flex justify-content-between align-items-center">
              <div>
                <h5 class="mb-0">💹 Relación Precio vs Volumen</h5>
                <small class="text-muted">Análisis de elasticidad</small>
              </div>
              <button 
                class="btn btn-sm btn-outline-success insight-btn"
                @click="mostrarInsight('elasticidad')"
                data-bs-toggle="modal" 
                data-bs-target="#insightModal"
              >
                💡 Insight
              </button>
            </div>
            <div class="card-body">
              <canvas ref="precioVolumenChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Precio Promedio por Región -->
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">🌎 Precio Promedio por Región (Top 15)</h5>
            </div>
            <div class="card-body">
              <canvas ref="precioRegionChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Distribución por Tipo de Producto -->
    <div class="container-fluid mt-4">
      <div class="row g-3">
        <div class="col-md-4">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">🥑 Volumen por Tipo de Producto</h5>
            </div>
            <div class="card-body">
              <canvas ref="tipoProductoChart"></canvas>
            </div>
          </div>
        </div>

        <div class="col-md-8">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">📅 Estacionalidad Mensual del Precio</h5>
            </div>
            <div class="card-body">
              <canvas ref="estacionalidadChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de Rankings -->
    <div class="container-fluid mt-4 mb-5">
      <div class="card shadow-sm">
        <div class="card-header bg-white">
          <h5 class="mb-0">📋 Ranking de Regiones - Top 10</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-light">
                <tr>
                  <th>#</th>
                  <th>Región</th>
                  <th>Volumen Total (millones lb)</th>
                  <th>Precio Promedio (USD)</th>
                  <th>Registros</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in rankingRegiones.slice(0, 10)" :key="index">
                  <td><strong>{{ index + 1 }}</strong></td>
                  <td><strong>{{ item.region }}</strong></td>
                  <td>{{ formatVolumen(item.volumen) }}</td>
                  <td>${{ item.precio.toFixed(2) }}</td>
                  <td>{{ item.registros }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Insights -->
    <div class="modal fade" id="insightModal" tabindex="-1" aria-labelledby="insightModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-gradient-green text-white">
            <h5 class="modal-title" id="insightModalLabel">
              💡 {{ insightActual.titulo }}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">{{ insightActual.texto }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" data-bs-dismiss="modal">Entendido</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import datosAguacates from '../data/aguacates_limpio.json';

Chart.register(...registerables, ChartDataLabels);

export default {
  name: 'AvocadoDashboard',
  data() {
    return {
      datos: [],
      datosFiltrados: [],
      filtros: {
        region: '',
        tipo: '',
        anio: ''
      },
      regiones: [],
      tiposProducto: [],
      anios: [],
      kpis: {
        precioPromedio: 0,
        volumenTotal: 0,
        regionesActivas: 0,
        totalRegistros: 0
      },
      rankingRegiones: [],
      insights: {
        estacionalidad: '',
        concentracion: '',
        elasticidad: ''
      },
      insightActual: {
        titulo: '',
        texto: ''
      },
      charts: {}
    };
  },
  mounted() {
    this.cargarDatos();
  },
  methods: {
    cargarDatos() {
      // Convertir fechas y filtrar la región TotalUS (case insensitive)
      this.datos = datosAguacates
        .filter(item => item.region.toLowerCase() !== 'totalus')
        .map(item => ({
          ...item,
          fecha: new Date(item.fecha)
        }));

      // Extraer valores únicos para filtros
      this.regiones = [...new Set(this.datos.map(d => d.region))].sort();
      this.tiposProducto = [...new Set(this.datos.map(d => d.tipo_producto))].sort();
      this.anios = [...new Set(this.datos.map(d => d.anio))].sort();

      this.datosFiltrados = [...this.datos];
      this.calcularKPIs();
      this.calcularRanking();
      this.generarInsights();
      this.crearGraficos();
    },
    aplicarFiltros() {
      this.datosFiltrados = this.datos.filter(d => {
        let cumple = true;
        if (this.filtros.region) cumple = cumple && d.region === this.filtros.region;
        if (this.filtros.tipo) cumple = cumple && d.tipo_producto === this.filtros.tipo;
        if (this.filtros.anio) cumple = cumple && d.anio === parseInt(this.filtros.anio);
        return cumple;
      });

      this.calcularKPIs();
      this.calcularRanking();
      this.generarInsights();
      this.actualizarGraficos();
    },
    limpiarFiltros() {
      this.filtros = { region: '', tipo: '', anio: '' };
      this.datosFiltrados = [...this.datos];
      this.calcularKPIs();
      this.calcularRanking();
      this.generarInsights();
      this.actualizarGraficos();
    },
    mostrarInsight(tipo) {
      const titulos = {
        estacionalidad: 'Análisis de Estacionalidad',
        concentracion: 'Concentración Regional',
        elasticidad: 'Relación Precio-Demanda'
      };
      
      this.insightActual = {
        titulo: titulos[tipo],
        texto: this.insights[tipo]
      };
    },
    calcularKPIs() {
      const totalRegistros = this.datosFiltrados.length;
      const sumaPrecio = this.datosFiltrados.reduce((sum, d) => sum + d.precio_promedio, 0);
      const sumaVolumen = this.datosFiltrados.reduce((sum, d) => sum + d.volumen_total, 0);
      const regionesUnicas = new Set(this.datosFiltrados.map(d => d.region));

      this.kpis = {
        precioPromedio: (sumaPrecio / totalRegistros).toFixed(2),
        volumenTotal: (sumaVolumen / 1000000).toFixed(2),
        regionesActivas: regionesUnicas.size,
        totalRegistros: totalRegistros.toLocaleString()
      };
    },
    calcularRanking() {
      const porRegion = {};
      
      this.datosFiltrados.forEach(d => {
        if (!porRegion[d.region]) {
          porRegion[d.region] = {
            region: d.region,
            volumen: 0,
            precio: 0,
            registros: 0
          };
        }
        porRegion[d.region].volumen += d.volumen_total;
        porRegion[d.region].precio += d.precio_promedio;
        porRegion[d.region].registros++;
      });

      this.rankingRegiones = Object.values(porRegion)
        .map(r => ({
          ...r,
          precio: r.precio / r.registros
        }))
        .sort((a, b) => b.volumen - a.volumen);
    },
    generarInsights() {
      // Análisis de estacionalidad
      const porMes = {};
      this.datosFiltrados.forEach(d => {
        const mes = d.fecha.getMonth();
        if (!porMes[mes]) porMes[mes] = { suma: 0, count: 0 };
        porMes[mes].suma += d.precio_promedio;
        porMes[mes].count++;
      });

      const promediosPorMes = Object.entries(porMes).map(([mes, data]) => ({
        mes: parseInt(mes),
        promedio: data.suma / data.count
      }));

      if (promediosPorMes.length > 0) {
        const maxMes = promediosPorMes.reduce((max, m) => m.promedio > max.promedio ? m : max);
        const minMes = promediosPorMes.reduce((min, m) => m.promedio < min.promedio ? m : min);

        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        this.insights.estacionalidad = `Los precios son más altos en ${meses[maxMes.mes]} ($${maxMes.promedio.toFixed(2)}) y más bajos en ${meses[minMes.mes]} ($${minMes.promedio.toFixed(2)}), mostrando clara estacionalidad en el mercado de aguacates.`;
      }

      // Concentración regional
      if (this.rankingRegiones.length >= 3) {
        const top3Regiones = this.rankingRegiones.slice(0, 3);
        const volumenTop3 = top3Regiones.reduce((sum, r) => sum + r.volumen, 0);
        const volumenTotal = this.rankingRegiones.reduce((sum, r) => sum + r.volumen, 0);
        const porcentaje = ((volumenTop3 / volumenTotal) * 100).toFixed(1);

        this.insights.concentracion = `Las top 3 regiones (${top3Regiones.map(r => r.region).join(', ')}) concentran el ${porcentaje}% del volumen total de ventas, lo que indica una alta concentración geográfica en el mercado.`;
      }

      // Elasticidad
      const correlacion = this.calcularCorrelacion();
      if (correlacion < -0.3) {
        this.insights.elasticidad = `Se observa una relación inversa moderada (correlación: ${correlacion.toFixed(2)}) entre precio y volumen: cuando el precio aumenta, la demanda tiende a disminuir, indicando sensibilidad del consumidor al precio.`;
      } else if (correlacion > 0.3) {
        this.insights.elasticidad = `Existe una relación positiva (correlación: ${correlacion.toFixed(2)}) entre precio y volumen, lo cual puede indicar que períodos de alta demanda permiten precios más altos.`;
      } else {
        this.insights.elasticidad = `La elasticidad precio-demanda es baja (correlación: ${correlacion.toFixed(2)}), indicando que la demanda de aguacates es relativamente insensible a cambios de precio en el rango observado.`;
      }
    },
    calcularCorrelacion() {
      const n = this.datosFiltrados.length;
      if (n === 0) return 0;

      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

      this.datosFiltrados.forEach(d => {
        sumX += d.precio_promedio;
        sumY += d.volumen_total;
        sumXY += d.precio_promedio * d.volumen_total;
        sumX2 += d.precio_promedio * d.precio_promedio;
        sumY2 += d.volumen_total * d.volumen_total;
      });

      const numerador = (n * sumXY) - (sumX * sumY);
      const denominador = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

      return denominador === 0 ? 0 : numerador / denominador;
    },
    crearGraficos() {
      this.crearGraficoPrecioTiempo();
      this.crearGraficoTopRegiones();
      this.crearGraficoPrecioVolumen();
      this.crearGraficoPrecioRegion();
      this.crearGraficoTipoProducto();
      this.crearGraficoEstacionalidad();
    },
    crearGraficoPrecioTiempo() {
      // Agrupar por mes
      const porMesAnio = {};
      this.datosFiltrados.forEach(d => {
        const key = `${d.anio}-${String(d.fecha.getMonth() + 1).padStart(2, '0')}`;
        if (!porMesAnio[key]) porMesAnio[key] = { suma: 0, count: 0 };
        porMesAnio[key].suma += d.precio_promedio;
        porMesAnio[key].count++;
      });

      const datos = Object.entries(porMesAnio)
        .map(([fecha, data]) => ({
          fecha,
          promedio: data.suma / data.count
        }))
        .sort((a, b) => a.fecha.localeCompare(b.fecha));

      const ctx = this.$refs.precioTiempoChart.getContext('2d');
      this.charts.precioTiempo = new Chart(ctx, {
        type: 'line',
        data: {
          labels: datos.map(d => d.fecha),
          datasets: [{
            label: 'Precio Promedio',
            data: datos.map(d => d.promedio),
            borderColor: '#2D5016',
            backgroundColor: 'rgba(45, 80, 22, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 2,
            pointHoverRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `Precio: $${context.parsed.y.toFixed(2)}`
              }
            },
            datalabels: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                callback: (value) => '$' + value.toFixed(2)
              }
            }
          }
        }
      });
    },
    crearGraficoTopRegiones() {
      const top10 = this.rankingRegiones.slice(0, 10);

      const ctx = this.$refs.topRegionesChart.getContext('2d');
      this.charts.topRegiones = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: top10.map(r => r.region),
          datasets: [{
            label: 'Volumen (millones lb)',
            data: top10.map(r => r.volumen),
            backgroundColor: '#6B8E23',
            borderRadius: 5
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `Volumen: ${(context.parsed.x / 1000000).toFixed(2)}M lb`
              }
            },
            datalabels: {
              display: false
            }
          },
          scales: {
            x: {
              ticks: {
                callback: (value) => (value / 1000000).toFixed(2) + 'M'
              }
            }
          }
        }
      });
    },
    crearGraficoPrecioVolumen() {
      // Agrupar por rangos de precio
      const datos = this.datosFiltrados.map(d => ({
        x: d.volumen_total,
        y: d.precio_promedio
      }));

      const ctx = this.$refs.precioVolumenChart.getContext('2d');
      this.charts.precioVolumen = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Precio vs Volumen',
            data: datos.slice(0, 500), // Muestra limitada
            backgroundColor: 'rgba(107, 142, 35, 0.5)',
            pointRadius: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `Precio: $${context.parsed.y.toFixed(2)}, Volumen: ${(context.parsed.x / 1000).toFixed(2)}K lb`
              }
            },
            datalabels: {
              display: false
            }
          },
          scales: {
            x: {
              title: { display: true, text: 'Volumen Total (lb)' },
              ticks: {
                callback: (value) => (value / 1000).toFixed(2) + 'K'
              }
            },
            y: {
              title: { display: true, text: 'Precio Promedio (USD)' },
              ticks: {
                callback: (value) => '$' + value.toFixed(2)
              }
            }
          }
        }
      });
    },
    crearGraficoPrecioRegion() {
      const top15 = this.rankingRegiones.slice(0, 15);

      const ctx = this.$refs.precioRegionChart.getContext('2d');
      this.charts.precioRegion = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: top15.map(r => r.region),
          datasets: [{
            label: 'Precio Promedio',
            data: top15.map(r => r.precio),
            backgroundColor: '#556B2F',
            borderRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `Precio: $${context.parsed.y.toFixed(2)}`
              }
            },
            datalabels: {
              display: false
            }
          },
          scales: {
            y: {
              ticks: {
                callback: (value) => '$' + value.toFixed(2)
              }
            }
          }
        }
      });
    },
    crearGraficoTipoProducto() {
      const porTipo = {};
      this.datosFiltrados.forEach(d => {
        if (!porTipo[d.tipo_producto]) porTipo[d.tipo_producto] = 0;
        porTipo[d.tipo_producto] += d.volumen_total;
      });

      const total = Object.values(porTipo).reduce((sum, val) => sum + val, 0);

      const ctx = this.$refs.tipoProductoChart.getContext('2d');
      this.charts.tipoProducto = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(porTipo),
          datasets: [{
            data: Object.values(porTipo),
            backgroundColor: ['#6B8E23', '#8FBC8F', '#2D5016', '#9ACD32', '#556B2F']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { 
              position: 'bottom',
              labels: {
                padding: 15,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
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
                const percentage = ((value / total) * 100).toFixed(2);
                return percentage + '%';
              },
              color: '#fff',
              font: {
                weight: 'bold',
                size: 14
              }
            }
          }
        }
      });
    },
    crearGraficoEstacionalidad() {
      const porMes = Array(12).fill(0).map(() => ({ suma: 0, count: 0 }));
      
      this.datosFiltrados.forEach(d => {
        const mes = d.fecha.getMonth();
        porMes[mes].suma += d.precio_promedio;
        porMes[mes].count++;
      });

      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const promedios = porMes.map(m => m.count > 0 ? m.suma / m.count : 0);

      const ctx = this.$refs.estacionalidadChart.getContext('2d');
      this.charts.estacionalidad = new Chart(ctx, {
        type: 'line',
        data: {
          labels: meses,
          datasets: [{
            label: 'Precio Promedio Mensual',
            data: promedios,
            borderColor: '#2D5016',
            backgroundColor: 'rgba(45, 80, 22, 0.2)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `Precio: $${context.parsed.y.toFixed(2)}`
              }
            },
            datalabels: {
              display: false
            }
          },
          scales: {
            y: {
              ticks: {
                callback: (value) => '$' + value.toFixed(2)
              }
            }
          }
        }
      });
    },
    actualizarGraficos() {
      Object.values(this.charts).forEach(chart => chart.destroy());
      this.crearGraficos();
    },
    formatNumber(num) {
      return num.toLocaleString('es-ES', { maximumFractionDigits: 0 });
    },
    formatVolumen(num) {
      return (num / 1000000).toFixed(2);
    }
  }
};
</script>

<style scoped>
.avocado-dashboard {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding-bottom: 2rem;
}

.dashboard-header {
  background: linear-gradient(135deg, #2D5016 0%, #6B8E23 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 0;
}

.dashboard-header h1 {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.kpi-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: 4px solid #6B8E23;
}

.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

.kpi-icon {
  font-size: 2.5rem;
  opacity: 0.3;
}

.card {
  border: none;
  border-radius: 12px;
}

.card-header {
  border-bottom: 2px solid #f0f0f0;
  padding: 1rem 1.5rem;
}

.table-hover tbody tr:hover {
  background-color: rgba(107, 142, 35, 0.1);
}

.form-select:focus,
.btn:focus {
  border-color: #6B8E23;
  box-shadow: 0 0 0 0.2rem rgba(107, 142, 35, 0.25);
}

.btn-outline-secondary {
  border-color: #6B8E23;
  color: #6B8E23;
}

.btn-outline-secondary:hover {
  background-color: #6B8E23;
  border-color: #6B8E23;
  color: white;
}

.insight-btn {
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
  border-color: #6B8E23;
  color: #6B8E23;
  transition: all 0.3s ease;
}

.insight-btn:hover {
  background-color: #6B8E23;
  border-color: #6B8E23;
  color: white;
  transform: scale(1.05);
}

.bg-gradient-green {
  background: linear-gradient(135deg, #2D5016 0%, #6B8E23 100%);
}

.btn-close-white {
  filter: brightness(0) invert(1);
}

.modal-content {
  border-radius: 12px;
  border: none;
}

.modal-header {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.modal-body {
  padding: 2rem;
  font-size: 1.05rem;
  line-height: 1.6;
  color: #333;
}

.btn-success {
  background-color: #6B8E23;
  border-color: #6B8E23;
}

.btn-success:hover {
  background-color: #556B2F;
  border-color: #556B2F;
}
</style>