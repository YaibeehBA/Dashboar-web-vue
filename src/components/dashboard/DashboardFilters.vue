<template>
  <div class="container-fluid mt-4">
    <div class="filters-card">
      <div class="filters-header">
        <h5><span class="filter-icon">🔍</span> Filtros de Análisis</h5>
        <button @click="$emit('limpiar')" class="btn-clear">
          <span>✕</span> Limpiar todo
        </button>
      </div>
      <div class="filters-grid">
        <div class="filter-group">
          <label class="filter-label">
            <span class="label-icon">📍</span> Región
          </label>
          <select 
            :value="modelValue.region" 
            @change="$emit('update:modelValue', { ...modelValue, region: $event.target.value }); $emit('aplicar')" 
            class="filter-select"
          >
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
          <select 
            :value="modelValue.tipo" 
            @change="$emit('update:modelValue', { ...modelValue, tipo: $event.target.value }); $emit('aplicar')" 
            class="filter-select"
          >
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
          <select 
            :value="modelValue.anio" 
            @change="$emit('update:modelValue', { ...modelValue, anio: $event.target.value }); $emit('aplicar')" 
            class="filter-select"
          >
            <option value="">Todos los años</option>
            <option v-for="anio in anios" :key="anio" :value="anio">
              {{ anio }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardFilters',
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    regiones: {
      type: Array,
      default: () => []
    },
    tiposProducto: {
      type: Array,
      default: () => []
    },
    anios: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'aplicar', 'limpiar']
};
</script>

<style scoped>
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
</style>