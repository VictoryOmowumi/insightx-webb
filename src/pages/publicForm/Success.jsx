import React from 'react';
import { CheckCheck } from 'lucide-react';
const SuccessPage = () => {


    return (
        <div className="flex flex-col items-center  justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center   py-10 rounded-2xl max-w-2xl w-full">

                <div className="flex items-center justify-center text-5xl bg-green-100 text-green-500 w-40 h-40 rounded-full mb-4">
                    <CheckCheck size={96} strokeWidth={1} />
                </div>
                <h1 className="text-2xl font-bold mb-4">Feedback Submitted Successfully!</h1>
                <p className="text-gray-600 mb-8">Thank you for your submission.</p>
            </div>
        </div>
    );
};

export default SuccessPage;