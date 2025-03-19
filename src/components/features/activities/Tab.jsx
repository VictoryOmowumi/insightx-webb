import React from 'react'

const Tab = ({tabs, activeTab, handleTabChange}) => {
  return (
    <div className="bg-card sticky top-0  flex gap-2 border-b border-neutral-200 dark:border-neutral-700">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => handleTabChange(tab.id)}
        className={`cursor-pointer py-4 px-6 text-lg font-medium transition-colors duration-500 ${
          activeTab === tab.id
            ? 'text-amber-500 dark:text-amber-400 border-b-2 border-amber-500 dark:border-amber-400'
            : 'text-neutral-500 dark:text-neutral-400'
        }`}
      >
        {tab.name}
      </button>
    ))}
  </div>
  )
}

export default Tab