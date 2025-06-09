<script>
import SvgIcon from "@shared/lib/svg/SvgIcon.vue";

export default {
  name: "DropdownToggle",
  components: { SvgIcon },
  props: {
    /**
     * Lista de opciones (opcional si se usa solo como toggle nav)
     * @type {Array<{ label: string, value: any, to?: string }>}
     */
    items: { type: Array, default: () => [] },

    /**
     * Icono opcional a la izquierda
     * @type {string}
     */
    icon: { type: String, default: "" },

    /**
     * Variante del botón (visual)
     * @type {string}
     */
    variant: { type: String, default: "default" },

    /**
     * Variante del icono SVG
     * @type {string}
     */
    iconVariant: { type: String, default: "default" }
  },
  data() {
    return {
      open: false
    };
  },
  computed: {
    hasMenu() {
      return this.items.length > 0;
    },
    buttonClass() {
      return [`variant-button-${this.variant}`].join(" ").trim();
    }
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
    selectItem(item) {
      this.$emit("select", item);
      this.open = false;
    },
    handleClickOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.open = false;
      }
    }
  }
};
</script>

<template>
  <div class="dropdown-wrapper">
    <button @click="toggle" :class="buttonClass" class="dropdown-button">
      <SvgIcon v-if="icon" :name="icon" :variant="iconVariant" />
      <slot>
        <!-- fallback -->
        <span>Toggle</span>
      </slot>
    </button>

    <!-- Dropdown menu -->
    <ul v-if="open && hasMenu" class="dropdown-menu">
      <li
          v-for="(item, idx) in items"
          :key="idx"
          @click="selectItem(item)"
          class="dropdown-item"
      >
        <RouterLink v-if="item.to" :to="item.to">{{ item.label }}</RouterLink>
        <span v-else>{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.dropdown-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 160px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-top: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.dropdown-item {
  padding: 10px 14px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f4f4f4;
}

.dropdown-item a {
  text-decoration: none;
  color: inherit;
}
</style>
