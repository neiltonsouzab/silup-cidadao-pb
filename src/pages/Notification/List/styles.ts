import { StatusBar, FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

import { Problem } from './index';

const StatusProblemColor = {
  1: '#DD4A48',
  2: '#2e8c24',
  3: '#21325E',
  4: '#DD4A48',
  5: '#DD4A48',
  6: '#DD4A48',
  7: '#DD4A48',
  8: '#FC9918',
  9: '#FC9918',
  10: '#FC9918',
};

export const Content = styled.View`
  flex: 1;

  margin-top: ${Math.floor(StatusBar.currentHeight || 0) + 24}px;
  padding: 0 32px;
`;

export const Header = styled.View``;

export const HeaderTitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 18px;
  max-width: 180px;

  color: #333333;
`;

export const HeaderLogoutButton = styled.TouchableOpacity``;

export const HeaderLogoutButtonText = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 16px;
  color: #2e8c24;
`;

export const HeaderSubTitle = styled.Text`
  margin-top: 10px;

  font-family: 'Roboto-Regular';
  font-size: 16px;

  color: #c4c4c4;
`;

export const ProblemList = styled(FlatList as new () => FlatList<Problem>)`
  margin-top: 16px;

  background: #fff;
`;

export const ProblemItem = styled(RectButton).attrs({
  // shadowColor: '#000',
  // shadowOffset: {
  //   width: 0,
  //   height: 2,
  // },
  // shadowOpacity: 0.23,
  // shadowRadius: 2.62,

  elevation: 1,
})`
  position: relative;

  margin: 8px 32px;
  padding: 16px;
  align-items: center;

  background: #fff;

  border-radius: 8px;
`;

export const ProblemItemTypeImage = styled.Image``;

export const ProblemItemTypeName = styled.Text`
  margin-top: 4px;

  font-family: 'Roboto-Medium';
  font-size: 12px;

  color: #888888;
`;

export const ProblemNumber = styled.Text`
  position: absolute;
  right: 0;
  width: 80px;
  padding: 4px 0;

  font-family: 'Roboto-Medium';
  font-size: 14px;
  text-align: center;
  color: #fff;
  background: #2e8c24;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 8px;
`;

interface ProblemStatusProps {
  status: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

export const ProblemItemStatus = styled.Text<ProblemStatusProps>`
  margin-top: 8px;
  padding: 4px 16px;

  font-family: 'Roboto-Regular';
  font-size: 10px;

  background: ${props => StatusProblemColor[props.status]};
  color: #fff;
  border-radius: 8px;
`;

export const ProblemItemAddress = styled.Text.attrs({
  numberOfLines: 2,
})`
  margin-top: 8px;

  font-family: 'Roboto-Medium';
  font-size: 14px;
  text-align: center;

  color: #888888;
`;

export const ProblemItemDate = styled.Text`
  margin-top: 8px;

  font-family: 'Roboto-Medium';
  font-size: 12px;
  text-align: center;

  color: #2e8c24;
`;

export const ProblemItemObs = styled.Text`
  margin-top: 8px;

  font-family: 'Roboto-Medium';
  font-size: 12px;
  text-align: center;

  color: #333333;
`;

export const Indicator = styled.View`
  position: absolute;
  bottom: 0;

  height: 2px;
  width: 50%;
  align-self: center;
  background: #2e8c24;
`;
