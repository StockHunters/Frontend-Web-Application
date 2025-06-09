<script>
import SvgIcon from "@shared/lib/svg/SvgIcon.vue";

/**
 * @component GenericButton
 * @description
 * Botón reutilizable que renderiza enlaces internos (<RouterLink>) o externos (<a>),
 * con soporte para íconos SVG y variantes de estilo.
 *
 * @example <caption>Enlace interno</caption>
 * <GenericButton link="/dashboard" variant="primary" icon="home">Dashboard</GenericButton>
 *
 * @example <caption>Enlace externo</caption>
 * <GenericButton link="https://example.com" :external="true" target="_blank" icon="external">
 *   Visitar sitio
 * </GenericButton>
 */
export default {
  name: "GenericButton",
  components: { SvgIcon },

  props:{

    /**
     * @prop {String} link
     * Ruta interna o URL externa a la que se dirigirá el botón.
     * Obligatoria.
     */
    link: { type: String, required: true },

    /**
     * @prop {Boolean} external
     * Si es `true`, el botón usará una etiqueta <a> para enlaces externos.
     * Por defecto es `false`, lo que implica una navegación interna con <RouterLink>.
     */
    external: { type: Boolean, default: false },

    /**
     * @prop {String} target
     * Atributo `target` para enlaces externos. Por defecto es `_self`.
     * Puede usarse `_blank` para abrir en nueva pestaña.
     */
    target: { type: String, default: '_self' },

    /**
     * @prop {String} variant
     * Nombre del estilo de botón. Se aplica como clase `variant-button-{variant}`.
     */
    variant: { type: String, default: 'default' },

    /**
     * @prop {String} customClass
     * Clases CSS adicionales que se aplicarán al botón.
     */
    customClass: { type: String, default: '' },

    /**
     * @prop {String} icon
     * Nombre del ícono SVG a renderizar. El componente `SvgIcon` lo usará.
     */

    icon: { type: String, default: '' },

    /**
     * @prop {String} iconVariant
     * Variante de estilo para el ícono. Útil para cambiar color o estilo visual.
     */
    iconVariant: { type: String, default: 'default' },
  },
  computed: {

    /**
     * @computed buttonClass
     * Clases dinámicas que se aplican al botón combinando el `variant` y `customClass`.
     * @returns {string}
     */
    buttonClass() {
      return [`variant-button-${this.variant}`, this.customClass].join(' ').trim();
    }
  },
}
</script>

<template>
    <a
        v-if="external"
        :href="link"
        :target="target"
        rel="noopener noreferrer"
        :class="buttonClass"
    >
      <SvgIcon :v-if="icon" :name="icon" :variant="iconVariant"/>
      <slot />
    </a>

    <RouterLink
        v-else
        :to="link"
        :class="buttonClass"
    >
      <SvgIcon :v-if="icon" :name="icon" :variant="iconVariant"/>
      <slot />
    </RouterLink>
</template>

<style scoped>
*{
  display: flex;
  text-decoration: none;
  padding: 0 15px;
  border-radius: 5px;
  font-size: 0.85rem;

  min-width: 30px;
  min-height: 30px;

  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  font-weight: 600;
}
</style>