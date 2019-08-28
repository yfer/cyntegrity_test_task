<template>
  <div>
    <md-card v-for="pipeline in pipelines" v-bind:key="pipeline._id">
      <div>
      <md-ripple>
        <md-card-area>
          <md-card-header>
            <span class="md-title">{{ pipeline.name }}</span>
            <br/>
            <span v-for="task in pipeline.children" v-bind:key="task._id">
              <span class="md-card-subtitle">{{ task.name }} ({{ task.avarageTimeInSeconds }} seconds)</span>
              <br/>
            </span>
          </md-card-header>

          <md-card-actions>
            <md-button class="md-icon-button md-accent" @click="runPipeline(pipeline._id)">
              <md-icon>play_arrow</md-icon>
            </md-button>
            <md-button class="md-icon-button md-accent" @click="editPipeline(pipeline._id)">
              <md-icon>edit</md-icon>
            </md-button>
            <md-button class="md-icon-button md-accent" v-bind:disabled="userid !== pipeline.user" @click="deletePipeline(pipeline._id)">
              <md-icon>delete</md-icon>
            </md-button>
          </md-card-actions>
        </md-card-area>
      </md-ripple>
      </div>
    </md-card>

    <md-speed-dial class="md-bottom-right">
      <md-speed-dial-target @click="showCreatePipelineDialog()">
        <md-icon>add</md-icon>
      </md-speed-dial-target> 
    </md-speed-dial>

      <!-- todo: figure out more loose coupled wayt to handle passing data to and from dialog -->
      <CreatePipelineDialog :md-active.sync="showCreateDialog" v-model="newPipelineModel" @md-create="createPipeline()" @md-cancel="cancelCreatePipeline()"/>
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
import CreatePipelineDialog from "@/components/CreatePipelineDialog.vue";
import { HTTP } from "../http-common";
import auth from '../auth';
import { sortRule } from '../helpers';

const url = "pipelines/";
function getDefaultPipelineModel() {
  return {
    name: "",
    avarageTimeInSeconds: 1
  };
}

export default {
  data () {
    return {
      pipelines: [],
      userid: auth.getUserId(),
      showCreateDialog: false,
      newPipelineModel: getDefaultPipelineModel()
    }
  },
  components: {
    CreatePipelineDialog
  },
  beforeRouteEnter (to, from, next) {
    HTTP().get(url).then(resp => {
      next(vm => vm.setPipelines(resp.data));
    }).catch((e)=>{
      console.log(e); //todo: proper error handling and display
    });
  },
  methods: {
    setPipelines (pipelines) {
      this.pipelines = pipelines.sort(sortRule)
    },
    deletePipeline (pipelineid) {
      HTTP().delete(url + pipelineid).then(resp => {
        //todo: use map instead of array, O(1) instead of O(N)
        this.pipelines = this.pipelines.filter(t=>t._id != pipelineid).sort(sortRule);
      }).catch((e)=>{
        console.log(e); //todo: proper error handling and display
      })
    },
    showCreatePipelineDialog() {
      this.showCreateDialog = true;
    },
    cancelCreatePipeline() {
      this.newPipelineModel = getDefaultPipelineModel();
    },
    createPipeline() {
      HTTP().post(url, this.newPipelineModel).then(resp => {
        this.pipelines.push(resp.data);
        this.pipelines.sort(sortRule);
      }).catch((e)=>{
        console.log(e); //todo: proper error handling and display
      }).finally(()=> {
        this.newPipelineModel = getDefaultPipelineModel();
      });
    },
    editPipeline(pipelineid) {
      this.$router.push(url + pipelineid);
    },
    runPipeline(pipelineid) {
      HTTP().post(url + pipelineid + '/run').then(resp => {
        console.log(resp.data);
        alert("Pipeline finished with result: " + resp.data + " seconds");
        // this.pipeline = resp.data;
      }).catch((e)=>{
        console.log(e); //todo: proper error handling and display
      }).finally(()=> {
        this.addTaskId = null;
      });
    }
  }
}
</script>