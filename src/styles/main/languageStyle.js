import FastImage from 'react-native-fast-image';
import styled, {css} from 'styled-components/native';
import { colorBlack } from '../../assets/colors/color';

export const NewLanguageSelectWrapper = styled.View`
    poaition:absolute;
    zIndex:99999;
    width:100%;
    height:100%;
    flexDirection:row;
    justifyContent:center;
    alignItems:center;
    gap:50px;
`
export const NewLanguageWrapper = styled.View`
    flexDirection:column;
    height:330px;
    width:200px;
    justifyContent:center;
    alignItems:center;
    borderRadius:20px;
`
export const LanguageInnerWrapper = styled.View`
    alignItem:center;
    justifyContent:center;
`
export const NewLanguageDimWrapper = styled.View`
    backgroundColor:rgba(255,255,255,0.7);
    flex:1;
    position:absolute;
    width:100%;
    height:100%;
    borderRadius:20px;
`
export const LanguageSelectIcon = styled(FastImage)`
    width:130px;
    height:130px;
`
export const LanguageSelectTitle = styled.Text`
    color:${colorBlack};
    fontWeight:bold;
    fontSize:30px;
`