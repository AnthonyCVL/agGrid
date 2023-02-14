import { useState } from "react";
import Select from "react-select";

function CustomSelect({options, value, styles, setValue}){
    const defaultSelected = options[0]
    const [selected, setSelected] = useState(defaultSelected);
    const onChange = (option) => { setSelected(option), setValue(option)}

    return (
    <div className="div-select">
        <Select styles={styles} options={options} value={selected} onChange={onChange}/>
    </div>
    )
}

export default CustomSelect;