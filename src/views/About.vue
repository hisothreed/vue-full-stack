<template>
  <div>
      <hello-component></hello-component>
  </div>
</template>
<script>
import HelloComponent from './../components/HelloComponent'
export default {
    components: {
        HelloComponent
    },
    created() {
        console.log('called');
        
    },
    // title() {
    //     return 'about'
    // }
}
</script>
