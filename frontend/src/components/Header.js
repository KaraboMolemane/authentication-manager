import { useState } from 'react';

function Header(){
    return(
        <header className="bd-header bg-secondary py-3 d-flex align-items-stretch border-bottom border-dark">
            <div className="container-fluid d-flex align-items-center">
                <h1 className="d-flex align-items-center fs-4 text-white mb-0">
                Department Repo
                </h1>
            </div>
        </header>
    );
}

export default Header;