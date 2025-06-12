<script>
import ThemeButton from "@shared/components/buttons/ThemeButton.vue";
import LanguageButton from "@shared/components/buttons/LanguageButton.vue";
import GenericButton from "@shared/components/buttons/GenericButton.vue";
import DropdownButton from "@shared/components/buttons/DropdownButton.vue";
import {useAuth} from "@shared/composables/useAuth.js";

export default {
  name: "HeaderApp",
  components: {
    Button: GenericButton,
    AccountMenu: DropdownButton,
    LanguageButton,
    ThemeButton,
  },
  data() {
    return {
      isMenuOpen: false
    };
  },
  computed: {
    AccountMenuItems() {
      return [
        {label:this.$t('ui.accountItems.profile'), link:'/profile'},
        {label:this.$t('ui.accountItems.upgrade'), link:'/upgrade'},
        {label:this.$t('ui.accountItems.settings'), link:'/settings'},
        {label:this.$t('ui.accountItems.logout'), action:useAuth().logout},
      ]
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    }
  }
}
</script>

<template>
  <header class="layout-bar">

    <div class="header-left-side" >
      <AccountMenu :items="AccountMenuItems"
                      avatar="src/shared/assets/icons/user-icon.svg"
                      custom-class="header-logo"/>
    </div>

    <div class="header-right-side">
      <nav :class="{ 'mobile-menu': true, open: isMenuOpen }" >
        <Button
            link="/app/clients"
        > {{ $t('shared.header.clients') }} </Button>

        <Button
            link="/app/products"
        > {{ $t('shared.header.products') }}</Button>

        <Button
            link="/app/sales"
        > {{ $t('shared.header.sales') }} </Button>

        <Button
            link="/app/reports"
        > {{ $t('shared.header.reports') }}</Button>
      </nav>

      <div class="header-tools-button">
        <ThemeButton/>
        <LanguageButton/>
      </div>

      <Button link="" icon="menu" custom-class="menu-toggle" @click.native.prevent="toggleMenu"/>
    </div>
  </header>
</template>

<style scoped>
.menu-toggle{
  display: none;
  width: 20px;
}

.mobile-menu {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

@media screen and (max-width: 620px){
  header{
    position: relative;
  }
  .header-right-side > nav{
    display: none;
  }
  .menu-toggle {
    display: flex;
  }
  .mobile-menu.open {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    right: 0;
    gap: 8px;
    background-color: var(--primary-color);
    border-radius: 5px;
    padding: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    z-index: 10;
  }
}

@media screen and (max-width: 290px){
  .header-tools-button{
    display: none;
  }
}
</style>