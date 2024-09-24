async function updatePlots() {

    const response = await fetch('/data');
        
    const result = await response.json();

    const FyH = result.data.map(row => row.FyH);

    const temperatura = result.data.map(row => parseFloat(row.T).toFixed(1));
    
    const nobosidad = result.data.map(row => parseFloat(row.NB).toFixed(1));

    const pptd = result.data.map(row => parseFloat(row.PPTD).toFixed(1));

    const pptc = result.data.map(row => parseFloat(row.PPTC).toFixed(1));

    const windSpeed = result.data.map(row => parseFloat(row.WS).toFixed(1));

    const windDir = result.data.map(row => parseFloat(row.WD).toFixed(1));

    const humedadRelativa = result.data.map(row => parseFloat(row.SH).toFixed(1));

    // Context temperatura
    const ctx_T = document.getElementById('chart_temp');
    // Context nubosidad
    const ctx_NB = document.getElementById('chart_nb');
    // Context precipitación discreta
    const ctx_PPT = document.getElementById('chart_ppt');
    // Context velocidad del viento
    const ctx_WS = document.getElementById('chart_wind_speed');
    // Context dirección del viento
    const ctx_WD = document.getElementById('chart_wind_dir');
    // Context humedad relativa
    const ctx_HR = document.getElementById('chart_hum');

    // Create the line chart for FyH vs Temperature
    new Chart(ctx_T, {

        type: 'bar',
        
        data: {
            labels: FyH, // X-axis labels (FyH)
            datasets: [{
                label: 'Temp. (°C)',
                data: temperatura, // Y-axis data (Temperature)
                backgroundColor: '#F4A6A2',
                
            }]
        },

        options: {
            scales: {
                x: {
                    title: {
                        display: false,
                        // text: 'Date/Time (FyH)'
                    },

                    type: 'time',

                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'dd/MM HH'
                        }
                    },
                    ticks: {
                        maxRotation: 90,
                        minRotation: 90,
                        stepSize: 6,
                        autoSkip: false

                    },
                    min: FyH[0],
                    max: FyH[-1],
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temp. (°C)'
                    },
                    min: 0,
                    max: 35
                }
            },
            
            responsive: true,
           
            plugins: {
                legend: {
                    display: true, // Display the legend
                    position: 'top', // Position the legend at the top
                },

                annotation: {
                    annotations: {
                        verticalLine: {
                            type: 'line',
                            xMin: new Date(),
                            xMax: new Date(),
                            borderColor: 'black',
                            borderDash: [10, 5],
                            borderWidth: 1,
                        }
                    }
                }
                
            }
        }
    })

    // Create the line chart for FyH vs Nubosity
    new Chart(ctx_NB, {

        type: 'bar',
        
        data: {
            labels: FyH, // X-axis labels (FyH)
            datasets: [{
                label: 'Nub. (%)',
                data: nobosidad,
                backgroundColor: '#D3D3D3',
            }]
        },

        options: {
            scales: {
                x: {
                    title: {
                        display: false,
                        // text: 'Date/Time (FyH)'
                    },

                    type: 'time',

                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'dd/MM HH'
                        }
                    },
                    ticks: {
                        maxRotation: 90,
                        minRotation: 90,
                        stepSize: 6,
                        autoSkip: false

                    },

                    min: FyH[0],
                    max: FyH[-1],

                },
                y: {
                    title: {
                        display: true,
                        text: 'Nub. (%)'
                    },
                    min: 0,
                    max: 100
                }
            },
            
            responsive: true,
           
            plugins: {
                legend: {
                    display: true, // Display the legend
                    position: 'top', // Position the legend at the top
                },

                annotation: {
                    annotations: {
                        verticalLine: {
                            type: 'line',
                            xMin: new Date(),
                            xMax: new Date(),
                            borderColor: 'black',
                            borderDash: [10, 5],
                            borderWidth: 1,
                        }
                    }
                }
                
            }
        }
    })

    // Create the line chart for FyH vs Ppt
    new Chart(ctx_PPT, {

        type: 'bar',
        
        data: {
            labels: FyH, // X-axis labels (FyH)
            datasets: [
                {
                    label: 'Ppt. D (mm)',
                    data: pptd,
                    backgroundColor: '#A2C2E2',
                },
                {
                    label: 'Ppt. C (mm)',
                    data: pptc,
                    borderColor: 'black',
                    borderWidth: .5,
                    pointRadius: 0,
                    type: 'line'
                }
        ]
        },

        options: {
            scales: {
                x: {
                    title: {
                        display: false,
                        // text: 'Date/Time (FyH)'
                    },

                    type: 'time',

                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'dd/MM HH'
                        }
                    },
                    ticks: {
                        maxRotation: 90,
                        minRotation: 90,
                        stepSize: 6,
                        autoSkip: false

                    },
                    min: FyH[0],
                    max: FyH[-1],

                },
                y: {
                    title: {
                        display: true,
                        text: 'Ppt. (mm)'
                    },
                    min: 0,
                    max: 80
                }
            },
            
            responsive: true,
            
            plugins: {
                legend: {
                    display: true, // Display the legend
                    position: 'top', // Position the legend at the top
                },

                annotation: {
                    annotations: {
                        verticalLine: {
                            type: 'line',
                            xMin: new Date(),
                            xMax: new Date(),
                            borderColor: 'black',
                            borderDash: [10, 5],
                            borderWidth: 1,
                        }
                    }
                }
                
            }
        }
    })

    // Create the line chart for FyH vs WS
    new Chart(ctx_WS, {

        type: 'bar',
        
        data: {
            labels: FyH, // X-axis labels (FyH)
            datasets: [{
                label: 'WS. (km/h)',
                data: windSpeed,
                backgroundColor: '#D6A4D2',
            }]
        },

        options: {
            scales: {
                x: {
                    title: {
                        display: false,
                        // text: 'Date/Time (FyH)'
                    },

                    type: 'time',

                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'dd/MM HH'
                        }
                    },
                    ticks: {
                        maxRotation: 90,
                        minRotation: 90,
                        stepSize: 6,
                        autoSkip: false

                    },
                    min: FyH[0],
                    max: FyH[-1],

                },
                y: {
                    title: {
                        display: true,
                        text: 'WS. (km/h)'
                    },
                    min: 0,
                    max: 50
                }
            },
            
            responsive: true,
            
            plugins: {
                legend: {
                    display: true, // Display the legend
                    position: 'top', // Position the legend at the top
                },

                annotation: {
                    annotations: {
                        verticalLine: {
                            type: 'line',
                            xMin: new Date(),
                            xMax: new Date(),
                            borderColor: 'black',
                            borderDash: [10, 5],
                            borderWidth: 1,
                        }
                    }
                }
                
            }
        }
    })

    // Create the line chart for FyH vs WD
    new Chart(ctx_WD, {

        type: 'bar',
        
        data: {
            labels: FyH, // X-axis labels (FyH)
            datasets: [{
                label: 'WD. (°)',
                data: windDir,
                backgroundColor: '#F9E2A1',
            }]
        },

        options: {
            scales: {
                x: {
                    title: {
                        display: false,
                        // text: 'Date/Time (FyH)'
                    },

                    type: 'time',

                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'dd/MM HH'
                        }
                    },
                    ticks: {
                        maxRotation: 90,
                        minRotation: 90,
                        stepSize: 6,
                        autoSkip: false

                    },
                    min: FyH[0],
                    max: FyH[-1],

                },
                y: {
                    title: {
                        display: true,
                        text: 'WD. (°)'
                    },
                    min: 0,
                    max: 360
                }
            },
            
            responsive: true,
            
            plugins: {
                legend: {
                    display: true, // Display the legend
                    position: 'top', // Position the legend at the top
                },

                annotation: {
                    annotations: {
                        verticalLine: {
                            type: 'line',
                            xMin: new Date(),
                            xMax: new Date(),
                            borderColor: 'black',
                            borderDash: [10, 5],
                            borderWidth: 1,
                        }
                    }
                }
                
            }
        }
    })

    // Create the line chart for FyH vs HR
    new Chart(ctx_HR, {

        type: 'bar',
        
        data: {
            labels: FyH, // X-axis labels (FyH)
            datasets: [{
                label: 'HR (%)',
                data: humedadRelativa,
                backgroundColor: '#A4D3A2',
            }]
        },

        options: {
            scales: {
                x: {
                    title: {
                        display: false,
                        // text: 'Date/Time (FyH)'
                    },

                    type: 'time',

                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'dd/MM HH'
                        }
                    },
                    ticks: {
                        maxRotation: 90,
                        minRotation: 90,
                        stepSize: 6,
                        autoSkip: false

                    },
                    min: FyH[0],
                    max: FyH[-1],

                },
                y: {
                    title: {
                        display: true,
                        text: 'HR (%)'
                    },
                    min: 0,
                    max: 100
                }
            },
            
            responsive: true,
            
            plugins: {
                legend: {
                    display: true, // Display the legend
                    position: 'top', // Position the legend at the top
                },

                annotation: {
                    annotations: {
                        verticalLine: {
                            type: 'line',
                            xMin: new Date(),
                            xMax: new Date(),
                            borderColor: 'black',
                            borderDash: [10, 5],
                            borderWidth: 1,
                        }
                    }
                }
                
            }
        }
    })
    
}

document.addEventListener('DOMContentLoaded', async () => {

    updatePlots();

    // Refresh every 5 minutes
    setInterval(updatePlots, 5 * 60 * 1000);

})