
import useDesigner from '@/hooks/useDesigner'
import FormElementSidebar from './FormElementSidebar'
import PropertiesFormSidebar from './PropertiesFormSidebar'
const DesignerSidebar = () => {
  const {selectedElement} = useDesigner();
  return (
    <aside className='flex-[2] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4  bg-white dark:bg-neutral-900 overflow-y-auto h-full '>
      {!selectedElement && <FormElementSidebar />}
      {selectedElement && <PropertiesFormSidebar />}
    </aside>
  )
}

export default DesignerSidebar 



