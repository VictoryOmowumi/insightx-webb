import React, { useState, useEffect } from 'react';

const Loader = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 100) {
                    return prev + 1;
                } else {
                    clearInterval(interval);
                    return 100;
                }
            });
        }, 30);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='h-screen w-full flex flex-col justify-center items-center'>
            <div className="w-3/4 md:w-1/2 lg:w-1/3 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="mt-2 text-lg">{progress}%</p>
        </div>
    );
};


export default Loader