import { useCallback, useState } from 'react';
import { Icon, useToast, VStack, FlatList } from 'native-base';
import { Button } from '../Components/Button';
import { Header } from '../Components/Header';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';
import { PoolCard, PoolPros } from '../Components/PoolCard';
import { Loading } from '../Components/Loading';
import { EmptyPoolList } from '../Components/EmptyPoolList';
import { useFocusEffect } from '@react-navigation/native';

export function Pools() {
  const [isLoading, setIsLoading] = useState(true);
  const [pools, setPools] = useState<PoolPros[]>([]);
  const { navigate } = useNavigation();
  const toast = useToast();

  async function fetchPools() {
    try {
      setIsLoading(true);
      const response = await api.get('/pools');
      setPools(response.data.pools);
    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Não foi possivel carregar os bolões',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPools();
    }, [navigate])
  );

  return (
    <VStack flex={1} bg='gray.900'>
      <Header title='Meus bolões' />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor='gray.600'
        pb={4}
        mb={4}
      >
        <Button
          title='BUSCAR BOLÃO POR CÓDIGO'
          onPress={() => navigate('find')}
          leftIcon={
            <Icon as={Octicons} name='search' color='black' size='md' />
          }
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate('details', { id: item.id })}
            />
          )}
          ListEmptyComponent={() => <EmptyPoolList />}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          px={5}
        />
      )}
    </VStack>
  );
}
