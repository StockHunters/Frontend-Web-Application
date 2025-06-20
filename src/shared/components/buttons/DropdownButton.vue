<script>
import GenericButton from './GenericButton.vue'

export default {
  name: 'DropdownButton',
  components: { GenericButton },

  props: {
    avatar: { type: String, default: '' },
    items: { type: Array, required: true },
    variant: { type: String, default: 'default' },
    customClass: { type: String, default: '' },
  },

  data() {
    return {
      open: false,
    }
  },

  methods: {
    toggleDropdown() {
      this.open = !this.open
    },

    handleItemClick(item) {
      this.open = false
      if (item.action) {
        item.action()
      } else if (item.link) {
        this.$router.push(item.link)
      }
      this.$emit('input', item.label)
    }
  }
}
</script>

<template>
  <div class="dropdown-wrapper">

    <div v-if="avatar" class="avatar-container">
      <img  :src="avatar" alt="Avatar" :class="`avatar ` + customClass" @click.prevent="toggleDropdown" />
    </div>

    <GenericButton
        v-else
        :variant="variant"
        :customClass="customClass"
        link=""
        @click.prevent="toggleDropdown"
    >
      <span> <slot/> </span>
    </GenericButton>

    <div v-if="open" class="dropdown-menu">
      <ul>
        <li v-for="(item, i) in items" :key="i" @click="handleItemClick(item)">
          {{ item.label }}
        </li>
      </ul>
    </div>

  </div>
</template>

<style scoped>

.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.avatar {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;
  padding: 2px;
  align-items: center;
  cursor: pointer;
}

.avatar:hover {
  background-color: var(--primary-color-hover);
}

.dropdown-menu {
  position: absolute;
  background-color: var(--bg-color);
  color: var(--text-color);
  margin-top: 5px;
  padding: 10px;
  border-radius: 4px;
  min-width: 150px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dropdown-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-menu li {
  padding: 8px 15px;
  cursor: pointer;
  transition: background 0.5s;
}

.dropdown-menu li:hover {
  background-color: var(--primary-color-hover);
  border-radius: 5px;
}

</style>
