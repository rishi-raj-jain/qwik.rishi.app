/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the express server when building for production.
 *
 * Learn more about the cloudflare integration here:
 * - https://qwik.builder.io/deployments/node/
 *
 */
import { createQwikCity, type PlatformNode } from '@builder.io/qwik-city/middleware/node'
import qwikCityPlan from '@qwik-city-plan'
import { manifest } from '@qwik-client-manifest'
import render from './entry.ssr'
import express from 'express'

declare global {
  interface QwikCityPlatform extends PlatformNode {}
}

const PORT = process.env.PORT || 3000

const { router, notFound } = createQwikCity({ render, qwikCityPlan, manifest })

const app = express()

app.use(router)

app.use(notFound)

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})
