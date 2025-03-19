import React from 'react'
import { BiMessageError } from 'react-icons/bi'
const Error = ({error}) => {
  return (
    <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
            <BiMessageError className='text-9xl text-red-500' />
            <h1 className='text-4xl font-bold'>Oops! Something went wrong</h1>
            <p className='text-xl text-gray-500 mt-4'>{error.message}</p>
        </div>
    </div>
  )
}

export default Error