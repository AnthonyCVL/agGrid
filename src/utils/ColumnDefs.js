const columnDefs = (key) => ({
    field: key,
    hide: key.toLowerCase() === 'v_obsv',
    //tooltipComponent: customToolTip,
    cellStyle: params => {
        let style = {};
        if (isNaN(params.value)) {
            style['text-align'] = 'left'
        } else {
            style['text-align'] = 'right'
        }
        //Para todas las celdas valida que el campo v_obsv exista y su contenido sea diferente de null
        if ('v_obsv' in params.data && params.data.v_obsv !== null && params.data.v_obsv !== "") {
            //Valida que el contenido de v_obsv sea un String
            if (typeof params.data.v_obsv === 'string' || params.data.v_obsv instanceof String) {
                //Transforma el JSON en String en un objeto JSON
                params.data.v_obsv = JSON.parse(params.data.v_obsv)
            }
            //Recorre el JSON contenido en v_obsv
            // eslint-disable-next-line array-callback-return
            Object.keys(params.data.v_obsv).map(kjson => {
                //Valida que el cellStyle se aplique sobre el campo contenido en cada elemento del JSON de v_obsv
                //Valida que el JSON sea diferente de null
                if ((kjson.toLowerCase() === params.colDef.field.toLowerCase() || kjson.toLowerCase() === "all_fields") && params.data.v_obsv[kjson] !== null) {
                    //Aplica estilos a la celda del elemento del JSON de v_obsv
                    // eslint-disable-next-line array-callback-return
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

const ColumnDefs = {
    columnDefs,
};

export default ColumnDefs;