<template>
  <div class="m-header">
    <el-row>
      <el-col><Topbar></Topbar></el-col>
    </el-row>
    <el-row>
      <el-col><Searchbar></Searchbar></el-col>
    </el-row>
  </div>
</template>

<script>
import Topbar from './topbar.vue'
import Searchbar from './searchbar.vue'
export default {
  components: {
    Topbar,
    Searchbar
  }
}
</script>

<style lang="scss">
@import "@/assets/css/public/header/index.scss";
</style>
