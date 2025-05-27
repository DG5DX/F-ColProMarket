<template>
  <q-layout view="hHh lpR fFf" id="body">
    <admin-drawer />
    <q-page-container>
        hola jovenos
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, toRaw } from "vue";
import { Notify } from "quasar";
import { getData, postData } from "../service/service.js";
import adminDrawer from "../components/adminDrawer.vue";
</script>

<style>
#body {
  background-color: var(--two-color--);
}
</style>