import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'
import type { DocumentHead } from '@builder.io/qwik-city'
import { Storyblok as StoryblokClient } from '~/storyblok'
import SocialLinks from '~/components/shared/social-media-links'

export const useGetTagline = routeLoader$(async () => {
  try {
    const { data } = await StoryblokClient.get('cdn/stories/taglines/home')
    return { tagline: StoryblokClient.richTextResolver.render(data.story.content.Text) }
  } catch (e) {
    // @ts-ignore
    console.log(e.message || e.toString())
    return { tagline: null }
  }
})

export default component$(() => {
  const tagline = useGetTagline()
  return (
    <div class="md:justify-auto flex min-h-[90vh] flex-col justify-center md:flex-row md:items-center">
      <div class="order-2 md:order-1 flex w-full flex-col items-center justify-center md:w-1/2 md:items-start">
        <h1 class="mt-5 text-2xl font-bold sm:text-5xl md:mt-0">Rishi Raj Jain</h1>
        <h2 class="mt-5 text-center text-lg text-gray-500 dark:text-white sm:text-xl md:text-left">Technical Customer Success Manager at Edgio</h2>
        <div class="flex flex-row space-x-5">
          <SocialLinks />
        </div>
        <div class="mt-10 h-[1px] w-full bg-gray-200 dark:bg-gray-700"></div>
        {tagline.value.tagline && (
          <h2
            dangerouslySetInnerHTML={tagline.value.tagline}
            class="text-md mt-10 text-center text-gray-500 dark:text-white sm:text-lg md:text-left"
          />
        )}
      </div>
      <div class="order-1 md:order-2 flex flex-col items-center md:items-end justify-center md:flex md:w-1/2">
        <div class="grayscale filter">
          <img
            alt="Rishi Raj Jain"
            sizes="(max-width: 768px) 110px, 330px"
            class="rounded object-cover aspect-square transform-gpu"
            src="https://opt.moovweb.net?img=https://rishi.app/static/favicon-image.jpg"
            srcSet="https://opt.moovweb.net?img=https://rishi.app/static/favicon-image.jpg&width=110 110w, https://opt.moovweb.net?img=https://rishi.app/static/favicon-image.jpg&width=330 330w"
          />
        </div>
      </div>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
}
