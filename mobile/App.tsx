import React from 'react';
import {AppLoading} from 'expo'
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Home from './src/pages/Home/index'
import {Roboto_400Regular,  Roboto_500Medium} from '@expo-google-fonts/roboto'
import {Ubuntu_700Bold, useFonts} from '@expo-google-fonts/ubuntu'
import Routes from './src/routes'

// VIEW representa uma div, section, header, footer, uma caixa mesmmo
// TEXT - qualquer tipo de texto
// as estilizações não sei feitas a partir de classes, mas se parece. 
// trocamos o ífem pra letra maíuscula
//Fragment não produz resultado final na tela, View resulta

export default function App() {

  const [fontLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  })

  if(!fontLoaded){
    return <AppLoading></AppLoading>
  }


  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent></StatusBar>
      <Routes></Routes>
      
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'yellow',
    paddingTop: 800
  }
})