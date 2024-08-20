<template>
  <div>
    TOKEN:
    {{ token }}
  </div>
  <div v-if="apn">
    Connected APN:
    {{ apn }}
  </div>
  <div>
    <button @click="connect">Start Connect</button>
  </div>
</template>

<script setup lang="ts">
  import { pdServer, pdBrowser } from './pipedream'

  const {NEXT_PUBLIC_PIPEDREAM_APP_SLUG, NEXT_PUBLIC_PIPEDREAM_APP_ID} = import.meta.env

  // Create a reactive ref to hold the token
  const apn = ref<string | null>(null)


  // Fetch the data server-side using useAsyncData
  const { data: token, pending, error } = await useAsyncData(async () => {
    const pd = await pdServer()
    try {
      const res = await pd.connectTokenCreate({
        client_name: 'Test App',
        external_id: 'Test',
        app_slug: NEXT_PUBLIC_PIPEDREAM_APP_SLUG,
        app: NEXT_PUBLIC_PIPEDREAM_APP_ID
      })
      return res.token

    } catch (error) {
      console.log(error)
    }
  })

  const connect = () => {
    const onSuccess = (res) => {
      apn.value = res.id
    }
    if (token.value) {
      pdBrowser().startConnect({ token: token.value, app: "mysql", onSuccess })

    }
  }

  // Optionally handle pending state or errors
  if (pending.value) {
    console.log('Fetching token...')
  }

  if (error.value) {
    console.error('Error fetching token:', error.value)
  }
</script>
