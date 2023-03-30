import { component$ } from '@builder.io/qwik'

export default component$(({ post }: { post: any }) => {
  return (
    <div class="flex flex-row items-center space-x-3">
      <img
        loading="lazy"
        class="h-[30px]"
        alt={post.content.author.name}
        title={post.content.author.name}
        src={post.content.author.content.picture.filename}
      />
      <div class="flex flex-col">
        <span class="text-sm">{post.content.author.name}</span>
        <a class="text-xs text-blue-500" href="https://twitter.com/rishi_raj_jain_" target="_blank" rel="noreferrer">
          @rishi_raj_jain_
        </a>
      </div>
    </div>
  )
})
