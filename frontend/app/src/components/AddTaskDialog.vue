<template>
  <md-dialog v-bind="$attrs">
    <form novalidate>
      <md-dialog-title>Add Task</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <label for="task">Task</label>
          <md-select v-model="taskId" name="task" id="task">
            <md-option v-for="task in tasks" v-bind:key="task._id" :value="task._id">{{ task.name }}</md-option>
          </md-select>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-default" @click="onCancel">Cancel</md-button>
        <md-button class="md-primary" @click="onAdd">Add</md-button>
      </md-dialog-actions>
    </form>
  </md-dialog>
</template>

<script>
import { HTTP } from "../http-common";
import auth from '../auth';
import { sortRule } from '../helpers';

const url = "tasks/";

export default {
  name: "AddTaskDialog",
  data: function() {
    return {
      taskId: null,
      tasks: []
    }
  },
  props: {
    value: {}
  },
  watch: {
    value () {
      this.taskId = this.value
    }
  },
  created: function () {
    this.taskId = this.value;

    HTTP().get(url).then(resp => {
      this.setTasks(resp.data);
    }).catch((e)=>{
      console.log(e); //todo: proper error handling and display
    });
  },
  methods: {
    setTasks (tasks) {
      this.tasks = tasks.sort(sortRule)
    },
    onCancel () {
      this.$emit('md-cancel')
      this.$emit('update:mdActive', false)
    },
    onAdd () {
      this.$emit('input', this.taskId)
      this.$emit('md-create', this.taskId)
      this.$emit('update:mdActive', false)      
    },
  }

}
</script>