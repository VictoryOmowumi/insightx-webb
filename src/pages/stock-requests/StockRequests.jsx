import React from 'react'
import { Link } from 'react-router-dom'
import { CircleFadingPlus } from 'lucide-react'
import BreadCrumbs from '../../components/layout/BreadCrumb'
import StockRequestTable from '@/components/features/stockRequests/StockRequestTable'
import StockSummary from '@/components/features/stockRequests/StockSummary'
import AddRequest from '../../components/features/stockRequests/AddRequest'

const StockRequests = () => {
  return (
    <div className='flex flex-col gap-4 '>
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col">
          <h1 className="text-5xl capitalize">Stock Requests</h1>
          <BreadCrumbs />
        </div>
        <div className="flex items-center gap-1">
         <AddRequest />
        </div>
      </div>
      <StockSummary />
      <StockRequestTable />
    </div>
  )
}

export default StockRequests