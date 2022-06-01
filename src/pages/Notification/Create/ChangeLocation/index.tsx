import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import Button from '../../../../components/Button';

import InputText from '../../../../components/InputText';
import { Container, Content } from './styles';

const ChangeLocation: React.FC = () => {
  const navigation = useNavigation();

  const [place, setPlace] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');

  const handleConfirmAddress = useCallback(() => {
    if (place.trim() === '' || district.trim() === '' || city.trim() === '') {
      Alert.alert('Atenção', 'Informe todos os campos obrigatórios.');
      return;
    }

    const address = `${place} - ${district}, ${city}-RO, Brasil`;

    navigation.navigate('NotificationCreateSelectTypeAndImage', {
      address,
      district,
      city,
      latitude: -8.7673193,
      longitude: -63.8952134,
    });
  }, [navigation, place, district, city]);

  return (
    <Container>
      <Content>
        <InputText
          placeholder="Logradouro *"
          value={place}
          onChangeText={text => setPlace(text)}
        />

        <InputText
          placeholder="Bairro *"
          value={district}
          onChangeText={text => setDistrict(text)}
        />

        <InputText
          placeholder="Cidade/Distrito *"
          value={city}
          onChangeText={text => setCity(text)}
        />

        <Button label="CONFIRMAR" onPress={handleConfirmAddress} />
      </Content>
    </Container>
  );
};

export default ChangeLocation;
