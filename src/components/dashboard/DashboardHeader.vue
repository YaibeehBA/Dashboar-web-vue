<template>
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
</template>

<script>
export default {
  name: 'DashboardHeader'
};
</script>

<style scoped>
.dashboard-header {
 
  color: white;
  padding: 2rem 0;
 
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
  background: white;
  
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>