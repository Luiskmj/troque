import { mdiConsoleLine } from '@mdi/js';
import axios from 'axios';
import Swal from 'sweetalert2';

async function handleError(err, history, customMsg) {
  if (axios.isAxiosError(err) && err.response) {
    // const jsonData = JSON.parse(err.response.request.response);
    // const statusCode = jsonData.message.response.statusCode;

    // if (statusCode === 401){
    //     await Swal.fire({
    //       icon: 'error',
    //       title: 'Login inválido',
    //       text: 'Não foi possível fazer uam conexão com a transportadora, ela está nos falando que seu login é invalido. Verifique seus dados nas configurações de transportadoras!',
    //     });

    //     return;
    // }

    switch (err.response.status) {
      case 401: {
        await Swal.fire({
          icon: 'info',
          title: 'Login inválido',
          text: 'O token expirou. Por favor, efetue seu login novamente.',
          timer: 3000,
          timerProgressBar: true,
        });

        window.localStorage.clear();
        history.push('/');
        break;
      }
      default: {
        let erro = "";
        if (err.response.data.message.response !== undefined)
          erro = err.response.data.message.response.statusCode == 401 ? "Os Correios retornaram erro de conexão na sua conta. Verifique seu usuário e senha no sistema dos correios" : "";
        else
          erro = err.response.data.message;

        await Swal.fire({
          icon: 'error',
          title: 'Algo deu errado',
          text:
            customMsg ||
            (typeof err.response.data.message === 'string'
              ? err.response.data.message
              : erro === "" ? `Ocorreu um erro, o sistema da transportadora pode estar com instabilidade. Por favor, tente novamente em alguns minutos.` : erro),
        });
      }
    }

    return;
  }

  if (err instanceof Error) {
    console.log("erro ===> ",err);
    await Swal.fire({
      icon: 'error',
      title: 'Algo deu errado',
      text: err.message,
    });

    return;
  }

  await Swal.fire({
    icon: 'error',
    title: 'Algo deu errado',
    text: 'Ocorreu um erro. Por favor, tente novamente.',
  });
}

export default handleError;
