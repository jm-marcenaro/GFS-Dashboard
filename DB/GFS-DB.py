# Libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import xarray as xr
from datetime import datetime, timedelta
import ee
import sqlite3
import logging

# Set up logging
log_file = 'DBS-BD-LOG.txt'
logging.basicConfig(filename=log_file,
                    level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

logging.info("Script started.")

# from dask.distributed import Client, progress
# client = Client()  # set up local cluster on the machine

ee.Initialize()

# Verificar que se trate del centro de CABA!
COORDs = [
 [-59.01657927, -34.36323361],
 [-59.01268172, -34.84847940],
 [-58.35274585, -34.84317871],
 [-58.35664341, -34.35793292]]

ROI = ee.Geometry.Polygon(COORDs)

# Get the latest available forecast

DATE_STARTs = [f"{datetime.strftime(datetime.now(), '%Y-%m-%d')}T{HH}:00" for HH in ["00", "06", "12", "18"]]

DATE_ENDs = [(datetime.strptime(D, '%Y-%m-%dT%H:%M') + timedelta(hours=6)).strftime('%Y-%m-%dT%H:%M') for D in DATE_STARTs]

# Dictionar of image collections
DICT_Cs = {}

for S, E, DESC in zip(DATE_STARTs, DATE_ENDs, ["T00", "T06", "T12", "T18"]):
    
    DICT_Cs[DESC] = ee.ImageCollection("NOAA/GFS0P25") \
                        .filterBounds(ROI) \
                        .filterDate(S, E) \
                        .filterMetadata("forecast_hours", "greater_than", 0)

# Almacena la cantidad de elementos en cada colección
SIZEs = []

for C in DICT_Cs.keys():
    
    SIZEs.append(DICT_Cs[C].size().getInfo())

# Get index of latest non zero value of list
IDX = -1

# for i in SIZEs:
for i in SIZEs:
    
    if i != 0:
        IDX += 1
    
    else:
        pass

# Generar la clave de la colección de interés
if IDX == 0:
    N="T00"

elif IDX == 1:
    N="T06"
    
elif IDX == 2:
    N="T12"
    
else:
    N="T18"

logging.info(f"Simulación: {N}")

# Keep last forecast from dictionary
C_01 = DICT_Cs[N] # Devuelve 208 elementos (120 imágenes corresponden a los primeros 5 días, las 88 imágenes restantes corresponden a los últimos 11 días)

# Projection
PROJ = C_01.first().select(0).projection()

# Original scale
OS = C_01.first().projection().nominalScale().getInfo()

# Convertir en un DS de xarray
DS_01 = xr.open_dataset(C_01, \
                     engine='ee',\
                     projection=PROJ,\
                     geometry=ROI\
                     )


# Filtrar los primeros 120 registros
DS_01 = DS_01.isel(time=slice(0, 120))

# Define datetime range
FyH = pd.date_range(start=DATE_STARTs[IDX], freq="1H", periods=120+1)[1:]

DS_01 = DS_01.assign_coords(FyH=("time", FyH))

DS_01 = DS_01.swap_dims({"time" : "FyH"})
                            
DS_01 = DS_01.drop_vars("time")
    
# Define forecast hours
DS_01["FH"] = xr.DataArray(np.arange(1, 121), dims="FyH")

# Extraer pulsos de ppt discreta
DS_01["H"] = DS_01["FH"] % 6

DS_01["PPT_D"] = DS_01["total_precipitation_surface"].diff(dim="FyH")

DS_01["PPT_D"] = DS_01["PPT_D"].where(DS_01["H"].shift(FyH=1) != 0, DS_01["total_precipitation_surface"])

# To DF
DF_01 = DS_01.mean(dim=("lon", "lat")).to_dataframe()

# Cumulated PPT
DF_01["CUMSUM"] = DF_01["PPT_D"].cumsum()

# Transform U, V components of wind velocity

# Wind speed in km/h
DF_01["WS"] = np.sqrt((DF_01["u_component_of_wind_10m_above_ground"]**2 + DF_01["v_component_of_wind_10m_above_ground"]**2)) * (3600/1000)

# Wind direction
DF_01["WD"] = (np.degrees(np.arctan2(DF_01["u_component_of_wind_10m_above_ground"], DF_01["v_component_of_wind_10m_above_ground"])) + 360) % 360

# To UTC-3
DF_01.index = DF_01.index - pd.offsets.Hour(3)

# Filter columns of interest
DF_01 = DF_01[["temperature_2m_above_ground", "relative_humidity_2m_above_ground", "WS", "WD", "total_cloud_cover_entire_atmosphere", "PPT_D", "CUMSUM"]]

# Rename columns
DF_01.columns = ["T", "SH", "WS", "WD", "NB", "PPTD", "PPTC"]

# Overwrite DB

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('GFS-DB.db')

# Save DataFrame to the SQLite database in a table called 'FCST'
DF_01.to_sql('FCST', conn, if_exists='replace', index=True)

# Commit the transaction
conn.commit()

# Close the connection
conn.close()