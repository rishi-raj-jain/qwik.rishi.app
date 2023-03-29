import { component$, Slot } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'
import Header from '~/components/starter/header/Header'

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  }
})

interface LayoutProps {
  class: string
}

export default component$((props: LayoutProps) => {
  return (
    <div class={`min-h-screen bg-white font-display dark:bg-black ${props.class}`}>
      <Header />
      <main class="flex flex-col items-center text-black dark:text-gray-200">
        <div class="flex w-full max-w-[90vw] flex-col py-10 sm:px-10 lg:max-w-[75vw]">
          <Slot />
        </div>
      </main>
    </div>
  )
})
