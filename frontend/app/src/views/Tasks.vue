<template>
  <h1>This is an tasks page</h1>
</template>

<script>
import { HTTP } from "../http-common";

export default {
  data () {
    return {
      tasks: [],
    }
  },
  beforeRouteEnter (to, from, next) {
    HTTP().get("tasks").then(resp => {
      next(vm => vm.setTasks(resp.data));
    }).catch((e)=>{
      console.log(e);
    });
  },
  methods: {
    setTasks (tasks) {
      this.tasks = tasks
    }
  }
}
</script>