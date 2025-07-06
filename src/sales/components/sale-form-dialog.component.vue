<script>
import { Sale } from "@/sales/model/sale.entity.js";
import { SaleApiService } from "@/sales/services/sale-api.service.js";

export default {
  name: "sale-form-dialog",
  components: {},
  props: ["modelValue"],
  emits: ["update:modelValue", "refresh"],
  data() {
    return {
      sale: Sale.createEmpty(),
      loading: false,
      statusOptions: ["Completado", "En proceso de pago"]
    };
  },
  methods: {
    async submitForm() {
      if (!this.isFormValid()) {
        alert('❌ Por favor completa todos los campos.');
        return;
      }
      try {
        this.loading = true;
        const apiService = new SaleApiService();
        await apiService.create(this.sale.toJson());

        alert('✅ Venta registrada correctamente');
        this.$emit("refresh");
        this.closeDialog();
      } catch (error) {
        console.error(error);
        alert('❌ Error al registrar la venta');
      } finally {
        this.loading = false;
      }
    },
    isFormValid() {
      const { date, product_id, quantity, status, customer_id } = this.sale;
      return date && product_id && quantity && status && customer_id;
    },
    closeDialog() {
      this.$emit("update:modelValue", false);
      this.sale = Sale.createEmpty();
    }
  }
};
</script>

<template>
  <pv-dialog
      :visible="modelValue"
      modal
      header="Agregar Nueva Venta"
      style="width: 30rem;"
      @hide="closeDialog"
  >
    <form @submit.prevent="submitForm" class="form-content">
      <div class="field">
        <label>Fecha</label>
        <pv-calendar v-model="sale.date" dateFormat="yy-mm-dd" showIcon class="w-full" />
      </div>

      <div class="field">
        <label>ID Producto</label>
        <pv-input-text v-model.number="sale.product_id" class="w-full" />
      </div>

      <div class="field">
        <label>Cantidad</label>
        <pv-input-text v-model.number="sale.quantity" class="w-full" />
      </div>

      <div class="field">
        <label>Estado</label>
        <pv-dropdown
            v-model="sale.status"
            :options="statusOptions"
            placeholder="Seleccione un estado"
            class="w-full"
        />
      </div>

      <div class="field">
        <label>ID Cliente</label>
        <pv-input-text v-model.number="sale.customer_id" class="w-full" />
      </div>

      <pv-button
          type="submit"
          :label="loading ? 'Guardando...' : 'Registrar Venta'"
          :disabled="loading"
          class="w-full p-button-success mt-3"
      />
    </form>
  </pv-dialog>
</template>

<style scoped>
.form-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.field label {
  font-weight: bold;
}
</style>
