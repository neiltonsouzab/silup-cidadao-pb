import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/core';

import { useGeo } from '../../../../hooks/geo';
import InputText from '../../../../components/InputText';
import Button from '../../../../components/Button';

import {
  Container,
  Header,
  AddressesList,
  AddressItem,
  AddressValue,
  Info,
  InfoText,
} from './styles';

const SearchLocation: React.FC = () => {
  const navigation = useNavigation();
  const { searchAddress, getCoordsByAddress } = useGeo();

  const [foundAddress, setFoundAddress] = useState<string[]>([]);
  const [filterAddress, setFilterAddress] = useState('');

  useEffect(() => {
    searchAddress(filterAddress).then(addresses => {
      setFoundAddress(addresses);
    });
  }, [filterAddress, searchAddress]);

  const handleAddressSelected = useCallback(
    async (selectedAddress: string) => {
      const coords = await getCoordsByAddress(selectedAddress);

      navigation.dispatch(
        StackActions.replace('NotificationCreateSelectLocation', {
          address: selectedAddress,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }),
      );
    },
    [navigation, getCoordsByAddress],
  );

  const handleNavigateToChangeLocation = useCallback(() => {
    navigation.navigate('NotificationCreateChangeLocation');
  }, [navigation]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Info>
          <InfoText>
            Digite o seu endereço no campo abaixo e faça uma pesquisa automática
            ou
          </InfoText>
          <Button
            label="Toque para informar manualmente"
            onPress={handleNavigateToChangeLocation}
          />
        </Info>

        <Header>
          <InputText
            placeholder="Pesquise a endereço automáticamente"
            icon="map-pin"
            value={filterAddress}
            onChangeText={text => setFilterAddress(text)}
          />
        </Header>

        <AddressesList
          data={foundAddress}
          keyExtractor={item => item}
          renderItem={({ item, index }) => (
            <AddressItem
              isFirst={index === 0}
              onPress={() => handleAddressSelected(item)}>
              <AddressValue isFirst={index === 0}>{item}</AddressValue>
            </AddressItem>
          )}
        />
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default SearchLocation;
