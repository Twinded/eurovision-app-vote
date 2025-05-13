<template>
  <SpeedInsights />
  <router-view></router-view>
  <BottomNav />
</template>

<script setup>
import BottomNav from '@/components/BottomNav.vue';
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>
