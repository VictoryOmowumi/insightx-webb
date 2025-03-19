import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getActivityById } from '@/services/api';
import AddActivity from './AddActivity';
import Loader from '@/components/common/Loader';
const EditActivity = () => {
  const { id } = useParams(); // Get activity ID from the URL
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getActivityById(id);
        setActivity(data);
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  return (
    <AddActivity
      initialData={activity} 
      mode="edit" 
    />
  );
};

export default EditActivity;