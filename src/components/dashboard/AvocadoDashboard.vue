<template>
  <div class="market-dashboard">
    <DashboardHeader />
    
    <DashboardFilters 
      v-model="filtros"
      :regiones="regiones"
      :tiposProducto="tiposProducto"
      :anios="anios"
      @aplicar="aplicarFiltros"
      @limpiar="limpiarFiltros"
    />

    <KPIGrid :kpis="kpis" />

    <MainChart 
      v-model="chartMode"
      :datos="datosFiltrados"
      @mostrar-insight="mostrarInsight"
    />

    <!-- Componente unificado de análisis regional -->
    <RegionalCharts 
      :ranking="rankingRegiones"
      @mostrar-insight="mostrarInsight"
    />

    <MarketCharts 
      :datos="datosFiltrados"
      @mostrar-insight="mostrarInsight"
    />

    <RankingTable :ranking="rankingRegiones" />

    <InsightModal :insight="insightActual" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useAvocadoData } from '../../composables/useAvocadoData';
import DashboardHeader from './DashboardHeader.vue';
import DashboardFilters from './DashboardFilters.vue';
import KPIGrid from './KPIGrid.vue';
import MainChart from './MainChart.vue';
import RegionalCharts from './RegionalCharts.vue'; // Versión unificada
import MarketCharts from './MarketCharts.vue';
import RankingTable from './RankingTable.vue';
import InsightModal from './InsightModal.vue';

export default {
  name: 'AvocadoDashboard',
  components: {
    DashboardHeader,
    DashboardFilters,
    KPIGrid,
    MainChart,
    RegionalCharts,
    MarketCharts,
    RankingTable,
    InsightModal
  },
  setup() {
    const {
      datos,
      datosFiltrados,
      filtros,
      regiones,
      tiposProducto,
      anios,
      cargarDatos,
      aplicarFiltros: aplicarFiltrosData,
      limpiarFiltros: limpiarFiltrosData,
      calcularKPIs,
      calcularRanking,
      generarInsights
    } = useAvocadoData();

    const chartMode = ref('evolucion');
    const kpis = ref({});
    const rankingRegiones = ref([]);
    const insights = ref({});
    const insightActual = ref({ titulo: '', texto: '' });

    const aplicarFiltros = () => {
      aplicarFiltrosData();
      actualizarDatos();
    };

    const limpiarFiltros = () => {
      limpiarFiltrosData();
      actualizarDatos();
    };

    const actualizarDatos = () => {
      kpis.value = calcularKPIs();
      rankingRegiones.value = calcularRanking();
      insights.value = generarInsights();
    };

    const mostrarInsight = (tipo) => {
      const titulos = {
        estacionalidad: 'Análisis de Estacionalidad',
        concentracion: 'Concentración Regional',
        elasticidad: 'Relación Precio-Demanda'
      };
      
      insightActual.value = {
        titulo: titulos[tipo] || 'Insight',
        texto: insights.value[tipo] || 'No hay información disponible'
      };
    };

    onMounted(() => {
      cargarDatos();
      actualizarDatos();
    });

    return {
      filtros,
      datosFiltrados,
      regiones,
      tiposProducto,
      anios,
      chartMode,
      kpis,
      rankingRegiones,
      insightActual,
      aplicarFiltros,
      limpiarFiltros,
      mostrarInsight
    };
  }
};
</script>

<style scoped>
.market-dashboard {
  background:linear-gradient(135deg, #1B4D1B 0%, #2E7D32 100%);
  min-height: 100vh;
  padding-bottom: 2rem;
}
</style>