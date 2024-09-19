<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import SnackbarPop from '@/components/SnackbarPop.vue';
</script>

<template>
  <main>
    <AppHeader />
    <RouterView />
    <AppFooter />

    <SnackbarPop />
  </main>
</template>
