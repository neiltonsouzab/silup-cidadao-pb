import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';

import InputText from '../../../../components/InputText';
import Button from '../../../../components/Button';
import { Address, useGeo } from '../../../../hooks/geo';
import { useAuth } from '../../../../hooks/auth';
import api from '../../../../services/api';
import { uploadFile } from '../../../../services/firebase-storage';

import { Content } from './styles';

interface RouteParams {
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  city: string;
  imageName: string;
  problemTypeId: number;
}

const InformObservation: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { getAddressByCoords } = useGeo();
  const { user } = useAuth();

  const {
    latitude,
    longitude,
    address,
    district,
    city,
    imageName,
    problemTypeId,
  } = route.params as RouteParams;

  const [fullAddress, setFullAddress] = useState<Address>();
  const [obs, setObs] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAddress = async () => {
      try {
        if (!district && !city) {
          const googleAddress = await getAddressByCoords(latitude, longitude);
          setFullAddress(googleAddress);
        }
      } catch (error) {
        if (Platform.OS === 'android') {
          ToastAndroid.showWithGravity(
            'Não conseguimos carregar sua localização atual. Certifique-se que esteja conectado a internet.',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        } else {
          Alert.alert(
            'Algo de errado aconteceu',
            'Não conseguimos carregar sua localização atual. Certifique-se que esteja conectado a internet.',
          );
        }
      }
    };

    loadAddress();
  }, [district, city, latitude, longitude, getAddressByCoords]);

  const handleSubmit = useCallback(async () => {
    try {
      if (!fullAddress && !address) {
        Alert.alert(
          'Atenção',
          'Não é possível cadastrar seu problema, pois não conseguimos carregar sua localização atual. Tente novamente.',
        );
        return;
      }

      if (!problemTypeId) {
        Alert.alert('Atenção', 'Para continuar, informe o tipo do problema.');
        return;
      }

      setLoading(true);

      let imageUrl =
        'https://firebasestorage.googleapis.com/v0/b/websilup.appspot.com/o/Ponto%2Fphoto10.jpg?alt=media&token=e74e3e5a-ee2b-4d5e-9ea8-db0cd325c56d';
      if (imageName) {
        imageUrl = await uploadFile(imageName);
      }

      await api.post('/cidadao/criar_notificacao_cidadao', null, {
        params: {
          cpf_cnpj: user?.cpfCnpj,
          bairro: fullAddress ? fullAddress.district : district,
          cidade: fullAddress ? fullAddress.city : city,
          uf: fullAddress ? fullAddress.state : 'RO',
          endereco: fullAddress ? fullAddress.full_address : address,
          latitude,
          longitude,
          observacao: obs,
          url_imagem: imageUrl,
          fk_tipo_ocorrencia: problemTypeId,
        },
      });

      navigation.reset({
        routes: [{ name: 'NotificationCreateCreated' }],
        index: 0,
      });
    } catch {
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(
          'Não foi possível salvar o problema informado. Tente novamente.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      } else {
        Alert.alert(
          'Algo de errado aconteceu',
          'Não foi possível salvar o problema informado. Tente novamente.',
        );
      }
    } finally {
      setLoading(false);
    }
  }, [
    fullAddress,
    address,
    city,
    district,
    latitude,
    longitude,
    obs,
    problemTypeId,
    imageName,
    user?.cpfCnpj,
    navigation,
  ]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Content>
            <InputText
              multiline
              placeholder="Alguma observação?"
              onChangeText={text => setObs(text)}
            />

            <Button
              label="FINALIZAR"
              loading={loading}
              onPress={handleSubmit}
            />
          </Content>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InformObservation;
