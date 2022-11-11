import React from "react";
import { NativeBaseProvider} from "native-base";
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold} from '@expo-google-fonts/roboto';

import { Signin } from './src/screens/Signin';
import { Loading } from './src/Components/Loading';

import { THEME } from './src/styles/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold
  });

  return (
    <NativeBaseProvider theme={THEME}>
        {fontsLoaded ? <Signin/> : <Loading/>}
    </NativeBaseProvider>
  );
}

