import React from 'react'
import { Link } from 'react-router-dom'
import { CircleFadingPlus } from 'lucide-react'
import BreadCrumbs from '../../components/layout/BreadCrumb'
import SummaryCards from '../../components/features/activities/SummaryCards'
import ActivitiesTable from '../../components/features/activities/ActivitiesTable'
import Filter from '../../components/features/activities/Filter'
const Activities = () => {
  return (
    <div className='flex flex-col gap-4 '>
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col">
          <h1 className="text-5xl capitalize">Activities</h1>
          <BreadCrumbs />
        </div>
         <div className="flex items-center gap-1">
          {/* <Filter /> */}
        <Link to="/activities/add" className="bg-[#303030] dark:bg-neutral-700 flex items-center font-comfortaa text-white px-4 py-2.5 rounded-full hover:bg-[#202020]">
          <CircleFadingPlus size={20} strokeWidth={1} className="mr-2" />
          New Activity
        </Link>
         </div>
      </div>
      <SummaryCards />
      <ActivitiesTable />
      
    </div>
  )
}

export default Activities