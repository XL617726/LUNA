<script setup lang="ts">
defineProps<{
  modelValue: string; placeholder?: string; type?: string
  disabled?: boolean; error?: string; label?: string
}>()
defineEmits<{ 'update:modelValue': [v: string] }>()
</script>

<template>
  <div class="luna-input-wrap">
    <label v-if="label" class="luna-input__label">{{ label }}</label>
    <input
      :type="type || 'text'" :value="modelValue" :placeholder="placeholder"
      :disabled="disabled" class="luna-input" :class="{ 'luna-input--error': error }"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="luna-input__error">{{ error }}</span>
  </div>
</template>

<style scoped>
.luna-input-wrap { display: flex; flex-direction: column; gap: 4px; }
.luna-input__label { font-size: var(--luna-font-size-sm); color: var(--luna-text-secondary); }
.luna-input {
  height: var(--luna-input-height); padding: var(--luna-input-padding);
  background: rgba(255,255,255,0.05); border: 1px solid var(--luna-border-color);
  border-radius: var(--luna-radius-md); color: var(--luna-text-primary);
  font-size: var(--luna-font-size-md); outline: none; transition: border-color var(--luna-transition-fast);
}
.luna-input::placeholder { color: var(--luna-text-muted); }
.luna-input:focus { border-color: var(--luna-accent); }
.luna-input:disabled { opacity: 0.4; }
.luna-input--error { border-color: var(--luna-error); }
.luna-input__error { font-size: var(--luna-font-size-xs); color: var(--luna-error); }
</style>
