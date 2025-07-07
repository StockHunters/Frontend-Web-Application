<script>
import { Sale } from "@/sales/model/sale.entity.js";
import {SaleApiService} from "@/sales/services/sale-api.service.js";
import {SaleAssembler} from "@/sales/services/sale.assembler.js";
import SaleFormDialog from "@/sales/components/sale-form-dialog.component.vue";
export default {
  name: "sale-table",
  components: {SaleFormDialog},
  props: {
    sales: { type: Array, required: true }
  },
  data(){
    return {
      searchQuery: '',
      searchColumn: null,
      selectedSale: null,
      showEditDialog: false,
      selectionModeActive: false,
      showAddDialog: false,
    }
  },
  computed: {
    columns() {
      return [
        { field: "date", header: "Fecha" },
        { field: "product_id", header: "Producto" },
        { field: "quantity", header: "Cantidad" },
        { field: "customer_id", header: "Cliente" }
      ];
    },
    filteredSales() {
      if (!this.searchQuery || !this.searchColumn) return this.sales;
      return this.sales.filter(sale =>
          String(sale[this.searchColumn.toLowerCase()]).toLowerCase().includes(this.searchQuery.toLowerCase())
      );}
  },
  methods: {
    loadSales() {
      this.$router.go(0)
    },
    toggleSelectionMode() {
      this.selectionModeActive = !this.selectionModeActive;
      if (!this.selectionModeActive) {
        this.selectedSale = null; // Limpiar selección al desactivar
      }
    },
    onRowSelect() {
      if (this.selectionModeActive) {
        this.showEditDialog = true;
      }
    },
    async saveSale() {
      try {
        this.loading = true;
        const apiService = new SaleApiService();
        await apiService.update(this.selectedSale.id, this.selectedSale);
        alert("✅ Venta actualizada correctamente");
        this.showEditDialog = false;
        this.$emit("refresh"); // ← recarga usando el evento
      } catch (error) {
        console.error(error);
        alert("❌ Error al actualizar la venta");
      } finally {
        this.loading = false;
      }
    }
  }

};
</script>

<template>
  <div class="table-controls">
    <pv-dropdown
        v-model="searchColumn"
        :options="columns"
        optionLabel="header"
        optionValue="field"
        placeholder="Columna"
        class="dropdown"
    />

    <pv-input-text
        v-model="searchQuery"
        placeholder="Buscar..."
        class="search-input"
    />
    <pv-button :label="selectionModeActive ? 'Cancelar Selección' : 'Seleccionar'"  class="action-button" @click="toggleSelectionMode"/>
    <pv-button
        label="Agregar"
        class="action-button p-button-success"
        @click="showAddDialog = true"
    />
  </div>
  <SaleFormDialog
      v-model="showAddDialog"
      @refresh="$emit('refresh')"
  />

  <pv-table
      :value="filteredSales"
      tableStyle="min-width: 50rem"
      :showGridlines="true"
      :selectionMode="selectionModeActive ? 'single' : null"
      v-model:selection="selectedSale"
      @rowSelect="onRowSelect"
      dataKey="id"
      >

    <pv-column
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
    />
  </pv-table>
  <pv-dialog v-model:visible="showEditDialog" modal header="Editar Venta">
    <div class="field">
      <label>Fecha</label>
      <pv-calendar v-model="selectedSale.date" dateFormat="yy-mm-dd" />
    </div>
    <div class="field">
      <label>Cantidad</label>
      <pv-input-text v-model="selectedSale.quantity" />
    </div>
    <pv-button label="Guardar" @click="saveSale" class="mt-3" />
  </pv-dialog>

</template>

<style scoped>
.table-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.search-input {
  flex: 1;
}

.dropdown {
  min-width: 150px;
}

.action-button {
  min-width: 120px;
}

</style>
