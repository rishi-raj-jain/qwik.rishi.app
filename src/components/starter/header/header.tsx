import Toggle from './Toggle'
import { component$ } from '@builder.io/qwik'

export default component$(() => {
  return (
    <nav class="sticky top-0 z-10 flex w-full flex-col items-center bg-white dark:bg-black">
      <div class="flex w-full max-w-[90vw] flex-row items-center justify-between sm:px-10 lg:max-w-[75vw]">
        <Toggle />
        <div class="relative flex max-w-[258px] flex-row items-center space-x-5 overflow-x-scroll sm:max-w-none sm:overflow-x-hidden">
          <a class="dark:text-white" href="/">
            Home
          </a>
          <a class="dark:text-white" href="/about">
            About
          </a>
          <a class="dark:text-white" href="/blogs">
            Blogs
          </a>
          <a class="dark:text-white" href="/cv">
            CV
          </a>
          <a class="dark:text-white" href="/storyblok">
            Storyblok
          </a>
        </div>
      </div>
    </nav>
  )
})
