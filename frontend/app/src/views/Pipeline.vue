<template>
  <div>
    <md-card v-for="task in pipeline.children" v-bind:key="task._id">
      <md-card-area>
        <md-card-header>
          <span class="md-title">{{ task.name }}</span>
          <br/>
          <span class="md-card-subtitle">{{ task.avarageTimeInSeconds }} seconds</span>
        </md-card-header>

        <md-card-actions>
          <md-button class="md-icon-button md-accent" @click="removeTask(task._id)">
            <md-icon>remove</md-icon>
          </md-button>
        </md-card-actions>
      </md-card-area>
    </md-card>

    <md-speed-dial class="md-bottom-right">
      <md-speed-dial-target @click="showAddTaskDialog()">
        <md-icon>add</md-icon>
      </md-speed-dial-target> 
    </md-speed-dial>

      <!-- todo: figure out more loose coupled wayt to handle passing data to and from dialog -->
    <AddTaskDialog :md-active.sync="showAddDialog" v-model="addTaskId" @md-create="addTask()" @md-cancel="cancelAddTask()"/>

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
import AddTaskDialog from "@/components/AddTaskDialog.vue";
import { HTTP } from "../http-common";
import auth from '../auth';
import { sortRule } from '../helpers';

const url = "pipelines/";


export default {
  data () {
    return {
      pipeline: {
        children: []
      },
      userid: auth.getUserId(),
      showAddDialog: false,
      addTaskId: null,
    }
  },
  components: {
    AddTaskDialog
  },
  beforeRouteEnter (to, from, next) {
    var id = to.params.id;
    HTTP().get(url + id).then(resp => {
      next(vm => vm.setPipeline(resp.data));
    }).catch((e)=>{
      console.log(e); //todo: proper error handling and display
    });
  },
  methods: {
    setPipeline (pipeline) {
      this.pipeline = pipeline;
    },
    removeTask (taskid) {
      var id = this.$route.params.id;
      HTTP().delete(url + id + '/task/' + taskid).then(resp => {
        this.setPipeline(resp.data);
      }).catch((e)=>{
        console.log(e); //todo: proper error handling and display
      });
    },
    showAddTaskDialog() {
      this.showAddDialog = true;
    },
    cancelAddTask() {
      this.addTaskId = null;
    },
    addTask() {
      var id = this.$route.params.id;
      HTTP().post(url + id + '/task/' + this.addTaskId).then(resp => {
        this.pipeline = resp.data;
      }).catch((e)=>{
        console.log(e); //todo: proper error handling and display
      }).finally(()=> {
        this.addTaskId = null;
      });
    }
  }
}
</script>