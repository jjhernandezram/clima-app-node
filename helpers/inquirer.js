const inquirer = require('inquirer');
require('colors');

const opts = [
  {
    type: 'list',
    name: 'opt',
    message: '¿Que desea hacer?',
    choices: [
      {
        value: 1,
        name: `${'1.'.green} Buscar ciudad.`,
      },
      {
        value: 2,
        name: `${'2.'.green} Historial de busquedas.`,
      },
      {
        value: 0,
        name: `${'0.'.green} Salir.`,
      },
    ],
  },
];

const mostarMenu = async () => {
  console.clear();
  console.log('=========================='.green);
  console.log('    Estado del tiempo');
  console.log('==========================\n'.green);
  const { opt } = await inquirer.prompt(opts);
  return opt;
};

const pause = async () => {
  const question = [
    {
      type: 'input',
      name: 'opcion',
      message: `Presione ${'ENTER'.green} para continuar.`,
    },
  ];
  console.log(' ');
  console.log(' ');
  await inquirer.prompt(question);
};

const input = async () => {
  const question = [
    {
      type: 'input',
      name: 'ciudad',
      message: 'Introduzca el nombre de la ciudad a buscar:',
      validate(value) {
        if (value.length === 0) {
          return 'Por favor, escribe el nombre de una ciudad.';
        }
        return true;
      },
    },
  ];
  const { ciudad } = await inquirer.prompt(question);
  return ciudad;
};

const listarLugares = async (lugares = []) => {
  const opciones = lugares.map((lugar, i) => {
    const idx = `${i + 1}.`.green;
    return {
      value: lugar.id,
      name: `${idx} ${lugar.nombre}`,
    };
  });

  opciones.unshift({
    value: '0',
    name: `${'0.'.green} Cancelar`,
  });

  const preguntas = [
    {
      type: 'list',
      name: 'id',
      message: 'Seleccione ciudad:',
      choices: opciones,
    },
  ];

  console.log('');
  const { id } = await inquirer.prompt(preguntas);
  return id;
};

module.exports = {
  mostarMenu,
  pause,
  input,
  listarLugares,
};
