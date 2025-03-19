import React from 'react'
import { useAuth } from '../../../context/AuthContext'
const Greeting = () => {
    const { user } = useAuth()

    const greetings = () => {
        const date = new Date()
        const hours = date.getHours()
        if (hours < 12) {
            return 'Good Morning'
        } else if (hours < 18) {
            return 'Good Afternoon'
        } else {
            return 'Good Evening'
        }
    };

    const shortenName = (name) => {
      const bracketIndex = name.indexOf('(');
      if (bracketIndex !== -1) {
          return name.substring(0, bracketIndex).trim();
      }
      return name;
  };

  return (
    <div className='px-2 text-4xl'>
        <h1>{greetings()}, {shortenName(user?.name)}!</h1>
      <p className='text-lg text-neutral-700 dark:text-neutral-300 ml-2'>Let dive in and get some work done.</p>
    </div>
  )
}

export default Greeting