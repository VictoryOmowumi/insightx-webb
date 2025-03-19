import React, { useState } from 'react';
import { Paperclip, Trash2, Send, PlusCircle } from 'lucide-react';
import { Modal, Box } from '@mui/material';
import moment from 'moment';
import { postActivityFeedback } from '@/services/api';
import { toast, Toaster } from 'sonner';

const ActivityFeedback = ({ activity }) => {
  const [feedback, setFeedback] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]); // Store multiple feedback entries
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleFileUpload = (event) => {
    if (event.target.files) {
      setAttachments([...attachments, ...Array.from(event.target.files)]);
    }
  };

  const handleRemoveFile = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!feedback.trim()) return; // Prevent empty feedback submissions
    const formData = new FormData();
    formData.append('comment', feedback);

    attachments.forEach((file) => {
      formData.append('files', file);
    });

    try {
      setLoading(true);
      const response = await postActivityFeedback(activity._id, formData);
      setFeedbackList([...feedbackList, response]);
      setFeedback('');
      setAttachments([]);
      setIsModalOpen(false);
      toast.success('Feedback submitted successfully!');
    } catch (error) {
      setError(error);
      console.log(error);
      toast.error('Failed to submit feedback: ' + error.response.data.message);
    } finally {
      setLoading(false);
    }


  };

  return (
    <div className="flex flex-col gap-4 mx-5 my-2 h-full">
      <h2 className="text-lg font-semibold">Feedback Section</h2>

      {/* Empty State & Add Feedback Button */}
      {feedbackList.length === 0 ? (
        <div className="flex flex-col items-center mb-5 h-full justify-center text-center text-gray-500 dark:text-gray-300 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p>No feedback has been added yet.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 flex items-center gap-2 bg-neutral-800 text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition"
          >
            <PlusCircle size={18} /> Add Feedback
          </button>
        </div>
      ) : (
        <>


          {/* Feedback List (Displays like a chat) */}
          <div className="flex flex-col gap-4 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg max-h-80 overflow-y-auto">
            {feedbackList.map((fb) => (
              <div key={fb.id} className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                {fb.attachments.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {fb.attachments.map((file, idx) => (
                      <div key={idx} className="relative">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        ) : (
                          <span className="text-xs text-gray-600 dark:text-gray-300">{file.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-900 dark:text-white">{fb.comment}</p>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-400 mr-2">{fb.createdBy}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{moment(fb.timestamp).fromNow()}</span>
              </div>
            ))}
          </div>

          {/* Add Feedback Button */}
          <div className="">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 w-max float-right bg-neutral-800 text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition"
            >
              <PlusCircle size={18} /> Add Feedback
            </button>
          </div>
        </>
      )}

      {/* Feedback Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} className='h-screen flex justify-center items-center'>
        <Box className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-[600px] w-full mx-auto mt-24 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Add Feedback</h2>

          {/* Textarea */}
          <textarea
            placeholder="Add your feedback..."
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:ring-0 resize-none text-gray-900 dark:text-white"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>

          {/* File Upload */}
          <label className="flex items-center justify-center gap-2 cursor-pointer bg-gray-100 dark:bg-gray-800 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition mt-3">
            <Paperclip size={18} />
            <span className="text-sm text-gray-600 dark:text-gray-300">Attach files</span>
            <input
              type="file"
              multiple
              accept="image/*, application/pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* File Previews */}
          {attachments.length > 0 && (
            <div className="flex flex-col gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-md mt-3">
              <h3 className="text-sm font-semibold">Uploaded Files</h3>
              <div className="grid grid-cols-2 gap-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm"
                  >
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-sm text-gray-600 dark:text-gray-300">{file.name}</span>
                    )}
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 flex items-center gap-1 text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition"
            >
              {loading ? (
                <svg
                  className="w-5 h-5 mr-2 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <div className="flex items-center fap-1">
                  <Send size={18} />
                  Send Feedback
                </div>
              )}
            </button>
          </div>
        </Box>
      </Modal>

      <Toaster richColors />
    </div>
  );
};

export default ActivityFeedback;