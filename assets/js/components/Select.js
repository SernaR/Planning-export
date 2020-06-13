import React from 'react';

const Select = ({name, items, onChange}) => {
    return ( 
        <select className="form-control" name={name} onChange={ onChange }>
            <option value={0}></option>
            {items.map (item => <option key={item.id} value={item.id}>{item.name}</option>)}  
        </select>
     );
}
 
export default Select;