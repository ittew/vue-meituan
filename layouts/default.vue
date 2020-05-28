<template>
  <el-container class="layout-default">
    <el-header height="197">
      <MyHeader></MyHeader>
    </el-header>
    <el-main>
      <nuxt />
    </el-main>
    <el-footer height="100%">
      <Footer></Footer>
    </el-footer>
  </el-container>
</template>
<script>
import MyHeader from '@/components/public/header/index.vue'
import Footer from '@/components/public/footer/index.vue'
export default {
  components: {
    MyHeader,
    Footer
  }
}
</script>

<style>
</style>
