import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => {
    return ( <div className="container">
        <h1 className="txt-center">Bienvenue dans le Laboratoire</h1>
        <div className="flex mt-5">
            <button className="btn outline txt-blue txt-light-3  mx-2"><Link to="ordres/liste"><span className="outline-text outline-invert">List</span></Link></button>
            <button className="btn outline txt-blue txt-light-3 mx-2"><Link to="ordres/creation"><span className="outline-text outline-invert">Create</span></Link></button>
            <button className="btn outline txt-blue txt-light-3 mx-2"><Link to="/ordres/annonce/liste"><span className="outline-text outline-invert">Fulfills</span></Link></button>
            <button className="btn outline txt-blue txt-light-3 mx-2"><Link to="/labo"><span className="outline-text outline-invert">Labo</span></Link></button>
            <button className="btn outline txt-blue txt-light-3 mx-2"><Link to="/pdf"><span className="outline-text outline-invert">PDF</span></Link></button>
        </div>
    </div>
    );
}
 
export default Home;