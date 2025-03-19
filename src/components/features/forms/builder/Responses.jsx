import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  
} from '@mui/x-data-grid';
import { getFormResponses } from '@/services/api'; // Import the API function
import moment from 'moment';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flex: 1,
          justifyContent: 'flex-end',
        }}
      >
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
      </div>
    </GridToolbarContainer>
  );
}

const Responses = ({ formId }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const data = await getFormResponses(formId); // Fetch responses for the form
        setResponses(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchResponses();
  }, [formId]);

  if (loading) return <p>Loading responses...</p>;
  if (error) return <p>Error fetching responses: {error.message}</p>;

  // Dynamically generate columns based on formData keys
  const formDataKeys = responses.length > 0 ? Object.keys(responses[0].formData) : [];
  const formDataColumns = formDataKeys.map((key) => ({
    field: `formData.${key}`, // Use dot notation to access nested formData
    headerName: key,
    width: 200,
    renderCell: (params) => (
      <div>{params.row.formData[key]}</div>
    )
  }));

  const columns = [
    {
      field: 'submittedAt',
      headerName: 'Submission Date',
      flex: 1, 
      renderCell: (params) => (
        <div>{moment(params.value).format('Do MMM YYYY, h:mm:ss a')}</div>
      ),
    },
    {
      field: 'agentName',
      headerName: 'Agent Name',
      flex: 1,
     
    },
    {
      field: 'agentPhone',
      headerName: 'Agent Number',
      flex: 1,
    
    },
    ...formDataColumns, // Include dynamically generated formData columns
  ];


  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Responses</h2>
      {responses.length > 0 ? (
        <div style={{ height: '100%', width: '100%' }}>
          <DataGrid
            rows={responses}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row._id}
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            checkboxSelection
            pageSizeOptions={[10, 20, 30, 40, 100]}
            clipboardCopyCellDelimiter=" "
            slots={{
              toolbar: CustomToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-40">
          <p>No responses yet.</p>
        </div>
      )}
    </div>
  );
};

export default Responses;