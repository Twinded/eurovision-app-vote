<template>
  <img
    :src="flagUrl"
    :alt="`Drapeau de ${countryName}`"
    class="rounded shadow w-16 h-auto"
  />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  countryCode: { type: String, required: true },
  countryName: { type: String, required: true },
});

const flagUrl = computed(() => 
  `https://flagcdn.com/w640/${props.countryCode.toLowerCase()}.webp`
);
</script>
