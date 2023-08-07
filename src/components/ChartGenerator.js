import React, { useState } from 'react';
import axios from 'axios';

const ChartGenerator = (props) => {
  const [data, setData] = useState({ x: [], y: [] });
  const [chartType, setChartType] = useState('');
  const [vbaCode, setVbaCode] = useState('');

  const generateChart = async (json_data, chartType) => {
    console.log("json_data")
    console.log(json_data)
    console.log("chartType")
    console.log(chartType)
    const prompt_input=`Generate VBA code for a ${chartType} chart with data ${JSON.stringify(json_data)}`
    console.log(prompt_input)
    // Enviar la solicitud a la API de ChatGPT
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003',
      prompt: prompt_input,
      max_tokens: 700,
      temperature: 0.5,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
      },
    });

    // Obtener el código VBA del resultado de la API
    console.log(response)
    const vbaCode = response.data.choices[0].text;
    console.log(vbaCode)
    setVbaCode(vbaCode);
  };

  return (
    <div>
      {/* Botón para generar el código del gráfico */}
      <button onClick={() => generateChart(props.p_data, props.p_chart_type)}>Generar Código del Gráfico</button>

      {/* Mostrar el código del gráfico generado */}
      <pre>{vbaCode}</pre>
    </div>
  );
};

export default ChartGenerator;
