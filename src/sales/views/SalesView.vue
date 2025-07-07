<script>
import SaleTable from "@/sales/components/sale-table.component.vue";
import { SaleApiService } from "@/sales/services/sale-api.service.js";
import { SaleAssembler } from "@/sales/services/sale.assembler.js";
import { tSales } from "@shared/i18n/i18n.js";

export default {
  name: "SalesView",
  methods: {
    tSales,
    async fetchSales() {
      this.loading = true;
      try {
        const apiService = new SaleApiService();
        const response = await apiService.getAll();
        this.sales = SaleAssembler.toEntitiesFromResponse(response);
      } catch (error) {
        console.error("❌ Error al cargar las ventas:", error);
      } finally {
        this.loading = false;
      }
    }
  },
  components: { SaleTable },
  data() {
    return {
      sales: [],
      loading: false
    };
  },
  async created() {
    await this.fetchSales();
  }
};
</script>

<template>
  <h1>{{ tSales("sale.title") }}</h1>

  <div v-if="loading">
    <p>Cargando ventas...</p>
  </div>

  <div v-else>
    <sale-table :sales="sales" @refresh="fetchSales" />
  </div>
</template>

<style scoped>
h1 {
  color: var(--text-color);
  padding-bottom: 20px;
}
</style>
