<script>
export default{
  props:['src','modelValue'],
  data(){
    return{
      style: ''
    }
  },
  watch:{
    modelValue(newVal){
      if(newVal==false){
        this.style = ''
      }
      else{
        this.style = 'border: 4px red solid;'
      }
    }
  },
  methods:{
    handleClick(){
      if(this.style==''){
        this.style = 'border: 4px red solid;'
        this.$emit('update:modelValue', true)

      }
      else{
        this.style = ''
        this.$emit('update:modelValue', false)

      }
    }
  },
}
</script>

<template>
  <img @click="handleClick" :src="src" :style="style">
</template>

<style>
</style>