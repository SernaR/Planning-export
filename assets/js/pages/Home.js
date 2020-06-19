import React from 'react';
import { Link } from 'react-router-dom';

const Home = (props) => {
    return ( <div className="container">
        <h1 className="txt-center">Bienvenue dans le Laboratoire</h1>
        <div className="flex mt-5">
            <button className="btn outline txt-blue txt-light-3  mx-2"><Link to="/liste"><span className="outline-text outline-invert">List</span></Link></button>
            <button className="btn outline txt-blue txt-light-3 mx-2"><Link to="/creation"><span className="outline-text outline-invert">Create</span></Link></button>
            <button className="btn outline txt-blue txt-light-3 mx-2"><Link to="/realise"><span className="outline-text outline-invert">Fulfill</span></Link></button>
            <button className="btn outline txt-blue txt-light-3 mx-2"><Link to="/labo"><span className="outline-text outline-invert">Labo</span></Link></button>
        </div>
    </div>
    );
}
 
export default Home;