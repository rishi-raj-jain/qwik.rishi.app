import { component$ } from '@builder.io/qwik'

interface HeartProps {
  width: number
  height: number
}

export default component$(({ width, height }: HeartProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="currentColor" class="dark:text-gray-400" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"></path>
    </svg>
  )
})
