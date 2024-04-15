<template>
  <div class="py-4 container-fluid">
    <div class=" row">
      <div class="col-12">
        <ClouDeskTable/>
      </div>
    </div>
  </div>
</template>
<script>



import ClouDeskTable from "@/views/components/ClouDeskTable.vue";

export default {
  name: "dashboard-default",
  data() {
    return {
    };
  },
  components: {
    ClouDeskTable,
  },
};
</script>
