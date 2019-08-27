<template>
  <form novalidate>
    <md-dialog :md-active="showCreateDialog">
      <md-dialog-title>Create Task</md-dialog-title>
      <md-dialog-content>
        <md-field :class="getValidationClass('name')">
          <label for="name">Name</label>
          <md-input name="name" id="name" v-model="form.name" :disabled="sending" />
          <span class="md-error" v-if="!$v.form.name.required">Name is required</span>
          <span class="md-error" v-else-if="!$v.form.name.minlength">Name must be more then 2 symbols</span>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
        <md-button class="md-primary" @click="showDialog = false">Create</md-button>
      </md-dialog-actions>
    </md-dialog>
  </form>
</template>

<script>
  import { validationMixin } from 'vuelidate';
  import {
    required,
    minLength,
    maxLength
  } from 'vuelidate/lib/validators';

  export default {
    name: "CreateTaskDialog",
    mixins: [validationMixin],
    data: function() {
      return {
        // showCreateDialog: false,
        sending: false,
        form: {
          name: ""
        }
      }
    },
    props: {
      showCreateDialog: Boolean
    },
    validations: {
      form: {
        name: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(20),
        },
      }
    },
    methods: {
      getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
    }

  }
</script>