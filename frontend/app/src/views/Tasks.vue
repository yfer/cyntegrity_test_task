<template>
  <div>
    <md-card md-with-hover v-for="task in tasks" v-bind:key="task._id">
      <md-card-area>
        <md-card-header>
          <span class="md-title">{{ task.name }}</span>
          <br/>
          <span class="md-card-subtitle">{{ task.avarageTimeInSeconds }} seconds</span>
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


    <!-- <md-dialog-prompt
      :md-active.sync="showCreateDialog"
      v-model="newTaskName"
      md-title="Task name?"
      md-input-maxlength="20"
      md-input-placeholder="Enter task name..."
      md-cancel-text="Cancel"
      md-confirm-text="Done" 
      @md-confirm="createTask()"
      /> -->

      <!-- todo: figure out more loose coupled wayt to handle passing data to and from dialog -->
      <CreateTaskDialog :md-active.sync="showCreateDialog" v-model="newTaskModel" @md-create="createTask()" @md-cancel="cancelCreateTask()"/>
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
import CreateTaskDialog from "@/components/CreateTaskDialog.vue";
import { HTTP } from "../http-common";
import auth from '../auth';

const taskSortRule = (a,b) => a._id > b._id;
const url = "tasks/";
function getDefaultTaskModel() {
  return {
    name: "",
    avarageTimeInSeconds: 1
  };
}

export default {
  data () {
    return {
      tasks: [],
      userid: auth.getUserId(),
      showCreateDialog: false,
      newTaskModel: getDefaultTaskModel()
    }
  },
  components: {
    CreateTaskDialog
  },
  beforeRouteEnter (to, from, next) {
    HTTP().get(url).then(resp => {
      next(vm => vm.setTasks(resp.data));
    }).catch((e)=>{
      console.log(e); //todo: proper error handling and display
    });
  },
  methods: {
    setTasks (tasks) {
      this.tasks = tasks.sort(taskSortRule)
    },
    deleteTask (taskid) {
      HTTP().delete(url + taskid).then(resp => {
        //todo: use map instead of array, O(1) instead of O(N)
        this.tasks = this.tasks.filter(t=>t._id != taskid).sort(taskSortRule);
      }).catch((e)=>{
        console.log(e); //todo: proper error handling and display
      })
    },
    showCreateTaskDialog() {
      this.showCreateDialog = true;
    },
    cancelCreateTask() {
      this.newTaskModel = getDefaultTaskModel();
    },
    createTask() {
      HTTP().post(url, this.newTaskModel).then(resp => {
        this.tasks.push(resp.data);
        this.tasks.sort(taskSortRule);
      }).catch((e)=>{
        console.log(e); //todo: proper error handling and display
      }).finally(()=> {
        this.newTaskModel = getDefaultTaskModel();
      });
    }
  }
}
</script>