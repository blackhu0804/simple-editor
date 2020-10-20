<template>
  <div id="app">
    <editor></editor>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Editor from './components/editor.vue';

export default Vue.extend({
  name: 'App',
  components: {
    Editor
  }
});
</script>

<style>
body, #app {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
