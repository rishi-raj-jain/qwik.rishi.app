import MD_TO_HTML from '~/markdown'
import { component$ } from '@builder.io/qwik'
import Author from '~/components/blog/author'
import { routeLoader$ } from '@builder.io/qwik-city'
import DateString from '~/components/shared/date-string'
import type { DocumentHead } from '@builder.io/qwik-city'
import { Storyblok as StoryblokClient } from '~/storyblok'

export const useGetBlog = routeLoader$(async ({ params }) => {
  const { slug } = params
  try {
    const { data } = await StoryblokClient.get('cdn/stories/posts/' + slug, {
      resolve_relations: 'author',
    })
    const { story, rels } = data
    story['content']['long_text'] = await MD_TO_HTML(story['content']['long_text'])
    story['content']['author'] = rels[0]
    return { story }
  } catch (e) {
    // @ts-ignore
    console.log(e.message || e.toString())
    return { story: null }
  }
})

export default component$(() => {
  const blog = useGetBlog()
  return (
    <div class="flex w-full flex-col items-center">
      <div class="w-full md:max-w-2xl">
        <div class="flex w-full flex-col items-center">
          <DateString date={new Date(blog.value.story.first_published_at)} />
          <h1 class="mt-3 mb-7 text-center text-2xl font-bold sm:text-4xl">{blog.value.story.content.title}</h1>
          <Author post={blog.value.story} />
        </div>
        <div class="mt-7 h-[1px] w-full bg-gray-200"></div>
        <article
          dangerouslySetInnerHTML={blog.value.story.content.long_text}
          class="prose mt-10 flex max-w-none flex-col items-center text-sm dark:prose-light"
        />
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
