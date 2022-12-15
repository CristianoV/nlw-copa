import { HStack, useToast, VStack } from 'native-base';
import { Share } from 'react-native';
import { Header } from '../Components/Header';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Loading } from '../Components/Loading';
import { api } from '../services/api';
import { PoolPros } from '../Components/PoolCard';
import { PoolHeader } from '../Components/PoolHeader';
import { EmptyMyPoolList } from '../Components/EmptyMyPoolList';
import { EmptyRakingList } from '../Components/EmptyRakingList';
import { Option } from '../Components/Option';
import { Guesses } from '../Components/Guesses';

interface RouteParams {
  id: string;
}

export function Details() {
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>(
    'guesses'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [poolDetails, setPoolDetails] = useState<PoolPros>({} as PoolPros);
  const toast = useToast();
  const route = useRoute();
  const { id } = route.params as RouteParams;

  async function fetchPoolDetail() {
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${id}`);
      setPoolDetails(response.data.pools);
    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Não foi possivel carregar os detalhes do bolões',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    Share.share({
      message: poolDetails.code,
    });
  }

  useEffect(() => {
    fetchPoolDetail();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor='gray.900'>
      <Header
        title={poolDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {poolDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />
          <HStack bgColor='gray.800' p={1} py={4} rounded='sm' mb={5}>
            <Option
              title='Seus palpites'
              onPress={() => setOptionSelected('guesses')}
              isSelected={optionSelected === 'guesses'}
            />
            <Option
              title='Ranking do grupo'
              onPress={() => setOptionSelected('ranking')}
              isSelected={optionSelected === 'ranking'}
            />
          </HStack>
          {optionSelected === 'guesses' ? (
            <Guesses poolId={poolDetails.id} code={poolDetails.code} />
          ) : (
            <EmptyRakingList />
          )}
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  );
}
