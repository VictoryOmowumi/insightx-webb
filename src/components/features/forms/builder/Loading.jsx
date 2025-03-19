import { Loader } from 'lucide-react'

const Loading = () => {
  return (
    <div className='w-full h-[80vh]  flex justify-center items-center text-black dark:text-white'>
        <Loader size={64} strokeWidth={1} className='animate-spin' />
    </div>
  )
}

export default Loading