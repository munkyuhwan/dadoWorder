import React, { useState } from 'react'
import styled, {css} from 'styled-components/native';
import { RADIUS, RADIUS_DOUBLE } from '../values';
import { colorBlack, colorGrey, colorListItemTitle, colorRed, colorWhite, listItemTitle } from '../../assets/colors/color';

export const MenuListWrapper = styled.View`
    width:100%;
    height:90%;
    paddingTop:10px;
    paddingLeft:${props=>props?.viewType==4?"102px":"42px"};
    paddingRight:${props=>props?.viewType==4?"102px":"42px"};
    paddingBottom:${props=>props?.viewType==3?"110px":"50px"};
    backgroundColor:#252525;
    justifyContent:center;
`;


// menu item style
export const MenuImageDefaultWrapper = styled.View`
    width:100%;
    height:203px;
    borderRadius:${RADIUS};
    backgroundColor:${colorWhite};
`
export const MenuImageDefault = styled.Image`
    margin:auto;
    width:360px;
    height:250px;
    resizeMode:contain;
`
export const MenuItemTopWrapper = styled.View`
    flex:1;
`
export const MenuItemWrapper = styled.View`
    width:${props=> props?.viewType==3?"375px":(props?.viewType==2?"578px":"518")};    
    ${props=>{
        if(props?.viewType == 2) {
            return "height:540px;marginBottom:60px;";
        }else if(props?.viewType == 3) {
            return "height:250px;marginBottom:0px;";
        }else {
            return "height:280px;";
        }
    }}
`

export const MenuItemImageWrapper = styled.View`
    width:100%;
    height:100%;    
    position:absolute;
    paddingTop:7px;
    paddingBottom:15px;
    paddingLeft:12px;
    paddingRight:12px;
`
export const MenuItemImage = styled.Image`
    width:100%;
    height:183px;
    resizeMode:background;
    borderRadius:${RADIUS}
`
export const MenuItemButtonWrapper = styled.View`
    flexDirection:row;
    flex:1;
    position:absolute;
    paddingLeft:10px;
`
export const MenuItemButtonInnerWrapperRight = styled.View`
    width:100%;
    flex:0.35;
    flexDirection: row;
    justifyContent: flex-start;
    paddingTop:5px;
 `
export const MenuItemDetailSpicenessWrapper = styled.View`
    width:100%;
    flex:2;
    flexDirection: row;
    justifyContent: flex-start;
`
export const MenuItemButtonInnerWrapperLeft = styled.View`
    width:20%;
    flexDirection: row;
    justifyContent:flex-end;
    position:absolute;
    right:0px;
    bottom:0px;
`
export const MenuItemButton = styled.Image`
    width:56px;
    height:56px;
    resizeMode:contain;
`
export const MenuItemSpiciness = styled.Image`
    width:46px;
    height:46px;
    resizeMode:contain;
`
export const MenuItemHotnessWrapper = styled.View`
    flexDirection:row;
    flex:1;
`
export const MenuItemHotness = styled.Image`
    marginRight:6px;
    width:52px;
    resizeMode:contain;
    backgroundColor:#00000000;
`
export const MenuItemBottomWRapper = styled.View`
    width:100%; 
    height:70px;
    flex:1;
    flexDirection:row;  
    paddingTop:2px;
    alignItems:center;
    position:absolute;
    bottom:0;
    justifyContent:center;
    backgroundColor:${colorListItemTitle};
    borderBottomLeftRadius:20px;
    borderBottomRightRadius:20px;
`
export const BigMenuItemBottomWrapper = styled.View`
    width:100%; 
    height:160px;
    flex:1;
    flexDirection:column;  
    paddingTop:12px;
    alignItems:center;
    position:absolute;
    bottom:0;
    justifyContent:center;
    backgroundColor:${colorWhite};
    borderBottomLeftRadius:${RADIUS_DOUBLE};
    borderBottomRightRadius:${RADIUS_DOUBLE};
`
export const BigMenuItemName = styled.Text`
    fontSize:32px;
    color:${colorBlack};
    fontWeight:900;
    height:100px;
    textAlignVertical:center;
    flex:1;
`
export const MenuItemName = styled.Text`
    fontSize:26px;
    color:${colorBlack};
    fontWeight:900;
    height:70px;
    textAlignVertical:center;
    flex:1.9;
    marginLeft:20px;
`
export const BigMenuItemPrice = styled.Text`
    fontSize:30px;
    color:${colorRed};
    justifyContents:center;
    lineHeight:30px;
    flex:1;
    textAlign:right;
 
    fontWeight:bold;
`
export const MenuItemPrice = styled.Text`
    fontSize:26px;
    color:${colorRed};
    justifyContents:center;
    lineHeight:30px;
    flex:1;
    textAlign:right;
    margin:20px;
`
export const SoldOutLayer = styled.View`
    with:300px;
    height:183px;
    position:absolute;
    z-index:99999;
    flex:1;
`
export const SoldOutLayerBig = styled.View`
    width:100%;
    height:420px;
    position:absolute;
    z-index:99999;
    flex:1;
`
export const SoldOutDimLayer = styled.View`
    background:${colorBlack};
    opacity:0.5;
    width:300px;
    height:183px;
`
export const SoldOutDimLayerBig = styled.View`
    background:${colorBlack};
    opacity:0.5;
    width:100%;
    height:420px;
`
export const SoldOutDimLayerAbs = styled.View`
    background:${colorBlack};
    opacity:0.2;
    width:300px;
    height:183px;
    position:absolute;
    zIndex:2;
`
export const SoldOutText = styled.Text`
    position:absolute;
    zIndex:9999999;
    margin:auto;
    color:${colorWhite};
    fontWeight:bold;
    fontSize:45px;
    backgroundColor:#00000000;
    textAlignVertical:center;
    textAlign:center;
    width:100%;
    height:100%;
`
