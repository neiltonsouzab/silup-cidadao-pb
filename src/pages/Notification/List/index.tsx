import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  ImageSourcePropType,
  Alert,
  ToastAndroid,
  Platform,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/core';

import { useAuth } from '../../../hooks/auth';
import api from '../../../services/api';
import Loading from '../../../components/Loading';
import ButtonFloat from '../../../components/ButtonFloat';

import lampBrokenUnselected from '../../../assets/images/lamp-broken-unselected.png';
import lampErrorUnselected from '../../../assets/images/lamp-error-unselected.png';
import lampMorningUnselected from '../../../assets/images/lamp-morning-unselected.png';
import lampNewUnselected from '../../../assets/images/lamp-new-unselected.png';
import lampNightUnselected from '../../../assets/images/lamp-night-unselected.png';
import lampOscillationUnselected from '../../../assets/images/lamp-oscillation-unselected.png';
import lampOthersUnselected from '../../../assets/images/lamp-others-unselected.png';
import lampUnspecifiedUnselected from '../../../assets/images/lamp-unspecified-unselected.png';

import {
  Content,
  Header,
  HeaderTitle,
  HeaderSubTitle,
  ProblemList,
  ProblemItem,
  ProblemNumber,
  ProblemItemTypeImage,
  ProblemItemTypeName,
  ProblemItemStatus,
  ProblemItemAddress,
  ProblemItemDate,
  Indicator,
  HeaderLogoutButton,
  HeaderLogoutButtonText,
  HeaderTitleContainer,
  ProblemItemObs,
} from './styles';

interface ProblemResponse {
  status: boolean;
  mensagem: string;
  data: {
    id: number;
    endereco: string;
    nometipoocorrencia: string;
    nomesituacaoocorrencia: string;
    codigo_situacao: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    created_at: string;
    data_previsao: string;
    data_criacao: string;
    observacao_os: string;
  }[];
}

export interface Problem {
  id: number;
  address: string;
  type: string;
  status: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  status_description: string;
  icon: ImageSourcePropType;
  created_at: string;
  forecast_date: string;
  obs: string;
}

interface IconProps {
  [key: string]: ImageSourcePropType;
}

const icons: IconProps = {
  Implantação: lampNewUnselected,
  'Lâmpada acesa durante o dia': lampMorningUnselected,
  'Lâmpada apagada': lampNightUnselected,
  'Lâmpada Oscilando': lampOscillationUnselected,
  'Medições com erro': lampErrorUnselected,
  'Problema não especificado': lampUnspecifiedUnselected,
  Vandalismo: lampBrokenUnselected,
  Outros: lampOthersUnselected,
};

const List: React.FC = () => {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();

  const [problems, setProblems] = useState<Problem[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadProblems = async (): Promise<void> => {
        try {
          const { data: problemResponse } = await api.get<ProblemResponse>(
            '/cidadao/consulta_notificacao_cidadao',
          );

          const problemsResponseData = problemResponse.data;
          const problemList = problemsResponseData.map((item): Problem => {
            return {
              id: item.id,
              address: item.endereco,
              type: item.nometipoocorrencia,
              status: item.codigo_situacao,
              status_description: item.nomesituacaoocorrencia,
              icon: icons[item.nometipoocorrencia] || lampOthersUnselected,
              created_at: item.data_criacao,
              forecast_date: item.data_previsao,
              obs: item.observacao_os,
            };
          });

          setProblems(problemList);
        } catch (error) {
          if (Platform.OS === 'android') {
            ToastAndroid.showWithGravity(
              'Não foi possível carregar seus problemas cadastrados.',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          } else {
            Alert.alert(
              'Algo de errado aconteceu',
              'Não foi possível carregar seus problemas cadastrados.',
            );
          }
        }
      };

      loadProblems();
    }, []),
  );

  const handleNavigateToNotificationNew = useCallback(() => {
    navigation.navigate('NotificationCreateSelectLocation');
  }, [navigation]);

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, [signOut]);

  if (!problems) {
    return <Loading message="Carregando os problemas cadastrados..." />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#2E8C24"
      />
      <Content>
        <Header>
          <HeaderTitleContainer>
            <HeaderTitle>Olá {user?.name}</HeaderTitle>
            <HeaderLogoutButton>
              <HeaderLogoutButtonText onPress={handleSignOut}>
                Deslogar/Sair
              </HeaderLogoutButtonText>
            </HeaderLogoutButton>
          </HeaderTitleContainer>

          <HeaderSubTitle>
            {problems.length > 0
              ? 'Esses são os problemas que você nos informou.'
              : 'Parece que você ainda não informou nenhum problema. Que tal começar agora?'}
          </HeaderSubTitle>
        </Header>

        <ProblemList
          data={problems}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item: problem }) => (
            <ProblemItem>
              <ProblemNumber>000{problem.id}</ProblemNumber>
              <ProblemItemTypeImage source={problem.icon} />
              <ProblemItemTypeName>{problem.type}</ProblemItemTypeName>
              <ProblemItemStatus status={problem.status}>
                {problem.status_description}
              </ProblemItemStatus>
              <ProblemItemAddress>{problem.address}</ProblemItemAddress>
              <ProblemItemDate>
                DATA ABERTURA: {problem.created_at}
              </ProblemItemDate>
              <ProblemItemDate>
                PREVISÃO ATENDIMENTO: 20 dias úteis
              </ProblemItemDate>
              <ProblemItemObs>
                {problem.obs && `Observação: ${problem.obs}`}
              </ProblemItemObs>
              <Indicator />
            </ProblemItem>
          )}
        />
        <ButtonFloat icon="plus" onPress={handleNavigateToNotificationNew} />
      </Content>
    </SafeAreaView>
  );
};

export default List;
