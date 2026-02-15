<template>
  <div class="modal fade" id="insightModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content insight-modal">
        <div class="modal-header">
          <h5 class="modal-title">
            <span class="insight-modal-icon">💡</span>
            {{ insight.titulo }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <p>{{ insight.texto }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-insight-close" data-bs-dismiss="modal">Entendido</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InsightModal',
  props: {
    insight: {
      type: Object,
      required: true,
      default: () => ({ titulo: '', texto: '' })
    }
  }
};
</script>

<style scoped>
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
</style>