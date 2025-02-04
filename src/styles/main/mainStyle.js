import React, { useState } from 'react'
import styled, {css} from 'styled-components/native';
import { RADIUS } from '../values';
import { colorWhite, mainTheme } from '../../assets/colors/color';
import FastImage from 'react-native-fast-image';

// 전체화면
export const WholeWrapper = styled.View`
    width:100%;
    height:100%;
    flexDirection:row;
    backgroundColor:${mainTheme};
`

// 메뉴화면
export const MainWrapper = styled.View`
    width:100%;
    height:100%;
    backgroundColor:${mainTheme};
    display:flex;
    flex:1;
`

// 카테고리 화면
export const MenuSelectView = styled.View`
    flex:1;
    flexDirection:column;
`
export const MenuSelectBg = styled(FastImage)`
    width:100%;
    height:100%;
    position:absolute;
`
export const MenuSelectCategoryView = styled.View`
    backgroundColor:transparent;
    width:100%;
    flexDirection:row;
    gap:40px;
    justifyContent:center;
    alignItems:center;
    flex:1;
`
export const MenuSelectCategory = styled.View`
    width:280px;
    height:240px;
    backgroundColor:${colorWhite};
    borderRadius:20px;
    justifyContent:center;
    alignItems:center;
`
export const MenuSelectCategoryIcon = styled(FastImage)`
    width:100px;
    height:100px;
`
export const MenuSelectCategoryText = styled.Text`
    fontSize:50px;
    fontWeight:bold;
    marginTop:13px;
`
export const MenuSelectCategorySubText = styled.Text`
    fontSize:20px;
`