<template>
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
          <span class="kpi-icon">💵</span>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Ingresos Totales</span>
          <div class="kpi-value-group">
            <span class="kpi-main-value">${{ kpis.ingresosTotales }}M</span>
            <span :class="['kpi-trend-badge', kpis.ingresosCambio >= 0 ? 'trend-up' : 'trend-down']">
              {{ kpis.ingresosCambio >= 0 ? '▲' : '▼' }} {{ Math.abs(kpis.ingresosCambio) }}%
            </span>
          </div>
          <span class="kpi-subtext">ingresos totales</span>
        </div>
      </div>

      <div class="kpi-card premium">
        <div class="kpi-icon-wrapper">
          <span class="kpi-icon">📊</span>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Rentabilidad</span>
          <div class="kpi-value-group">
            <span class="kpi-main-value">${{ kpis.rentabilidad }}</span>
            <span :class="['kpi-trend-badge', kpis.rentabilidadCambio >= 0 ? 'trend-up' : 'trend-down']">
              {{ kpis.rentabilidadCambio >= 0 ? '▲' : '▼' }} {{ Math.abs(kpis.rentabilidadCambio) }}%
            </span>
          </div>
          <span class="kpi-subtext">ingreso por libra</span>
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
</template>

<script>
export default {
  name: 'KPIGrid',
  props: {
    kpis: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
  max-width: 1400px;
  margin: 0 auto;
}

@media (min-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.kpi-card.premium {
  background: white;
  border-radius: 20px;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.kpi-card.premium:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.kpi-icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-icon {
  font-size: 1.5rem;
}

.kpi-content {
  flex: 1;
  min-width: 0;
}

.kpi-label {
  font-size: 0.7rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: block;
  margin-bottom: 0.2rem;
  white-space: nowrap;
}

.kpi-value-group {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.2rem;
  flex-wrap: wrap;
}

.kpi-main-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a2e1a;
  line-height: 1;
}

.kpi-trend-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
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
  font-size: 0.65rem;
  color: #999;
  white-space: nowrap;
}

@media (max-width: 1400px) {
  .kpi-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>