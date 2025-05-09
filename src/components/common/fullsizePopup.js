import React, { useEffect, useState } from 'react'
import {View, NativeModules, Animated, TouchableWithoutFeedback, StyleSheet} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { PopupCloseButton, PopupCloseButtonWrapper, PopupContentWrapper, FullsizePopupWrapper } from '../../styles/common/popup';
import { setPopupVisibility } from '../../store/popup';
import LanguageSelectPopup from '../popups/languageSelectPopup';
import TogoPopup from '../popups/togoTimePopup';
import { PopupBottomButtonBlack, PopupBottomButtonText, PopupBottomButtonWrapper } from '../../styles/common/coreStyle';
import { LANGUAGE } from '../../resources/strings';
import { openFullSizePopup, openTransperentPopup } from '../../utils/common';
import { TransparentPopupWrapper } from '../../styles/common/popup';
import CallServerPopup from '../popups/callServerPopup';
import OrderListPopup from '../popups/orderListPopup';
import SettingPopup from '../popups/settingPopup';
import OrderPayPopup from '../popups/orderPayPopup';
import OrderReadyPopup from './orderReadyPopup';

const FullSizePopup = (props) =>{
    
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);
    const {isFullPopupVisible, innerFullView} = useSelector(state=>state.popup);
    const [popupZIndex, setPopupZIndex] = useState(0);
    const [size, setSize] = useState("0") 
    

    // animation set
    const [widthAnimation, setWidthAnimation] = useState(new Animated.Value(0));
    // width interpolation
    const animatedWidthScale = widthAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0,1.3,1],
    });
    const animatedWidthTranslate = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,0],
    });
    
    // height interpolation 
    const animatedHeightScale = widthAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0,1.3,1],
    });
    const animatedHeightTranslate = widthAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0,0],
    })

    const boxWidthStyle = {
        transform: [
            {scaleX:animatedWidthScale},
            {translateX:animatedWidthTranslate},
            {scaleY:animatedHeightScale}, 
            {translateY:animatedHeightTranslate}], 
        
   };
    const onSelectHandleAnimation = async (popOpen) => {
        Animated.timing(widthAnimation, {
            toValue:popOpen,
            duration: 300,
            useNativeDriver:true,
        }).start(()=>{
            if(popOpen==0) {
                setPopupZIndex(0)
                setSize('0');
            }
        }) 
    }
    useEffect(()=>{
        if(isFullPopupVisible) {
            setPopupZIndex(999999);
            setSize('100%');
            onSelectHandleAnimation(2);
        }else {
            onSelectHandleAnimation(0);
        }
    },[isFullPopupVisible])
    

    return(
        <>
            <Animated.View  style={[{...PopStyle.animatedPop,...boxWidthStyle,...{zIndex:popupZIndex, width:size, height:size}} ]} >   
                <TouchableWithoutFeedback onPress={()=>{if(innerFullView!="OrderPay"){ openFullSizePopup(dispatch, {innerView:"", isFullPopupVisible:false});} }}>
                <FullsizePopupWrapper/>
                </TouchableWithoutFeedback>
                    {innerFullView=="CallServer"&&
                        <CallServerPopup/>
                    }
                    {(innerFullView=="Setting") &&
                        <SettingPopup/>
                    }
                    {(innerFullView=="OrderPay") &&
                        <OrderPayPopup/>
                    }
                    
            </Animated.View>
        </>
    )
}
const PopStyle = StyleSheet.create({
    animatedPop:{
        position:'absolute',
        zIndex:99
    }

})
export default FullSizePopup;