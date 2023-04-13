<template>
  <div>
	<bread-crumb></bread-crumb>
  </div>
</template>

<script>
import breadCrumb from "components/breadCrumb";
export default {
  name: "ListVue",
  components: { breadCrumb},
  mounted() {
    console.log(2);
  },
};
</script>

<style></style>
