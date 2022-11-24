import { Heading, VStack } from 'native-base';
import { Button } from '../Components/Button';
import { Header } from '../Components/Header';
import { Input } from '../Components/Input';

export function Find() {
  return (
    <VStack flex={1} bg='gray.900'>
      <Header title='Buscar por código' showBackButton />

      <VStack mt={8} mx={5} alignItems='center'>
        <Heading
          fontFamily='heading'
          color='white'
          fontSize='xl'
          mb={8}
          textAlign='center'
        >
          Encontre um bolão através de {'\n'}
          seu código único
        </Heading>
        <Input mb={2} placeholder='Qual o código do bolão?' />
        <Button title='BUSCAR BOLÃO' />
      </VStack>
    </VStack>
  );
}
