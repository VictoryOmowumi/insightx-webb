import { useEffect, useState } from 'react';
import PreviewDialogBtn from './PreviewDialogBtn';
import PublishFormBtn from './PublishFormBtn';
import SaveFormBtn from './SaveFormBtn';
import Designer from './Designer';
import { DndContext, useSensor, MouseSensor, useSensors, TouchSensor } from '@dnd-kit/core';
import DragOverlayWrapper from './DragOverlayWrapper';
import useDesigner from '@/hooks/useDesigner';
import BreadCrumbs from '@/components/layout/BreadCrumb';
import { useParams } from 'react-router-dom';
import { getFormById } from '@/services/api';
import { formStatusClasses } from '@/utils/format';
import Responses from './Responses';
import Settings from './Settings';
import Loader from '@/components/common/Loader';


const Builder = () => {
  const { id } = useParams();
  const [isPublished, setIsPublished] = useState(false);
  const [activeTab, setActiveTab] = useState('Designer');
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setElements } = useDesigner();
  const tabsList = [
    { name: 'Designer', component: <Designer /> },
    { name: 'Responses', component: <Responses formId={id} /> },
    { name: 'Settings', component: <Settings form={form} /> },
  ];

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    setLoading(true);
    const fetchForm = async () => {
      try {
        const form = await getFormById(id);
        setForm(form);
        setElements(form.elements);
        setIsPublished(form.status === 'published');
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className='flex justify-center items-center text-3xl h-[70vh]'>{error.response.data.message || 'An error occurred'} </div>;

  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full h-full no-scrollbar">
        <nav className="flex justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl capitalize flex items-center">
              {form?.title}
              <span className={`ml-2 text-sm py-1 px-2.5 rounded-3xl ${formStatusClasses(form?.status)}`}>
                {form?.status}
              </span>
            </h1>
            <BreadCrumbs />
          </div>

          <div className="flex items-center gap-2">
            <SaveFormBtn />
            <PreviewDialogBtn />
            <PublishFormBtn />
          </div>
        </nav>
        <div className="mt-2 flex items-center gap-5 mx-auto w-full justify-center bg-white dark:bg-neutral-800 p-2.5 rounded-t-xl">
          {tabsList.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`md:mx-5 transition ease-in-out duration-300 font-medium ${activeTab === tab.name ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
                }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <div className="no-scrollbar  flex w-full flex-grow relative overflow-y-auto min-h-[550px] md:h-[550px] 2xl:h-[700px] bg-card dark:bg-neutral-900 rounded-b-md">
          {tabsList.find((tab) => tab.name === activeTab).component}
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
};

export default Builder;