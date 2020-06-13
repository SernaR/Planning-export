import React from 'react';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import fr from 'date-fns/locale/fr';
registerLocale('fr', fr)
setDefaultLocale('fr')

import "react-datepicker/dist/react-datepicker.css";

const DateTime = ({name, startDate = '', setStartDate}) => {
    return ( 
        <div className="form-field">   
            <DatePicker
                locale="fr"
                placeholderText="Date Time"
                selected={ startDate }
                onChange={ date => setStartDate(name, date) }
                minDate={new Date()}
                //ajouter 2heures
                showTimeSelect
                timeCaption="heure"
                dateFormat="Pp"
                
                className="btn white"
            />
        </div>
    )
}
 
export default DateTime;