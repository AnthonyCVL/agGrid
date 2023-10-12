// utilidades.js
const isURL = (text) => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(text);
};

export const UrlRenderer = ({ value }) => {
    const handleClick = () => {
        if (isURL(value)) {
            window.open(value, '_blank');
        }
    };

    const style = isURL(value)
        ? { cursor: 'pointer', color: 'blue', textDecoration: 'underline' }
        : {};

    return (
        <div onClick={handleClick} style={style}>
            {value}
        </div>
    );
};

const linkRenderer = (params) => {
    const isLink = isURL(params.value);

    if (isLink) {
        return `<a href="${params.value}" target="_blank" rel="noopener noreferrer">${params.value}</a>`;
    } else {
        return params.value;
    };
}

export const gridOptionsHeader = {
    components: { linkRenderer },
    pagination: false,
};

export const gridOptions = {
    components: { linkRenderer },
};


const columnDefs = (key) => ({
    field: key,
    hide: key.toLowerCase() === 'v_obsv',
    //tooltipComponent: customToolTip,
    cellRenderer: 'linkRenderer',
    cellStyle: params => {
        let style = {};
        if (isNaN(params.value)) {
            style['text-align'] = 'left'
        } else {
            style['text-align'] = 'right'
        }
        if (isURL(params.value)) {
            console.log('isURLLLL!!!')
            console.log(params.value)
        }

        //Para todas las celdas valida que el campo v_obsv exista y su contenido sea diferente de null
        if ('v_obsv' in params.data && params.data.v_obsv !== null && params.data.v_obsv !== "") {
            //Valida que el contenido de v_obsv sea un String
            if (typeof params.data.v_obsv === 'string' || params.data.v_obsv instanceof String) {
                //Transforma el JSON en String en un objeto JSON
                params.data.v_obsv = JSON.parse(params.data.v_obsv)
            }
            //Recorre el JSON contenido en v_obsv
            Object.keys(params.data.v_obsv).map(kjson => {
                //Valida que el cellStyle se aplique sobre el campo contenido en cada elemento del JSON de v_obsv
                //Valida que el JSON sea diferente de null
                if ((kjson.toLowerCase() === params.colDef.field.toLowerCase() || kjson.toLowerCase() == "all_fields") && params.data.v_obsv[kjson] !== null) {
                    //Aplica estilos a la celda del elemento del JSON de v_obsv
                    Object.keys(params.data.v_obsv[kjson]).map(prop => {
                        style[prop.replace("_", "-")] = params.data.v_obsv[kjson][prop].replace("_", "-")
                        //style[prop] = (params.data.v_obsv[kjson][prop]==null ? '' : params.data.v_obsv[kjson][prop])
                    })
                    return true
                }
            })
        }
        return style;
    }
})

export const getDynamicColumns = (obj) => {
    return Object.keys(obj).map(key => columnDefs(key))
}

export const defColumnDefs = {
    //editable: true,
    //enableRowGroup: true,
    //enablePivot: true,
    //enableValue: true,
    sortable: true,
    resizable: true,
    filter: true,
    flex: 1,
    //tooltipComponent: <p>Hola</p>
    //minWidth: 100
}

export function onRowDataChanged(params) {
    autoSizeColumns(params)
}

export function autoSizeColumns(params) {
    if (params.columnApi.columnModel === undefined) {
        return
    }
    const colIds = params.columnApi
        .getAllDisplayedColumns()
        .map(col => col.getColId());
    params.columnApi.autoSizeColumns(colIds);
};