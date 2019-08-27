<template>
  <md-dialog v-bind="$attrs">
    <form novalidate>
      <md-dialog-title>Create Task</md-dialog-title>
      <md-dialog-content>
        <md-field :class="getValidationClass('name')">
          <label for="name">Name</label>
          <md-input name="name" id="name" v-model="form.name" />
          <span class="md-error" v-if="!$v.form.name.required">Name is required</span>
          <span class="md-error" v-else-if="!$v.form.name.minlength">Name must be more then 2 symbols</span>
        </md-field>

        <md-field :class="getValidationClass('avarageTimeInSeconds')">
          <label for="avarageTimeInSeconds">Avarage time in seconds</label>
          <md-input name="avarageTimeInSeconds" id="avarageTimeInSeconds" v-model="form.avarageTimeInSeconds" />
          <span class="md-error" v-if="!$v.form.avarageTimeInSeconds.required">Required</span>
          <span class="md-error" v-else-if="!$v.form.avarageTimeInSeconds.between">Must be between 1 and 30 seconds</span>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-default" @click="onCancel">Cancel</md-button>
        <md-button class="md-primary" @click="onCreate">Create</md-button>
      </md-dialog-actions>
    </form>
  </md-dialog>
</template>

<script>
  import { validationMixin } from 'vuelidate';
  import {
    required,
    minLength,
    maxLength,
    between,
    numeric,
    alpha
  } from 'vuelidate/lib/validators';

  export default {
    name: "CreateTaskDialog",
    mixins: [validationMixin],
    data: function() {
      return {
        form: {
          name: "",
          avarageTimeInSeconds: 1
        }
      }
    },
    props: {
      value: {}
    },
    watch: {
      value () {
        this.form = this.value
      }
    },
    created () {
      this.form = this.value
    },
    validations: {
      form: {
        name: {
          required,
          alpha,
          minLength: minLength(3),
          maxLength: maxLength(20),
        },
        avarageTimeInSeconds: {
          required,
          numeric,
          between: between(1, 30),
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
      onCancel () {
        this.$v.$reset()
        this.$emit('md-cancel')
        this.$emit('update:mdActive', false)
      },
      onCreate () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.$emit('input', this.form)
          this.$emit('md-create', this.form)
          this.$emit('update:mdActive', false)
        }
        
      },
    }

  }
</script>