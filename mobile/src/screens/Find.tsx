import { useNavigation } from '@react-navigation/native';
import { Heading, useToast, VStack } from 'native-base';
import { useState } from 'react';
import { Button } from '../Components/Button';
import { Header } from '../Components/Header';
import { Input } from '../Components/Input';
import { api } from '../services/api';

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const toast = useToast();
  const { navigate } = useNavigation();

  async function handleJoinPool() {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        return toast.show({
          title: 'Informe o código',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      await api.post('/pools/join', { code });

      toast.show({
        title: 'Você entrou no bolão com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      });

      navigate('pools');
    } catch (error) {
      console.log(error);

      if (error.response?.data?.message === 'Pool not Found.') {
        return toast.show({
          title: 'Bolão não encontrado!',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      if (error.response?.data?.message === 'You already joined this pool.') {
        return toast.show({
          title: 'Você ja está nessse bolão!',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      toast.show({
        title: 'Não foi possivel encontrar o bolão',
        placement: 'top',
        bgColor: 'red.500',
      });

      setIsLoading(false);
    }
  }
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
        <Input
          onChangeText={setCode}
          mb={2}
          placeholder='Qual o código do bolão?'
          autoCapitalize='characters'
        />
        <Button
          title='BUSCAR BOLÃO'
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}
