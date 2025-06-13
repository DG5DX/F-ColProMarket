<template>
  <q-layout view="hHh lpR fFf" id="body">
    <admin-drawer />
    <q-page-container>
        <h1>Me Voy A Dormir</h1>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed, toRaw } from "vue";
import { Notify } from "quasar";
import { getData, postData, putData } from "../service/service.js";
import adminDrawer from "../components/adminDrawer.vue";
import { formatNum, showNotification } from "../utils/utils.js";
</script>

<style scoped>
</style>