// Arquivo _app.tsx (ou outro componente pai)
import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import App from './page'; // Importe diretamente o componente App, sem usar dynamic

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    // Esse código será executado apenas no lado do cliente
    const clientState = ''; // Defina o estado do lado do cliente aqui, se necessário
  }, []);

  return <App {...pageProps} />;
};

export default MyApp;
