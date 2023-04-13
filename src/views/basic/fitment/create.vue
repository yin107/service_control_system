<template>
  <div>
    新建装修

    <bread-crumb></bread-crumb>
  </div>
</template>

<script>
import breadCrumb from "components/breadCrumb";
export default {
  components: { breadCrumb },
  name: "createVue",
  mounted() {
    console.log(3);
  },
};
</script>

<style></style>
