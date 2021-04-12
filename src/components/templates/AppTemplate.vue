<template>
  <v-app>
    <v-main>
      <slot />
    </v-main>
    <v-footer app tile padless width="100%">
      <v-card flat tile width="100%" class="teal lighten-5 text-center">
        <v-card-text class="black--text"> {{ new Date().getFullYear() }} </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>
