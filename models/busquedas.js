const fs = require('fs');
const axios = require('axios').default;

class Busquedas {
  historialArr = [];
  dbPath = './db/base.json';

  get getMapboxParams() {
    return {
      access_token: process.env.MAPBOK_KEY,
      types: 'country,region,place,postcode,locality,neighborhood',
      limit: 5,
      language: 'es',
    };
  }

  get getOpenWeatherParams() {
    return {
      appid: process.env.OPENWEATHER_JEY,
      units: 'metric',
      lang: 'sp',
    };
  }

  get getLugaresCapitalizados() {
    return this.historialArr.map((lugar) => {
      let palabras = lugar.split(' ');
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));
      return palabras.join(' ');
    });
  }

  constructor() {
    this.leerDB();
  }

  async ciudad(ciudad = '') {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ciudad}.json`,
        params: this.getMapboxParams,
      });

      const resp = await instance.get();

      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name_es,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async climaCiudad(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: 'https://api.openweathermap.org/data/2.5/weather',
        params: { ...this.getOpenWeatherParams, lat, lon },
      });

      const resp = await instance.get();
      const { weather, main } = resp.data;

      return {
        estado: weather[0].description,
        grados: main.temp,
        sensacion: main.feels_like,
        min: main.temp_min,
        max: main.temp_max,
      };
    } catch (error) {
      throw error;
    }
  }

  historial(lugar = '') {
    if (this.historialArr.includes(lugar.toLocaleLowerCase())) {
      return;
    }
    this.historialArr = this.historialArr.splice(0, 5);
    this.historialArr.unshift(lugar.toLocaleLowerCase());
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historialArr,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDB() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
    const data = JSON.parse(info);
    this.historialArr = data.historial;
  }
}

module.exports = Busquedas;
