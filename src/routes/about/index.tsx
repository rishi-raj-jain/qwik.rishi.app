import Heart from '~/components/shared/heart'
import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'
import type { DocumentHead } from '@builder.io/qwik-city'
import { Storyblok as StoryblokClient } from '~/storyblok'
import type Storyblok from 'storyblok-js-client/dist/types'

export const useGetTagline = routeLoader$(async () => {
  try {
    const { data } = await StoryblokClient.get('cdn/stories/taglines/about')
    return { tagline: StoryblokClient.richTextResolver.render(data.story.content.Text) }
  } catch (e) {
    // @ts-ignore
    console.log(e.message || e.toString())
    return { tagline: null }
  }
})

export const useGetTimeline = routeLoader$(async () => {
  try {
    const timeline = {}
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
        if (timeline.hasOwnProperty(story.content.Year)) {
          // @ts-ignore
          timeline[story.content.Year].push({ ...story, renderedText })
        } else {
          // @ts-ignore
          timeline[story.content.Year] = [{ ...story, renderedText }]
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
    return { timeline }
  } catch (e) {
    // @ts-ignore
    console.log(e.message || e.toString())
    return { timeline: [] }
  }
})

export default component$(() => {
  const tagline = useGetTagline()
  const timeline = useGetTimeline()
  return (
    <div class="flex w-full flex-col items-center text-[14px]">
      <div class="mt-10 flex w-[90vw] max-w-[540px] flex-col">
        <h1 class="text-3xl font-bold text-zinc-700 dark:text-gray-300">About Me</h1>
        {tagline.value.tagline && typeof tagline.value.tagline === 'string' && (
          <div class="mt-2 font-light text-slate-600 dark:text-slate-400" dangerouslySetInnerHTML={tagline.value.tagline} />
        )}
        <h2 class="mt-16 text-3xl font-bold text-zinc-700 dark:text-gray-300">My Timeline</h2>
        {timeline.value.timeline &&
          Object.keys(timeline.value.timeline)
            .sort((a, b) => (a > b ? -1 : 1))
            .map((item) => (
              <div key={item} class="mt-8 flex flex-col">
                <span class="text-lg font-semibold text-zinc-600 dark:text-gray-400">{item}</span>
                {/* @ts-ignore */}
                {timeline.value.timeline[item].map((exp: any) => (
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
