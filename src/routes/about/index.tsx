import Heart from '~/components/shared/heart'
import { isServer } from '@builder.io/qwik/build'
import type { DocumentHead } from '@builder.io/qwik-city'
import { Storyblok as StoryblokClient } from '~/storyblok'
import type Storyblok from 'storyblok-js-client/dist/types'
import { component$, useTask$, useStore } from '@builder.io/qwik'

export default component$(() => {
  const store = useStore({ tagline: null, timeline: {} })
  useTask$(async () => {
    if (isServer) {
      try {
        const { data } = await StoryblokClient.get('cdn/stories/taglines/about')
        store.tagline = StoryblokClient.richTextResolver.render(data.story.content.Text)
      } catch (e) {
        // @ts-ignore
        console.log(e.message || e.toString())
      }
      try {
        const getStories = async (page: number, client: Storyblok) => {
          const res = await client.get('cdn/stories', {
            page: page,
            per_page: 100,
            starts_with: 'timeline/',
          })
          const stories = res.data.stories
          stories.forEach((story: any) => {
            const renderedText = client.richTextResolver.render(story.content.Description)
            // eslint-disable-next-line no-prototype-builtins
            if (store.timeline.hasOwnProperty(story.content.Year)) {
              // @ts-ignore
              store.timeline[story.content.Year].push({ ...story, renderedText })
            } else {
              // @ts-ignore
              store.timeline[story.content.Year] = [{ ...story, renderedText }]
            }
          })
          const total = res.total
          const lastPage = Math.ceil(total / res.perPage)
          if (page <= lastPage) {
            page++
            await getStories(page, client)
          }
        }
        await getStories(1, StoryblokClient)
      } catch (e) {
        // @ts-ignore
        console.log(e.message || e.toString())
      }
    }
  })
  return (
    <div class="flex w-full flex-col items-center text-[14px]">
      <div class="mt-10 flex w-[90vw] max-w-[540px] flex-col">
        <h1 class="text-3xl font-bold text-zinc-700 dark:text-gray-300">About Me</h1>
        {store.tagline && <div class="mt-2 font-light text-slate-600 dark:text-slate-400" dangerouslySetInnerHTML={store.tagline} />}
        <h2 class="mt-16 text-3xl font-bold text-zinc-700 dark:text-gray-300">My Timeline</h2>
        {Object.keys(store.timeline)
          .sort((a, b) => (a > b ? -1 : 1))
          .map((item) => (
            <div key={item} class="mt-8 flex flex-col">
              <span class="text-lg font-semibold text-zinc-600 dark:text-gray-400">{item}</span>
              {/* @ts-ignore */}
              {store.timeline[item].map((exp: { content: { Title: string }; renderedText: string }) => (
                <div key={exp.content.Title} class="relative mt-5 flex flex-row items-start space-x-5">
                  <div class="mt-1 h-[12px] w-[12px]">
                    <Heart width={12} height={21} />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-md font-semibold text-zinc-600 dark:text-gray-400 sm:text-lg">{exp.content.Title}</span>
                    <div class="font-light text-slate-600 dark:text-slate-400" dangerouslySetInnerHTML={exp.renderedText} />
                  </div>
                </div>
              ))}
            </div>
          ))}
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
