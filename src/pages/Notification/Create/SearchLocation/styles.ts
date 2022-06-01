import { FlatList } from 'react-native';
import styled, { css } from 'styled-components/native';

export const Container = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const Info = styled.View`
  margin-top: 8px;
  padding: 0 16px;
  color: #333;
`;

export const InfoText = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 14px;
  text-align: center;
  line-height: 25px;
`;

export const LinkText = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 14px;
  color: #2e8c24;
`;

export const Header = styled.View`
  padding: 0 24px;
`;

export const AddressesList = styled(FlatList as new () => FlatList<string>)`
  margin-top: 24px;
`;

interface AddressProps {
  isFirst: boolean;
}

export const AddressItem = styled.TouchableOpacity<AddressProps>`
  border-bottom-color: #eee;
  border-bottom-width: 1px;

  height: 50px;
  padding: 0 24px;
  justify-content: center;

  ${props =>
    props.isFirst &&
    css`
      border-top-color: #eee;
      border-top-width: 1px;
    `}
`;

export const AddressValue = styled.Text<AddressProps>`
  font-family: ${props => (props.isFirst ? 'Roboto-Medium' : 'Roboto-Regular')};
  font-size: 14px;
  color: #333;
`;
