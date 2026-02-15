<template>
  <div class="container-fluid mt-4 mb-5">
    <div class="table-card">
      <div class="table-header">
        <h5>📋 Ranking de Regiones - Top 10</h5>
        <span class="table-badge">{{ ranking.length }} regiones activas</span>
      </div>
      <div class="table-responsive">
        <table class="ranking-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Región</th>
              <th>Volumen Total</th>
              <th>Precio Promedio</th>
              <th>Ingresos Totales</th>
              <th>Registros</th>
              <th>Participación</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in ranking.slice(0, 10)" :key="index">
              <td class="rank-cell">{{ index + 1 }}</td>
              <td class="region-cell"><strong>{{ item.region }}</strong></td>
              <td class="volume-cell">
                <div class="volume-bar-container">
                  <span>{{ (item.volumen / 1000000).toFixed(2) }}M lb</span>
                  <div class="volume-bar">
                    <div 
                      class="volume-bar-fill" 
                      :style="{ width: (item.volumen / ranking[0].volumen * 100) + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
              <td class="price-cell">${{ item.precio.toFixed(2) }}</td>
              <td class="price-cell">${{ (item.ingresos / 1000000).toFixed(2) }}M</td>
              <td class="records-cell">{{ item.registros.toLocaleString() }}</td>
              <td class="share-cell">
                {{ ((item.volumen / ranking.reduce((sum, r) => sum + r.volumen, 0)) * 100).toFixed(1) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RankingTable',
  props: {
    ranking: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
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

@media (max-width: 768px) {
  .ranking-table {
    font-size: 0.85rem;
  }
  
  .volume-bar {
    width: 100px;
  }
}

@media (max-width: 576px) {
  .ranking-table th, 
  .ranking-table td {
    padding: 0.75rem 0.5rem;
  }
  
  .price-cell {
    font-size: 0.8rem;
  }
}
</style>