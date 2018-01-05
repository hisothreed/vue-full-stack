<template>
  <div id="app">
    <router-view class="view"></router-view>
  </div>
</template>
<script>
export default {
  // will be called in server-entry.js to fetch any required data from the store 'async'
  // it doesn't have access to this. The store and route information needs to be passed in as arguments:
  // asyncData ({ store, route }) {
  //   // return the Promise from the action
  //   return store.dispatch('fetchItem', route.params.id)
  // },
  data() {
    return {}
  },
  title(){
    return 'Hello world'
  },
}
</script>
