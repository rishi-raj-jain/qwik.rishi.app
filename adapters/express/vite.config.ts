import baseConfig from '../../vite.config'
import { extendConfig } from '@builder.io/qwik-city/vite'
import { nodeServerAdapter } from '@builder.io/qwik-city/adapters/node-server/vite'

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ['src/entry.express.tsx', '@qwik-city-plan'],
      },
    },
    plugins: [nodeServerAdapter({ name: 'express' })],
  }
})
