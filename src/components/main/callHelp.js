import React, { useState, useEffect } from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { colorDarkGrey, colorGrey, colorRed, colorWhite } from '../../assets/colors/color';
import { TransparentPopupBottomButtonIcon, TransparentPopupBottomButtonText, TransparentPopupBottomButtonWraper, TransparentPopupBottomInnerWrapper, TransparentPopupBottomWrapper, TransparentPopupTopWrapper, TransparentPopupWrapper, TransperentPopupMidWrapper, TransperentPopupTopSubTitle, TransperentPopupTopTitle } from '../../styles/common/popup';
import { LANGUAGE } from '../../resources/strings';
import SelectItemComponent from '../common/selectItemComponent';
import { getCallServerItems, getServiceList, postAdminSerivceList, postService, sendToPos } from '../../store/callServer';
import { getStoreID, openFullSizePopup, openPopup, openTransperentPopup } from '../../utils/common';
import { getAdminServices } from '../../utils/apis';
import { posErrorHandler } from '../../utils/errorHandler/ErrorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setSelectedMainCategory, setSelectedSubCategory } from '../../store/categories';
import { setSelectedItems } from '../../store/menu';
import { metaPostPayFormat } from '../../utils/payment/metaPosDataFormat';
import { adminDataPost, postOrderToPos } from '../../store/order';
import { setCommon } from '../../store/common';
//import { STORE_ID } from '../../resources/apiResources';

const CallHelp = () => {
    const dispatch = useDispatch();
    const {language} = useSelector(state=>state.languages);

    const {callServerItems} = useSelector(state=>state.callServer);
    const {isFullPopupVisible, innerFullView} = useSelector(state=>state.popup);
    const {tableInfo} = useSelector(state=>state.tableInfo);
    const [selectedService, setSelectedService] = useState([]);
    const {displayMenu, allItems} = useSelector((state)=>state.menu);

    // 세팅 터치
    const [settingTouch, setSettingTouch] = useState(0);
    const [isStartCounting, setIsStartCounting] = useState(true);



    useEffect(()=>{
        dispatch(setSelectedMainCategory("help"));
    },[])

    const onServiceSelected = (indexArray) =>{
        setSelectedService(indexArray);
    }
    const callServer = async () =>{
        // dispatch(sendServiceToPos(selectedService));
        // 직원 호출하기
        // prod_cd: ,qty: ,set_item: 
        var postData = [];
        for (const el of selectedService) {
            const data = {prod_cd:el ,qty:1 ,set_item:[]};
            postData.push(data);
        }
        console.log("postData:",postData)
        const orderData = await metaPostPayFormat(postData,{}, allItems);
        dispatch(adminDataPost({payData:null,orderData:orderData, isMultiPay:false}));
        dispatch(postOrderToPos({isHelp:true, isQuick:false, payData:null,orderData:orderData, isMultiPay:false}));
        setSelectedService();     
        setTimeout(()=>{
            dispatch(setSelectedMainCategory("")); 
            dispatch(setCommon({"tab":"menu"})); 
        },1000)
       
    } 

    return(
        <TransparentPopupWrapper>
            <TransparentPopupTopWrapper>
                    <View style={{padding:0, alignItems:'center'}} >
                        <TransperentPopupTopSubTitle>{LANGUAGE[language]?.serverPopup.text}</TransperentPopupTopSubTitle>
                    </View>
                </TransparentPopupTopWrapper>     
            <TransperentPopupMidWrapper>
                
                <SelectItemComponent 
                    data={displayMenu}
                    selectedService={selectedService}
                    onServiceSelected={onServiceSelected}
                />
                
            </TransperentPopupMidWrapper>   
            <TransparentPopupBottomWrapper>
                <TransparentPopupBottomInnerWrapper>
                    <TouchableWithoutFeedback onPress={callServer}>
                        <TransparentPopupBottomButtonWraper bgColor={colorRed} >
                            <TransparentPopupBottomButtonIcon source={require("../../assets/icons/bell_trans.png")} />
                            <TransparentPopupBottomButtonText>{"   "+LANGUAGE[language]?.serverPopup.callBtnText}</TransparentPopupBottomButtonText>
                        </TransparentPopupBottomButtonWraper>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{openFullSizePopup(dispatch, {innerView:"", isFullPopupVisible:false});}}>
                        <TransparentPopupBottomButtonWraper bgColor={colorDarkGrey} >
                            <TransparentPopupBottomButtonIcon source={require("../../assets/icons/cancel.png")} />
                            <TransparentPopupBottomButtonText>{"   "+LANGUAGE[language]?.detailView.toMenu}</TransparentPopupBottomButtonText>
                        </TransparentPopupBottomButtonWraper>
                    </TouchableWithoutFeedback>
                </TransparentPopupBottomInnerWrapper>
            </TransparentPopupBottomWrapper>   
        </TransparentPopupWrapper>
    )
}
export default CallHelp;