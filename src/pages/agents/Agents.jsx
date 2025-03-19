import React from 'react'
import BreadCrumbs from '@/components/layout/BreadCrumb'
import AgentsTable from '@/components/features/agents/AgentsTable'
import NewAgentBtn from '@/components/features/agents/NewAgentBtn'
import SummaryCards from '@/components/features/agents/SummaryCards'
const Agents = () => {
    return (
        <div className=' flex flex-col mt-5 md:mx-1'>
            <div className="flex justify-between items-center ">
                <div className="flex flex-col gap-1">
                    <h1 className="text-5xl capitalize">Agents Management</h1>
                    <BreadCrumbs />
                </div>
                <div className="flex items-center gap-1">
                   <NewAgentBtn />
                </div>
            </div>
            <SummaryCards />
            <AgentsTable />
        </div>
    )
}

export default Agents