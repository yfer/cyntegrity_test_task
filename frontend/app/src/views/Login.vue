<template>
  <form novalidate class="md-layout md-alignment-center-center" @submit.prevent="validateUser">
    <md-card class="md-layout-item md-size-50 md-small-size-100">
      <md-card-header>
        <div class="md-title">Login</div>
      </md-card-header>

      <md-card-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">We have users:<br/><ul>
            <li>username1:password1</li>
            <li>username2:password2</li>
            <li>username3:password3</li>
          </ul></div>
          
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('username')">
              <label for="username">Username</label>
              <md-input name="username" id="username" v-model="form.username" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.username.required">Username is required</span>
              <span class="md-error" v-else-if="!$v.form.username.minlength">Username must be more then 2 symbols</span>
            </md-field>
          </div>

          <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('password')">
              <label for="password">Password</label>
              <md-input name="password" id="password" v-model="form.password" type="password" :disabled="sending"></md-input>
              <span class="md-error" v-if="!$v.form.password.required">Password is required</span>
              <span class="md-error" v-else-if="!$v.form.password.minlength">Password must be more then 2 symbols</span>
            </md-field>
          </div>
        </div>

    
      </md-card-content>
      <md-card-actions>
        <md-button type="submit" class="md-primary" :disabled="sending">Sign In</md-button>
      </md-card-actions>
    </md-card>

    <md-snackbar :md-active.sync="showMessage">{{ message }}</md-snackbar>
  </form>
</template>

<script>
  import auth from '../auth';
  import { validationMixin } from 'vuelidate';
  import {
    required,
    minLength,
    maxLength
  } from 'vuelidate/lib/validators';

  export default {
    name: 'FormValidation',
    mixins: [validationMixin],
    data: () => ({
      form: {
        username: "username1",
        password: "password1",
      },
      showMessage: false,
      sending: false,
      message: null
    }),
    validations: {
      form: {
        username: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(20),
        },
        password: {
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
      login () {
        this.sending = true

        auth.login(this.form.username, this.form.password, loggedIn => {
          if (!loggedIn) {
            this.error = true
            this.showMessage = true
            this.message = "You entered wrong credentials!"
            this.sending = false
            window.setTimeout(() => {
              this.showMessage = false
            }, 3000)
          } else {
            this.$router.replace(this.$route.query.redirect || '/')
          }
        })
      },
      validateUser () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.login()
        }
      }
    }
  }
</script>
