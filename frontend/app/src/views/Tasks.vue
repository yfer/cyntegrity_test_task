<template>
  <div>
    <md-card md-with-hover v-for="task in tasks" v-bind:key="task._id">
      <md-card-area>
        <md-card-header>
          <span class="md-title">{{ task.name }}</span>
        </md-card-header>

        <md-card-actions>
          <md-button class="md-icon-button md-accent" v-bind:disabled="userid !== task.user" @click="deleteTask(task._id)">
            <md-icon>delete</md-icon>
          </md-button>
        </md-card-actions>
      </md-card-area>
    </md-card>

    <md-speed-dial class="md-bottom-right">
      <md-speed-dial-target @click="showCreateTaskDialog()">
        <md-icon>add</md-icon>
      </md-speed-dial-target> 
    </md-speed-dial>


    <md-dialog-prompt
      :md-active.sync="showCreateDialog"
      v-model="newTaskName"
      md-title="Task name?"
      md-input-maxlength="20"
      md-input-placeholder="Enter task name..."
      md-cancel-text="Cancel"
      md-confirm-text="Done" 
      @md-confirm="createTask()"
      />

    <!-- todo: return to this realization due to inability of md-dialog-prompt validate input parameters
      <CreateTaskDialog :showCreateDialog="showCreateDialog"/> -->
  </div>
</template>

<style scoped>
  .md-card {
    width: 320px;
    margin: 4px;
    display: inline-block !important;
    vertical-align: top;
  }
</style>

<script>
// import CreateTaskDialog from "@/components/CreateTaskDialog.vue";
import { HTTP } from "../http-common";
import auth from '../auth';

const taskSortRule = (a,b) => a._id > b._id;

export default {
  data () {
    return {
      tasks: [],
      userid: auth.getUserId(),
      showCreateDialog: false,
      newTaskName: null
    }
  },
  // components: {
  //   CreateTaskDialog
  // },
  beforeRouteEnter (to, from, next) {
    HTTP().get("tasks").then(resp => {
      next(vm => vm.setTasks(resp.data));
    }).catch((e)=>{
      console.log(e);
    });
  },
  methods: {
    setTasks (tasks) {
      this.tasks = tasks.sort(taskSortRule)
    },
    deleteTask (taskid) {
      HTTP().delete("tasks/" + taskid).then(resp => {
        this.tasks = this.tasks.filter(t=>t._id != taskid).sort(taskSortRule);
      }).catch((e)=>{
        console.log(e);
      })
    },
    showCreateTaskDialog() {
      this.showCreateDialog = true;
    },
    createTask() {
      HTTP().post("tasks/", { name: this.newTaskName }).then(resp => {
        console.log(resp);
        this.tasks.push(resp.data);
        this.tasks.sort(taskSortRule);
      }).catch((e)=>{
        console.log(e);
      }).finally(()=> {
        this.newTaskName = null;
      });
    }
  }
}
</script>