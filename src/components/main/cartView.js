import React, { useCallback, useEffect, useRef, useState } from 'react'
import { 
    Alert,
    Animated,
    Dimensions,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { ArrowImage, CartFlatList, CartScrollView, CartViewWrapper, Handle, OrderWrapper, PayAmtNumber, PayAmtTitle, PayAmtUnit, PayAmtWrapper, PayBtn, PayBtnWrapper, PayFullBtn, PayIcon, PayTitle, PayWrapper, TopTableText, TopTableView, TopTitleText, TopTitleView, TopTitleWrapper } from '../../styles/main/cartStyle';
import CartListItem from '../cartComponents/cartListItem';
import { LANGUAGE } from '../../resources/strings';
import { setCartView, setIconClick } from '../../store/cart';
import { IconWrapper } from '../../styles/main/topMenuStyle';
import TopButton from '../menuComponents/topButton';
import {  getDeviceInfo, getStoreID, isNetworkAvailable, itemEnableCheck, numberWithCommas, openFullSizePopup, openTransperentPopup } from '../../utils/common';
import { adminDataPost, initOrderList, postLog, postOrderToPos, presetOrderData, setDutchOrderList, setOrderProcess } from '../../store/order';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isEmpty} from 'lodash';
import LogWriter from '../../utils/logWriter';
import { KocesAppPay } from '../../utils/payment/kocesPay';
import { displayErrorNonClosePopup, displayErrorPopup } from '../../utils/errorHandler/metaErrorHandler';
import { setMonthPopup, setSelectedMonth } from '../../store/monthPopup';
import { EventRegister } from 'react-native-event-listeners';
import { getMenuUpdateState, getPosStoreInfo, getTableAvailability } from '../../utils/api/metaApis';
import { getAdminItems, initMenu, menuUpdateCheck, regularUpdate } from '../../store/menu';
import { META_SET_MENU_SEPARATE_CODE_LIST, PAY_SEPRATE_AMT_LIMIT } from '../../resources/defaults';
import moment from 'moment';
import { metaPosDataFormat, metaPostPayFormat } from '../../utils/payment/metaPosDataFormat';
import { callApiWithExceptionHandling } from '../../utils/api/apiRequest';
import { ADMIN_API_BASE_URL, ADMIN_API_MENU_UPDATE } from '../../resources/newApiResource';
import FloatingBtn from '../popups/floatingButtonPopup';
import { getAdminCategories } from '../../store/categories';
import { getAD } from '../../store/ad';
import { getAdminBulletin } from '../../store/menuExtra';
import { colorBlack, colorBrown, colorLightBrown, colorRed, colorWhite } from '../../assets/colors/color';
import { useFocusEffect } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const CartView = () =>{
    const lw = new LogWriter();
    const {language} = useSelector(state=>state.languages);

    const dispatch = useDispatch();
    const orderListRef = useRef();
    const {isOn, isQuickOrder} = useSelector((state)=>state.cartView);
    const {orderList,vatTotal} = useSelector((state)=>state.order);
    const {orderStatus} = useSelector(state=>state.order);    
    const {allItems} = useSelector(state=>state.menu);
    const { tableInfo, tableStatus,isSplit } = useSelector(state=>state.tableInfo);
    const {isMonthSelectShow, monthSelected} = useSelector(state=>state.monthSelect)
    
    //console.log("orderList: ",orderList);
    const [totalAmt, setTotalAmt] = useState();
    const [totalCnt, setTotalCnt] = useState(0);
    const [isPayProcess, setPayProcess] = useState(false);
    const [tableNoText, setTableNoText] = useState("");

    const [slideAnimation, setSlideAnimation] = useState(new Animated.Value(0));
    const slideInterpolate = slideAnimation.interpolate({
        inputRange:[0,1],
        outputRange:[(windowWidth > 1200 ? windowWidth*0.43:windowWidth*0.266),(windowWidth*0.004)]
        //outputRange:[314,5]
    })
    const boxStyle = {
        transform: [{translateX:slideInterpolate},],
    };
    const isPrepay = tableStatus?.now_later=="선불"?true:false;

    const drawerController = (isOpen) =>{
        Animated.parallel([
            Animated.timing(slideAnimation,{
                toValue:isOpen?1:0,
                duration:200,
                useNativeDriver:true
            })
        ]).start();
    }
    const InitFunction = async() =>{
        // 카테고리 받기
        await dispatch(getAdminCategories());
        // 메뉴 받아오기
        await dispatch(getAdminItems());
        //EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
        // 기기 정보 받기
        getDeviceInfo();
        // 광고 받기
        dispatch(getAD());
        dispatch(regularUpdate());
        dispatch(getAdminBulletin());
    }

    useEffect(()=>{
        if(!isMonthSelectShow) {
            if(totalAmt>0) {
                if(monthSelected!="") {
                    makePayment();
                    dispatch(setSelectedMonth(""));
                }else {
                    // 할부선택 취소
                    //console.log("할부 선택 취소");
                    EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                    setPayProcess(false);
                }
            }
        }

    },[isMonthSelectShow,monthSelected])
    const makePayment = async () =>{
        if( tableStatus?.now_later == "선불") {
                const bsnNo = await AsyncStorage.getItem("BSN_NO");
                const tidNo = await AsyncStorage.getItem("TID_NO");
                const serialNo = await AsyncStorage.getItem("SERIAL_NO");
                if( isEmpty(bsnNo) || isEmpty(tidNo) || isEmpty(serialNo) ) {
                    displayErrorPopup(dispatch, "XXXX", "결제정보 입력 후 이용 해 주세요.");
                    setPayProcess(false);
                    return;
                }
                const orderData = await metaPostPayFormat(orderList,{}, allItems);
                if(orderData) {
                    var payAmt = 0;
                    var vatAmt = 0;
                    for(var i=0;i<orderData.ITEM_INFO.length;i++) {
                        payAmt = payAmt + (Number(orderData.ITEM_INFO[i].ITEM_AMT) - Number(orderData.ITEM_INFO[i].ITEM_VAT))
                        vatAmt = vatAmt + Number(orderData.ITEM_INFO[i].ITEM_VAT);
                        const setItems = orderData.ITEM_INFO[i].SETITEM_INFO;
                        for(var j=0;j<setItems.length;j++) {
                            payAmt = payAmt + (Number(orderData.ITEM_INFO[i].SETITEM_INFO[j].AMT) - Number(orderData.ITEM_INFO[i].SETITEM_INFO[j].VAT))
                            vatAmt = vatAmt + Number(orderData.ITEM_INFO[i].SETITEM_INFO[j].VAT)
                        }                        
                    }
                    const amtData = {amt:payAmt, taxAmt:vatAmt, months:monthSelected, bsnNo:bsnNo,termID:tidNo }
                    var kocessAppPay = new KocesAppPay();
                    kocessAppPay.requestKocesPayment(amtData)
                    .then(async (result)=>{ 
                        //const result = {"AnsCode": "0000", "AnswerTrdNo": "null", "AuNo": "28872915", "AuthType": "null", "BillNo": "", "CardKind": "1", "CardNo": "9411-9400-****-****", "ChargeAmt": "null", "DDCYn": "1", "DisAmt": "null", "EDCYn": "0", "GiftAmt": "", "InpCd": "1107", "InpNm": "신한카드", "Keydate": "", "MchData": "wooriorder", "MchNo": "22101257", "Message": "마이신한P잔여 : 109                     ", "Month": "00", "OrdCd": "1107", "OrdNm": "개인신용", "PcCard": "null", "PcCoupon": "null", "PcKind": "null", "PcPoint": "null", "QrKind": "null", "RefundAmt": "null", "SvcAmt": "0", "TaxAmt": `${vatAmt}`, "TaxFreeAmt": "0", "TermID": "0710000900", "TradeNo": "000004689679", "TrdAmt": `${payAmt}`, "TrdDate": "240902182728", "TrdType": "A15"}
                        // 결제 진행끝이다.
                        setPayProcess(false);
                        const orderFinalData = await metaPostPayFormat(orderList,result, allItems);
                        dispatch(postLog({payData:result,orderData:orderFinalData}))
                        dispatch(postOrderToPos({isHelp:false, isQuick:false, payData:result,orderData:orderFinalData, isMultiPay:false}));
                        dispatch(adminDataPost({payData:result,orderData:orderFinalData, isMultiPay:false}));
                    })
                    .catch((err)=>{
                        // 결제 진행끝이다.
                        setPayProcess(false);
                        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                        dispatch(postLog({payData:err,orderData:null}))
                        displayErrorPopup(dispatch, "XXXX", err?.Message)
                    })
                }
            }else {
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                const orderData = await metaPostPayFormat(orderList,{}, allItems);
                dispatch(adminDataPost({payData:null,orderData:orderData, isMultiPay:false}));
                dispatch(postOrderToPos({isHelp:false, isQuick:false, payData:null,orderData:orderData, isMultiPay:false}));
                setPayProcess(false);
            }
    }
    const ItemOptionTitle = (additiveId) =>{
        let selOptTitleLanguage = "";
        const selExtra = allItems.filter(el=>el.prod_cd==additiveId);
        if(language=="korean") {
            selOptTitleLanguage = selExtra[0]?.gname_kr;
        }
        else if(language=="japanese") {
            selOptTitleLanguage = selExtra[0]?.gname_jp||selExtra[0]?.gname_kr;
        }
        else if(language=="chinese") {
            selOptTitleLanguage = selExtra[0]?.gname_cn||selExtra[0]?.gname_kr;
        }
        else if(language=="english") {
            selOptTitleLanguage = selExtra[0]?.gname_en||selExtra[0]?.gname_kr;
        }
        return selOptTitleLanguage;
    }

    const doPayment = async () =>{
        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:true, msg:"주문 중 입니다."});
        const isPostable = await isNetworkAvailable()
        .catch(()=>{
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            setPayProcess(false);
            return false;
        });
        if(!isPostable) {
            displayErrorNonClosePopup(dispatch, "XXXX", "인터넷에 연결할 수 없습니다.");
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            setPayProcess(false);
            return;
        }

        const storeInfo = await getPosStoreInfo()
        .catch((err)=>{
            displayErrorNonClosePopup(dispatch, "XXXX", "상점 정보를 가져올 수 없습니다.");
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""}); 
            setPayProcess(false);
            return;
        })
        // 개점정보 확인
        if(!storeInfo?.SAL_YMD) {
            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
            displayErrorPopup(dispatch, "XXXX", "개점이 되지않아 주문을 할 수 없습니다.");
            setPayProcess(false);
        }else {
            //테이블 주문 가능한지 체크            
            const tableAvail = await getTableAvailability(dispatch)
            .catch(()=>{
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                return [];
            });
            if(!tableAvail) {
                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""});
                setPayProcess(false);
            }else {
                const {STORE_IDX} = await getStoreID();
                const lastUpdateDate = await AsyncStorage.getItem("lastUpdate").catch(err=>"");   
                /// 카트메뉴 주문 가능 여부 체크
                const isItemOrderble = await itemEnableCheck(STORE_IDX,orderList).catch(err=>{ return{isAvailable:false, result:null} } );
                if(isItemOrderble?.isAvailable == false) {
                    if(isItemOrderble?.result == null) {
                        EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
                        displayErrorPopup(dispatch, "XXXX", "수량을 체크할 수 없어 주문을 할 수 없습니다.");
                        setPayProcess(false);
                        return;
                    }else {
                        const itemsUnavailable = isItemOrderble?.result[0]?.unserviceable_items;
                        var itemString = "";
                        if(itemsUnavailable?.length>0) {
                            for(var i=0;i<itemsUnavailable.length;i++) {
                                var itemName = ItemOptionTitle(itemsUnavailable[i]);
                                itemString = itemString+itemName+(i<itemsUnavailable.length-1?", ":"")
                            }
                            EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
                            displayErrorPopup(dispatch, "XXXX", itemString+"메뉴는 매진되어 주문을 할 수 없습니다.");
                            setPayProcess(false);
                            return;
                        }
                    }
                }                
                try {
                    const data = await callApiWithExceptionHandling(`${ADMIN_API_BASE_URL}${ADMIN_API_MENU_UPDATE}`,{"STORE_ID":`${STORE_IDX}`,"currentDateTime":lastUpdateDate}, {});
                    if(data) {
                        if(data?.result==true) {
                            if(data?.isUpdated == "true") {
                                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:false, msg:""})
                                setPayProcess(false);
                                //displayErrorPopup(dispatch, "XXXX", "메뉴 업데이트가 되었습니다.\n업데이트 후에 주문 해 주세요.");
                                EventRegister.emit("showSpinnerNonCancel",{isSpinnerShowNonCancel:true, msg:"메뉴 업데이트가 되었습니다.\n업데이트를 진행합니다."});
                                InitFunction();
                                /* 
                                Alert.alert(
                                    "업데이트",
                                    "메뉴 업데이트가 되었습니다. 업데이트 후 주문하실 수 있습니다.",
                                    [{
                                        text:'확인',
                                    }]
                                ); */
                            }else {
            
                                if( tableStatus?.now_later == "선불") {
                                    if(totalAmt >= PAY_SEPRATE_AMT_LIMIT) {
                                        dispatch(setMonthPopup({isMonthSelectShow:true}))
                                    }else {
                                        makePayment();
                                    }
                                }else {
                                    makePayment();
                                }
                            }
                        }else {
                            if( tableStatus?.now_later == "선불") {
                                if(totalAmt >= PAY_SEPRATE_AMT_LIMIT) {
                                    dispatch(setMonthPopup({isMonthSelectShow:true}))
                                }else {
                                    makePayment();
                                }
                            }else {
                                makePayment();
                            }
                        }
                    }else {
                        if( tableStatus?.now_later == "선불") {
                            if(totalAmt >= PAY_SEPRATE_AMT_LIMIT) {
                                dispatch(setMonthPopup({isMonthSelectShow:true}))
                                setPayProcess(false);
                            }else {
                                makePayment();
                            }
                        }else {
                            makePayment();
                        }
                    }
                } catch (error) {
                    // 예외 처리
                    if( tableStatus?.now_later == "선불") {
                        if(totalAmt >= PAY_SEPRATE_AMT_LIMIT) {
                            dispatch(setMonthPopup({isMonthSelectShow:true}))
                            setPayProcess(false);
                        }else {
                            makePayment();
                        }
                    }else {
                        makePayment();
                    }   
                }
            }
        }
    }
    useEffect(()=>{
        dispatch(setOrderProcess(false));
        if(isOn == true) {
            setPayProcess(false);
        }
        drawerController(isOn); 
    },[isOn])

    useEffect(()=>{
        //console.log("order list: ",orderList.length);
        if(orderList?.length > 0) {
            dispatch(setCartView(true))
        }else {
            dispatch(setCartView(false))
        }
        if(orderList.length > 0) {
            var itemTotal = 0;
            var qtyTotal = 0;
            for(var i=0;i<orderList.length;i++) {
                const orderItem = orderList[i];
                const itemDetail = allItems?.filter(el=>el.prod_cd == orderItem?.prod_cd);
                
                if(META_SET_MENU_SEPARATE_CODE_LIST.indexOf(itemDetail[0]?.prod_gb)>=0) {
                    //itemTotal = itemTotal+Number(itemDetail[0]?.account);
                    // 선택하부금액 
                    const setItem = orderItem?.set_item;
                    var setItemPrice = 0;
                    
                    if(setItem.length>0) {
                        // 세트 선택이 있다.
                        for(var j=0;j<setItem.length;j++) {
                            const setItemData = allItems?.filter(el=>el.prod_cd == setItem[j].optItem);
                            if(setItemData.length>0) {
                                setItemPrice = Number(setItemPrice)+(Number(setItemData[0]?.account)*Number(setItem[j]?.qty));
                            }
                            //itemTotal = (Number(itemTotal)+Number(setItemPrice))*Number(orderItem?.qty);
                            
                        }
                        itemTotal = Number(itemTotal) + ( (Number(setItemPrice)+Number(itemDetail[0]?.account)) *orderItem.qty );
                    }else {
                        // 세트 선택이 없다.
                        //console.log("itemTotal: ",Number(itemDetail[0]?.account),Number(orderItem?.qty));
                        itemTotal = itemTotal+ (Number(itemDetail[0]?.account)*Number(orderItem?.qty));
                    }

                    qtyTotal = qtyTotal+orderItem?.qty;
                     
                }else {
                    itemTotal = itemTotal+(Number(itemDetail[0]?.account)*Number(orderItem?.qty));
                    qtyTotal = qtyTotal+orderItem?.qty;
                } 
            }
            setTotalCnt(qtyTotal)
            setTotalAmt(itemTotal)
        }else {
            setTotalCnt(0)
            setTotalAmt(0)
        }
        
    },[orderList])
    useEffect(()=>{
        // 주문중 상태 변경: 주문중에 메뉴 업데이트를 안하기 위함dispatch(setOrderProcess(true));
        dispatch(setOrderProcess(isPayProcess));
    },[isPayProcess])
    useEffect(()=>{
        if(isQuickOrder == true) {
            if(isPayProcess == false){setPayProcess(true); doPayment();}
        }
    },[isQuickOrder])
    
    useEffect(()=>[
        AsyncStorage.getItem("TABLE_NM")
        .then((TABLE_NM)=>{
            if(TABLE_NM) {
                setTableNoText(TABLE_NM)
            }else {
            }
        })
    ],[])
    return(
        <>  
            <CartViewWrapper style={[{...boxStyle}]} >
                <TopTitleWrapper>
                    <TopTitleView align={"center"} >
                        <TopTitleText textAlign={"left"} >{LANGUAGE[language]?.cart?.cart}</TopTitleText>
                    </TopTitleView>
                    <TopTableView align={"center"} >
                        <TopTableText textAlign={"center"} >{tableNoText}</TopTableText>
                    </TopTableView>
                </TopTitleWrapper>
                <TouchableWithoutFeedback 
                    onPress={()=>{ 
                        AsyncStorage.getItem("TABLE_NM")
                            .then((TABLE_NM)=>{
                                console.log("cart view TABLE_NM: ",TABLE_NM);
                                if(TABLE_NM) {
                                    setTableNoText(TABLE_NM)
                                }else {
                                }
                            });  
                            dispatch(setCartView(!isOn));  
                        }
                    }>
                    <Handle>
                        
                        {isOn&&
                            <Text style={{fontSize:26, fontWeight:'bold', color:colorBlack, textAlign:'center', width:'100%', backgroundColor:'transparent'}} >
                                {LANGUAGE[language]?.cartView.handleTextClose}
                            </Text>
                        }
                        {!isOn&&
                            <Text style={{fontSize:26, fontWeight:'bold', color:colorBlack, textAlign:'center', width:'100%', backgroundColor:'transparent'}} >
                                {LANGUAGE[language]?.cartView.handleText}
                            </Text>
                        }
                    </Handle>
                </TouchableWithoutFeedback>
                {orderList &&
                    <CartFlatList
                        ref={orderListRef}
                        data={orderList}
                        renderItem={(item )=>{
                            return(
                                <CartListItem {...item} />
                            )
                        }}
                    >
                    </CartFlatList>
                } 
                <OrderWrapper>
                    <PayWrapper>
                        <PayAmtWrapper isBordered={true}>
                            <PayAmtTitle>{LANGUAGE[language]?.cartView?.orderAmt}</PayAmtTitle>
                            <PayAmtNumber>{totalCnt}</PayAmtNumber>
                            <PayAmtUnit> {LANGUAGE[language]?.cartView?.orderAmtUnit}</PayAmtUnit>
                        </PayAmtWrapper>
                    </PayWrapper>
                    <PayWrapper>
                        <PayAmtWrapper >
                            <PayAmtTitle>{LANGUAGE[language]?.cartView.totalAmt}</PayAmtTitle>
                            <PayAmtNumber>{numberWithCommas(totalAmt)}</PayAmtNumber>
                            <PayAmtUnit> {LANGUAGE[language]?.cartView.totalAmtUnit}</PayAmtUnit>
                        </PayAmtWrapper>
                    </PayWrapper>
                    {/* <PayBtnWrapper> */}
                        
                    {/* </PayBtnWrapper> */}

                </OrderWrapper>
                <TouchableWithoutFeedback onPress={()=>{if(isPayProcess == false){setPayProcess(true); doPayment();}}} >
                    <PayFullBtn isFull={true} color={colorLightBrown} >
                        <PayTitle>{LANGUAGE[language]?.cartView.makeOrder}</PayTitle>
                        <PayIcon source={require("../../assets/icons/card.png")} />
                    </PayFullBtn>
                </TouchableWithoutFeedback>
            </CartViewWrapper>  
        </>
    )
}
const samplePayData = {"AnsCode": "0000", "AnswerTrdNo": null, "AuNo": "18691817", "AuthType": null, "BillNo": "", "CardKind": "1", "CardNo": "94119400", "ChargeAmt": null, "DDCYn": "1", "DisAmt": null, "EDCYn": "0", "GiftAmt": "", "InpCd": "1107", "InpNm": "신한카드", "Keydate": "", "MchData": "wooriorder", "MchNo": "22101257", "Message": "000002882653                            ", "Month": "03", "OrdCd": "1107", "OrdNm": "개인신용", "PcCard": null, "PcCoupon": null, "PcKind": null, "PcPoint": null, "QrKind": null, "RefundAmt": null, "SvcAmt": "0", "TaxAmt": "4546", "TaxFreeAmt": "0", "TermID": "0710000900", "TradeNo": "000002882653", "TrdAmt": "45458", "TrdDate": "231228150830", "TrdType": "A15"};
export default CartView;