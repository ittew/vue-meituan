<template>
  <el-row :gutter="0" class="m-header">
    <el-col :span="5">
      <Geo></Geo>
    </el-col>
    <el-col :span="4">
      <User></User>
    </el-col>
    <el-col :span="15">
      <Nav></Nav>
    </el-col>
  </el-row>
</template>

<script>
import Geo from './geo.vue'
import User from './user.vue'
import Nav from './nav.vue'
export default {
  components: {
    Geo,
    User,
    Nav
  }
}
</script>

<style lang="scss">
@import "@/assets/css/public/layout.scss";
// @import "@/assets/css/public/header/index.scss";
</style>
