require('dotenv').config();
require('colors');

const { mostarMenu, pause, input, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async () => {
  let optMenu;
  const busqueda = new Busquedas();

  do {
    optMenu = await mostarMenu();
    switch (optMenu) {
      case 1:
        const query = await input();
        const lugares = await busqueda.ciudad(query);
        const id = await listarLugares(lugares);
        if (id === '0') continue;

        const lugar = lugares.find((l) => l.id === id);
        busqueda.historial(lugar.nombre);

        const clima = await busqueda.climaCiudad(lugar.lat, lugar.lng);

        console.clear();
        console.log('\n Información de la ciuidad: \n'.green);
        console.log('Ciudad:', lugar.nombre);
        console.log('Latitud:', lugar.lat);
        console.log('Longitud:', lugar.lng);
        console.log('Como esta el tiempo:', clima.estado);
        console.log('Temperatura:', clima.grados, '   minima:'.grey, clima.min, 'maxima:'.grey, clima.max);

        break;

      case 2:
        busqueda.getLugaresCapitalizados.forEach((lugar, i) => {
          i++;
          console.log(`${(i + '.').green} ${lugar}`);
        });
        break;
    }
    if (optMenu !== 0) await pause();
  } while (optMenu !== 0);
};

main();
