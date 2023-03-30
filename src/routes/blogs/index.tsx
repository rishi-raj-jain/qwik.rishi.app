import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'
import DateString from '~/components/shared/date-string'
import type { DocumentHead } from '@builder.io/qwik-city'
import { Storyblok as StoryblokClient } from '~/storyblok'
import type Storyblok from 'storyblok-js-client/dist/types'

export const useGetTagline = routeLoader$(async () => {
  try {
    const { data } = await StoryblokClient.get('cdn/stories/taglines/blogs')
    return { tagline: StoryblokClient.richTextResolver.render(data.story.content.Text) }
  } catch (e) {
    // @ts-ignore
    console.log(e.message || e.toString())
    return { tagline: null }
  }
})

export const useGetRecommendedPosts = routeLoader$(async () => {
  try {
    const { data } = await StoryblokClient.get('cdn/stories', { page: 1, per_page: 100, starts_with: 'recommended/' })
    return { recommendedPosts: data.stories }
  } catch (e) {
    // @ts-ignore
    console.log(e.message || e.toString())
    return { recommendedPosts: null }
  }
})

export const useGetBlogs = routeLoader$(async () => {
  try {
    let posts: any[] = []
    const getPosts = async (page: number, client: Storyblok) => {
      const res = await client.get('cdn/stories', {
        page: page,
        per_page: 100,
        starts_with: 'posts/',
      })
      posts = [...posts, ...res.data.stories]
      const total = res.total
      const lastPage = Math.ceil(total / res.perPage)
      if (page <= lastPage) {
        page++
        await getPosts(page, client)
      }
    }
    await getPosts(1, StoryblokClient)
    return { posts }
  } catch (e) {
    // @ts-ignore
    console.log(e.message || e.toString())
    return { posts: [] }
  }
})

export default component$(() => {
  const blogs = useGetBlogs()
  const tagline = useGetTagline()
  const recommendedPosts = useGetRecommendedPosts()
  return (
    <div class="flex flex-col">
      <h1 class="text-2xl font-bold sm:text-5xl">Blogs</h1>
      <h2 dangerouslySetInnerHTML={tagline.value.tagline} class="font-regular text-md mt-5 whitespace-pre-line dark:text-gray-400 sm:text-xl" />
      <div class="flex flex-row flex-wrap">
        <div class="mt-10 flex w-full flex-col lg:mt-20 lg:w-2/3 lg:pr-10">
          {blogs.value.posts.map((item, _) => (
            <div key={_} class="mb-10 flex flex-col border-b pb-10 dark:border-gray-700">
              <span id={`first_published_at_${_}`} class={`text-gray-700 dark:text-gray-400`}>
                {item && item.first_published_at ? <DateString date={new Date(item.first_published_at)} /> : 'placeholder date'}
              </span>
              {item && item.content && (
                <a href={'/blog/' + item.slug} class={`mt-3 text-lg font-bold hover:underline sm:text-2xl`}>
                  {item.content.title}
                </a>
              )}
              {item && item.content && <span class={`mt-3 text-sm text-gray-700 line-clamp-2 dark:text-gray-400`}>{item.content.intro}</span>}
              {item && item.slug && (
                <a href={'/blog/' + item.slug} class={`mt-5 text-sm uppercase text-blue-500 hover:underline`}>
                  Read More &rarr;
                </a>
              )}
            </div>
          ))}
        </div>
        <div class="mt-0 flex w-full flex-col lg:mt-20 lg:w-1/3">
          <h4 class="text-md font-bold sm:text-lg">Recommended Posts</h4>
          {recommendedPosts.value.recommendedPosts.map(
            (item: any) =>
              item &&
              item.content && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  key={item.content.Title}
                  href={item.content.Url.url}
                  class={`mt-5 truncate border-b pb-2 text-sm text-gray-500 hover:underline dark:border-gray-700 dark:text-gray-400`}
                >
                  {item.content.Title}
                </a>
              )
          )}
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
