import React from 'react';
import './pageLoader.scss';

const PageLoader = () => {
    return (
        <div className="page-loader">
            <div className="loader">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
            </div>
        </div>
    );
};

export default PageLoader;
