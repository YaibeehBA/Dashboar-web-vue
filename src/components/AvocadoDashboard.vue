<template>
  <div class="market-dashboard">
    <!-- Header Mejorado -->
    <header class="dashboard-header">
      <div class="container-fluid">
        <div class="header-content">
          <div>
            <h1>🥑 Avocado Market Intelligence</h1>
            <p class="subtitle">Análisis de precios y volumen de ventas para entender estacionalidad, variaciones regionales y relación precio–demanda</p>
          </div>
          <div class="header-badge">
            <span class="badge bg-white text-success">Actualizado 2025</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Filtros Mejorados -->
    <div class="container-fluid mt-4">
      <div class="filters-card">
        <div class="filters-header">
          <h5><span class="filter-icon">🔍</span> Filtros de Análisis</h5>
          <button @click="limpiarFiltros" class="btn-clear">
            <span>✕</span> Limpiar todo
          </button>
        </div>
        <div class="filters-grid">
          <div class="filter-group">
            <label class="filter-label">
              <span class="label-icon">📍</span> Región
            </label>
            <select v-model="filtros.region" @change="aplicarFiltros" class="filter-select">
              <option value="">Todas las regiones</option>
              <option v-for="region in regiones" :key="region" :value="region">
                {{ region }}
              </option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">
              <span class="label-icon">🥑</span> Tipo de Producto
            </label>
            <select v-model="filtros.tipo" @change="aplicarFiltros" class="filter-select">
              <option value="">Todos los tipos</option>
              <option v-for="tipo in tiposProducto" :key="tipo" :value="tipo">
                {{ tipo }}
              </option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">
              <span class="label-icon">📅</span> Año
            </label>
            <select v-model="filtros.anio" @change="aplicarFiltros" class="filter-select">
              <option value="">Todos los años</option>
              <option v-for="anio in anios" :key="anio" :value="anio">
                {{ anio }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- KPIs Mejorados -->
    <div class="container-fluid mt-4">
      <div class="kpi-grid">
        <div class="kpi-card premium">
          <div class="kpi-icon-wrapper">
            <span class="kpi-icon">💰</span>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Precio Promedio</span>
            <div class="kpi-value-group">
              <span class="kpi-main-value">${{ kpis.precioPromedio }}</span>
              <span :class="['kpi-trend-badge', kpis.precioCambio >= 0 ? 'trend-up' : 'trend-down']">
                {{ kpis.precioCambio >= 0 ? '▲' : '▼' }} {{ Math.abs(kpis.precioCambio) }}%
              </span>
            </div>
            <span class="kpi-subtext">vs período anterior</span>
          </div>
        </div>

        <div class="kpi-card premium">
          <div class="kpi-icon-wrapper">
            <span class="kpi-icon">📦</span>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Volumen Total</span>
            <div class="kpi-value-group">
              <span class="kpi-main-value">{{ kpis.volumenTotal }}M lb</span>
              <span :class="['kpi-trend-badge', kpis.volumenCambio >= 0 ? 'trend-up' : 'trend-down']">
                {{ kpis.volumenCambio >= 0 ? '▲' : '▼' }} {{ Math.abs(kpis.volumenCambio) }}%
              </span>
            </div>
            <span class="kpi-subtext">tendencia de mercado</span>
          </div>
        </div>

        <div class="kpi-card premium">
          <div class="kpi-icon-wrapper">
            <span class="kpi-icon">🥇</span>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Producto Dominante</span>
            <div class="kpi-value-group">
              <span class="kpi-main-value">PLU {{ kpis.productoDominante }}</span>
            </div>
            <span class="kpi-subtext">{{ kpis.productoDominanteVolumen }}</span>
          </div>
        </div>

        <div class="kpi-card premium">
          <div class="kpi-icon-wrapper">
            <span class="kpi-icon">🛍️</span>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Bolsas Pequeñas</span>
            <div class="kpi-value-group">
              <span class="kpi-main-value">{{ kpis.porcentajeBolsasPequenas }}%</span>
            </div>
            <span class="kpi-subtext">del total de bolsas</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráfico Principal: Evolución y Estacionalidad -->
    <div class="container-fluid mt-4">
      <div class="chart-card main-chart">
        <div class="chart-header">
          <div class="chart-title-group">
            <h5>📈 Análisis Temporal de Precios</h5>
            <div class="chart-mode-selector">
              <button 
                :class="['mode-btn', { active: chartMode === 'evolucion' }]"
                @click="cambiarModoGrafico('evolucion')"
              >
                Evolución Temporal
              </button>
              <button 
                :class="['mode-btn', { active: chartMode === 'estacionalidad' }]"
                @click="cambiarModoGrafico('estacionalidad')"
              >
                Estacionalidad Mensual
              </button>
            </div>
          </div>
          <button 
            class="insight-btn"
            @click="mostrarInsight(chartMode === 'evolucion' ? 'estacionalidad' : 'estacionalidad')"
            data-bs-toggle="modal" 
            data-bs-target="#insightModal"
          >
            💡 Ver Insight
          </button>
        </div>
        <div class="chart-container">
          <canvas ref="mainTimeChart"></canvas>
        </div>
        <div class="chart-footer">
          <span class="chart-note">
            {{ chartMode === 'evolucion' ? 'Evolución histórica del precio promedio por mes' : 'Patrón estacional promedio del precio a través del año' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Fila de Gráficos de Análisis Regional -->
    <div class="container-fluid mt-4">
      <div class="charts-grid-2col">
        <!-- Top Regiones por Volumen -->
        <div class="chart-card">
          <div class="chart-header">
            <h5>🏆 Top Regiones por Volumen</h5>
            <button 
              class="insight-btn small"
              @click="mostrarInsight('concentracion')"
              data-bs-toggle="modal" 
              data-bs-target="#insightModal"
            >
              💡
            </button>
          </div>
          <div class="chart-container">
            <canvas ref="topRegionesChart"></canvas>
          </div>
        </div>

        <!-- Precio por Región -->
        <div class="chart-card">
          <div class="chart-header">
            <h5>💰 Precio Promedio por Región</h5>
          </div>
          <div class="chart-container">
            <canvas ref="precioRegionChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Fila de Gráficos de Análisis de Mercado -->
    <div class="container-fluid mt-4">
      <div class="charts-grid-2col">
        <!-- Relación Precio-Volumen -->
        <div class="chart-card">
          <div class="chart-header">
            <h5>📊 Relación Precio vs Volumen</h5>
            <button 
              class="insight-btn small"
              @click="mostrarInsight('elasticidad')"
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

        <!-- Distribución por Tipo -->
        <div class="chart-card">
          <div class="chart-header">
            <h5>🥑 Distribución por Tipo</h5>
          </div>
          <div class="chart-container">
            <canvas ref="tipoProductoChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de Rankings -->
    <div class="container-fluid mt-4 mb-5">
      <div class="table-card">
        <div class="table-header">
          <h5>📋 Ranking de Regiones - Top 10</h5>
          <span class="table-badge">{{ rankingRegiones.length }} regiones activas</span>
        </div>
        <div class="table-responsive">
          <table class="ranking-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Región</th>
                <th>Volumen Total</th>
                <th>Precio Promedio</th>
                <th>Registros</th>
                <th>Participación</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in rankingRegiones.slice(0, 10)" :key="index">
                <td class="rank-cell">{{ index + 1 }}</td>
                <td class="region-cell"><strong>{{ item.region }}</strong></td>
                <td class="volume-cell">
                  <div class="volume-bar-container">
                    <span>{{ (item.volumen / 1000000).toFixed(2) }}M lb</span>
                    <div class="volume-bar">
                      <div 
                        class="volume-bar-fill" 
                        :style="{ width: (item.volumen / rankingRegiones[0].volumen * 100) + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="price-cell">${{ item.precio.toFixed(2) }}</td>
                <td class="records-cell">{{ item.registros.toLocaleString() }}</td>
                <td class="share-cell">
                  {{ ((item.volumen / rankingRegiones.reduce((sum, r) => sum + r.volumen, 0)) * 100).toFixed(1) }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Insights -->
    <div class="modal fade" id="insightModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content insight-modal">
          <div class="modal-header">
            <h5 class="modal-title">
              <span class="insight-modal-icon">💡</span>
              {{ insightActual.titulo }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>{{ insightActual.texto }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-insight-close" data-bs-dismiss="modal">Entendido</button>
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
      chartMode: 'evolucion',
      kpis: {
        precioPromedio: 0,
        precioCambio: 0,
        volumenTotal: 0,
        volumenCambio: 0,
        productoDominante: '',
        productoDominanteVolumen: '',
        porcentajeBolsasPequenas: 0,
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
      this.datos = datosAguacates
        .filter(item => item.region.toLowerCase() !== 'totalus')
        .map(item => ({
          ...item,
          fecha: new Date(item.fecha),
          precio_promedio: parseFloat(item.precio_promedio) || 0,
          volumen_total: parseFloat(item.volumen_total) || 0,
          volumen_tipo_4046: parseFloat(item.volumen_tipo_4046) || 0,
          volumen_tipo_4225: parseFloat(item.volumen_tipo_4225) || 0,
          volumen_tipo_4770: parseFloat(item.volumen_tipo_4770) || 0,
          bolsas_pequenas: parseFloat(item.bolsas_pequenas) || 0,
          bolsas_totales: parseFloat(item.bolsas_totales) || 0
        }));

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

    cambiarModoGrafico(modo) {
      this.chartMode = modo;
      this.actualizarGraficoPrincipal();
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
      const datosActuales = this.datosFiltrados;
      const totalRegistros = datosActuales.length;
      
      if (totalRegistros === 0) {
        this.kpis = {
          precioPromedio: '0.00',
          precioCambio: 0,
          volumenTotal: '0.00',
          volumenCambio: 0,
          productoDominante: 'N/A',
          productoDominanteVolumen: '0.00M lb',
          porcentajeBolsasPequenas: '0.0',
          regionesActivas: 0,
          totalRegistros: '0'
        };
        return;
      }

      const datosOrdenados = [...datosActuales].sort((a, b) => b.fecha - a.fecha);
      const puntoMedio = Math.floor(datosOrdenados.length / 2);
      const datosRecientes = datosOrdenados.slice(0, puntoMedio);
      const datosAnteriores = datosOrdenados.slice(puntoMedio);

      const sumaPrecio = datosActuales.reduce((sum, d) => sum + d.precio_promedio, 0);
      const precioPromedio = sumaPrecio / totalRegistros;
      
      const precioReciente = datosRecientes.length > 0 
        ? datosRecientes.reduce((sum, d) => sum + d.precio_promedio, 0) / datosRecientes.length 
        : precioPromedio;
      const precioAnterior = datosAnteriores.length > 0 
        ? datosAnteriores.reduce((sum, d) => sum + d.precio_promedio, 0) / datosAnteriores.length 
        : precioPromedio;
      const precioCambio = ((precioReciente - precioAnterior) / precioAnterior) * 100;

      const volumenTotal = datosActuales.reduce((sum, d) => sum + d.volumen_total, 0);
      
      const volumenReciente = datosRecientes.reduce((sum, d) => sum + d.volumen_total, 0);
      const volumenAnterior = datosAnteriores.reduce((sum, d) => sum + d.volumen_total, 0);
      const volumenCambio = ((volumenReciente - volumenAnterior) / volumenAnterior) * 100;

      const suma4046 = datosActuales.reduce((sum, d) => sum + d.volumen_tipo_4046, 0);
      const suma4225 = datosActuales.reduce((sum, d) => sum + d.volumen_tipo_4225, 0);
      const suma4770 = datosActuales.reduce((sum, d) => sum + d.volumen_tipo_4770, 0);

      const productos = [
        { codigo: '4046', volumen: suma4046 },
        { codigo: '4225', volumen: suma4225 },
        { codigo: '4770', volumen: suma4770 }
      ];
      
      const productoDominante = productos.reduce((max, p) => p.volumen > max.volumen ? p : max);

      const totalBolsas = datosActuales.reduce((sum, d) => sum + d.bolsas_totales, 0);
      const totalBolsasPequenas = datosActuales.reduce((sum, d) => sum + d.bolsas_pequenas, 0);
      const porcentajeBolsasPequenas = totalBolsas > 0 
        ? ((totalBolsasPequenas / totalBolsas) * 100).toFixed(1)
        : 0;

      const regionesUnicas = new Set(this.datosFiltrados.map(d => d.region));

      this.kpis = {
        precioPromedio: precioPromedio.toFixed(2),
        precioCambio: isNaN(precioCambio) ? 0 : parseFloat(precioCambio.toFixed(1)),
        volumenTotal: (volumenTotal / 1000000).toFixed(2),
        volumenCambio: isNaN(volumenCambio) ? 0 : parseFloat(volumenCambio.toFixed(1)),
        productoDominante: productoDominante.codigo,
        productoDominanteVolumen: (productoDominante.volumen / 1000000).toFixed(2) + 'M lb',
        porcentajeBolsasPequenas: porcentajeBolsasPequenas,
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

      if (this.rankingRegiones.length >= 3) {
        const top3Regiones = this.rankingRegiones.slice(0, 3);
        const volumenTop3 = top3Regiones.reduce((sum, r) => sum + r.volumen, 0);
        const volumenTotal = this.rankingRegiones.reduce((sum, r) => sum + r.volumen, 0);
        const porcentaje = ((volumenTop3 / volumenTotal) * 100).toFixed(1);

        this.insights.concentracion = `Las top 3 regiones (${top3Regiones.map(r => r.region).join(', ')}) concentran el ${porcentaje}% del volumen total de ventas, lo que indica una alta concentración geográfica en el mercado.`;
      }

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
      this.crearGraficoPrincipal();
      this.crearGraficoTopRegiones();
      this.crearGraficoPrecioVolumen();
      this.crearGraficoPrecioRegion();
      this.crearGraficoTipoProducto();
    },

    crearGraficoPrincipal() {
      const ctx = this.$refs.mainTimeChart.getContext('2d');
      
      if (this.charts.mainTime) {
        this.charts.mainTime.destroy();
      }

      if (this.chartMode === 'evolucion') {
        // Gráfico de evolución temporal
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

        this.charts.mainTime = new Chart(ctx, {
          type: 'line',
          data: {
            labels: datos.map(d => d.fecha),
            datasets: [{
              label: 'Precio Promedio',
              data: datos.map(d => d.promedio),
              borderColor: '#2E7D32',
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#2E7D32',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
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
                backgroundColor: '#1a2e1a',
                titleColor: '#fff',
                bodyColor: '#e0e0e0',
                padding: 12,
                callbacks: {
                  label: (context) => `Precio: $${context.parsed.y.toFixed(2)}`
                }
              },
              datalabels: { display: false }
            },
            scales: {
              y: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: {
                  callback: (value) => '$' + value.toFixed(2)
                }
              },
              x: {
                grid: { display: false },
                ticks: { maxRotation: 45, minRotation: 45 }
              }
            }
          }
        });
      } else {
        // Gráfico de estacionalidad mensual
        const porMes = Array(12).fill(0).map(() => ({ suma: 0, count: 0 }));
        
        this.datosFiltrados.forEach(d => {
          const mes = d.fecha.getMonth();
          porMes[mes].suma += d.precio_promedio;
          porMes[mes].count++;
        });

        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const promedios = porMes.map(m => m.count > 0 ? m.suma / m.count : 0);

        this.charts.mainTime = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: meses,
            datasets: [{
              label: 'Precio Promedio Mensual',
              data: promedios,
              backgroundColor: 'rgba(46, 125, 50, 0.7)',
              borderRadius: 8,
              barPercentage: 0.6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#1a2e1a',
                callbacks: {
                  label: (context) => `Precio: $${context.parsed.y.toFixed(2)}`
                }
              },
              datalabels: { display: false }
            },
            scales: {
              y: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: {
                  callback: (value) => '$' + value.toFixed(2)
                }
              },
              x: {
                grid: { display: false }
              }
            }
          }
        });
      }
    },

    actualizarGraficoPrincipal() {
      if (this.charts.mainTime) {
        this.charts.mainTime.destroy();
      }
      this.crearGraficoPrincipal();
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
            data: top10.map(r => r.volumen / 1000000),
            backgroundColor: '#4CAF50',
            borderRadius: 8,
            barPercentage: 0.7
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `Volumen: ${context.parsed.x.toFixed(2)}M lb`
              }
            },
            datalabels: { display: false }
          },
          scales: {
            x: {
              grid: { color: 'rgba(0,0,0,0.05)' },
              title: { display: true, text: 'Millones de libras', color: '#666' }
            },
            y: {
              grid: { display: false }
            }
          }
        }
      });
    },

    crearGraficoPrecioVolumen() {
      // Tomar muestra para mejor rendimiento
      const datos = this.datosFiltrados
        .filter((_, i) => i % 5 === 0)
        .map(d => ({
          x: d.volumen_total / 1000000,
          y: d.precio_promedio
        }));

      const ctx = this.$refs.precioVolumenChart.getContext('2d');
      this.charts.precioVolumen = new Chart(ctx, {
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
            backgroundColor: '#FF9800',
            borderRadius: 8,
            barPercentage: 0.7
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `Precio: $${context.parsed.x.toFixed(2)}`
              }
            },
            datalabels: { display: false }
          },
          scales: {
            x: {
              grid: { color: 'rgba(0,0,0,0.05)' },
              title: { display: true, text: 'Precio (USD)', color: '#666' },
              ticks: {
                callback: (value) => '$' + value.toFixed(2)
              }
            },
            y: {
              grid: { display: false }
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
      const colores = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800'];

      const ctx = this.$refs.tipoProductoChart.getContext('2d');
      this.charts.tipoProducto = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(porTipo),
          datasets: [{
            data: Object.values(porTipo),
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
    },

    actualizarGraficos() {
      Object.values(this.charts).forEach(chart => {
        if (chart) chart.destroy();
      });
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
@import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap');

* {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.market-dashboard {
  background: #F8FAF8;
  min-height: 100vh;
  padding-bottom: 2rem;
}

/* Header Mejorado */
.dashboard-header {
  background: linear-gradient(135deg, #1B4D1B 0%, #2E7D32 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  font-weight: 700;
  font-size: 2.2rem;
  margin: 0;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0.5rem 0 0 0;
  max-width: 600px;
}

.header-badge .badge {
  padding: 0.5rem 1.2rem;
  border-radius: 30px;
  font-weight: 500;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Filtros Mejorados */
.filters-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0,0,0,0.05);
  max-width: 1400px;
  margin: 0 auto;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}

.filters-header h5 {
  font-weight: 600;
  color: #1a2e1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-icon {
  font-size: 1.2rem;
}

.btn-clear {
  background: none;
  border: none;
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-clear:hover {
  background: #f5f5f5;
  color: #d32f2f;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: #2E7D32;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.label-icon {
  font-size: 1rem;
}

.filter-select {
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
}

.filter-select:hover {
  border-color: #4CAF50;
}

.filter-select:focus {
  border-color: #2E7D32;
  outline: none;
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
}

/* KPIs Mejorados */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.kpi-card.premium {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.kpi-card.premium:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.kpi-icon-wrapper {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-icon {
  font-size: 2rem;
}

.kpi-content {
  flex: 1;
}

.kpi-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 0.3rem;
}

.kpi-value-group {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  margin-bottom: 0.2rem;
}

.kpi-main-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a2e1a;
  line-height: 1;
}

.kpi-trend-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
}

.trend-up {
  background: #E8F5E9;
  color: #2E7D32;
}

.trend-down {
  background: #FFEBEE;
  color: #C62828;
}

.kpi-subtext {
  font-size: 0.75rem;
  color: #999;
}

/* Gráficos */
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

.insight-btn.small {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
}

.chart-container {
  height: 350px;
  position: relative;
}

.main-chart .chart-container {
  height: 400px;
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

/* Grid de 2 columnas */
.charts-grid-2col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Tabla de Ranking */
.table-card {
  background: white;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0,0,0,0.05);
  max-width: 1400px;
  margin: 0 auto;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.table-header h5 {
  font-weight: 600;
  color: #1a2e1a;
  margin: 0;
  font-size: 1.2rem;
}

.table-badge {
  background: #E8F5E9;
  color: #2E7D32;
  padding: 0.4rem 1rem;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 500;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
}

.ranking-table th {
  text-align: left;
  padding: 1rem;
  background: #F5F5F5;
  color: #1a2e1a;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 12px 12px 0 0;
}

.ranking-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.ranking-table tbody tr:hover {
  background: #F8FAF8;
  cursor: pointer;
}

.rank-cell {
  font-weight: 700;
  color: #2E7D32;
  width: 50px;
}

.region-cell {
  font-weight: 500;
  color: #1a2e1a;
}

.volume-bar-container {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.volume-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  width: 150px;
}

.volume-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #2E7D32);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.price-cell {
  font-weight: 600;
  color: #FF9800;
}

.records-cell {
  color: #666;
}

.share-cell {
  font-weight: 600;
  color: #2E7D32;
}

/* Modal */
.insight-modal {
  border-radius: 24px;
  overflow: hidden;
  border: none;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.insight-modal .modal-header {
  background: linear-gradient(135deg, #1B4D1B 0%, #2E7D32 100%);
  color: white;
  border: none;
  padding: 1.5rem;
}

.insight-modal .modal-title {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.insight-modal-icon {
  font-size: 1.5rem;
}

.insight-modal .modal-body {
  padding: 1.5rem;
  font-size: 1rem;
  line-height: 1.6;
  color: #1a2e1a;
}

.insight-modal .modal-footer {
  border: none;
  padding: 1.5rem;
  padding-top: 0;
}

.btn-insight-close {
  background: #2E7D32;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.btn-insight-close:hover {
  background: #1B4D1B;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

/* Responsive */
@media (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-grid-2col {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-title-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .ranking-table {
    font-size: 0.85rem;
  }
  
  .volume-bar {
    width: 100px;
  }
}
</style>