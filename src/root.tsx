import './global.css'
import install from '@edgio/prefetch/window/install'
import installDevtools from '@edgio/devtools/install'
import { themeChangeListener } from './themeChangeListener'
import { component$, useVisibleTask$ } from '@builder.io/qwik'
import { RouterHead } from './components/router-head/router-head'
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city'

export default component$(() => {
  useVisibleTask$(
    () => {
      if (window.localStorage.getItem('theme')) {
        themeChangeListener()
      } else {
        // Check the theme preferred in the window acc. to the zone
        const theme = (() => {
          const params = new Proxy(new URLSearchParams(window.location.search), {
            // @ts-ignore
            get: (searchParams, prop) => searchParams.get(prop),
          })
          if (typeof window !== 'undefined') {
            // @ts-ignore
            return params?.mode ? params.mode : window.localStorage.getItem('theme') || 'light'
          }
          // @ts-ignore
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark'
          }
          return 'light'
        })()
        // Set the theme as light / dark
        window.localStorage.setItem('theme', theme)
      }
      install()
      installDevtools()
    },
    {
      strategy: 'document-idle',
    }
  )
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */
  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <noscript>
          <style
            dangerouslySetInnerHTML={`
              .hide-if-no-javascript {
                display: none;
              }
            `}
          />
        </noscript>
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  )
})
