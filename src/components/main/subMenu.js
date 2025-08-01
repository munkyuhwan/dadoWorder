import React, { useEffect, useRef, useState } from 'react'
import { 
    Animated,
    Dimensions,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback
} from 'react-native'
import { BulletinText, BulletinWrapper, CategoryScrollView, CategoryWrapper, IconWrapper, TableName, TableNameBig, TableNameSmall, TopMenuWrapper, TouchIcon } from '../../styles/main/subMenuStyle'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedSubCategory } from '../../store/categories'
import { openFullSizePopup, openPopup, openTransperentPopup } from '../../utils/common'
import TopMenuList from '../menuComponents/topMenuList'
import VersionCheck from 'react-native-version-check';
import AsyncStorage from '@react-native-async-storage/async-storage'
import AutoScroll from "@homielab/react-native-auto-scroll";
import SubMenuList from '../menuComponents/subMenuList';
import isEmpty from 'lodash';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const MAINIMG = windowWidth;

const SubMenu = (props) =>{
    const dispatch = useDispatch();
    const scrollViewRef = useRef();
    const {selectedMainCategory,subCategories, allCategories} = useSelector(state => state.categories);
    const [tableNoText, setTableNoText] = useState("");
    const [tableInfoText, setTableInfoText] = useState("");
    const {tableInfo,cctv,tableStatus} = useSelector(state => state.tableInfo);
    
    const {bulletin} = useSelector(state=>state.menuExtra);

    const [currentVersion, setCurrentVersion ] = useState("version");
    const [bulletinText, setBulletinText] = useState("");
    const [bulletinCode, setBulletinCode] = useState("");
    const [isBulletinShow, setBulletinShow] = useState();
    useEffect(()=>{
        if(subCategories) {
            if(subCategories?.length > 0) {
                setBulletinShow(false)
            }else {
                setBulletinShow(true)
            }
        }else {
            setBulletinShow(true)
        }
    },[subCategories])

    useEffect(()=>{
        /*
        const changedSelectedMainCat = allCategories.filter(el=>el.cate_code1==selectedMainCategory);
         
        if(changedSelectedMainCat) {
            if(changedSelectedMainCat?.length > 0) {
                if(subCategories) {
                    if(subCategories?.length > 0) {
                        setBulletinShow(false)
                    }else {
                        setBulletinShow(true)
                    }
                }else {
                    setBulletinShow(true)
                }
            }
        }
        */
        scrollViewRef.current.scrollTo({x:0,animated: false});
        const bulletinToShow = bulletin?.filter(el=>el.cate_code == selectedMainCategory);
        if(bulletinToShow){
            setBulletinCode(bulletinToShow[0]?.cate_code);
            setBulletinText(bulletinToShow[0]?.subject);
        }
    },[selectedMainCategory])

    useEffect(()=>{
        if(tableInfo) {
            //setTableNoText(tableInfo.tableNo)
            AsyncStorage.getItem("TABLE_INFO")
            .then((TABLE_INFO)=>{
                if(TABLE_INFO) {
                    setTableInfoText(TABLE_INFO)
                }
            })

            AsyncStorage.getItem("TABLE_NM")
            .then((TABLE_NM)=>{
                if(TABLE_NM) {
                    setTableNoText(TABLE_NM)
                }else {
                }
            })
        }
    },[tableInfo])

    useEffect(()=>{ 
        
        setCurrentVersion(VersionCheck.getCurrentVersion());
        AsyncStorage.getItem("TABLE_NM")
        .then((TABLE_NM)=>{
            if(TABLE_NM) {
                setTableNoText(TABLE_NM)
            }else {
            }
        })
    },[])

    const onPressItem = (index) => {
        props.onPressSubCat(index);
        dispatch(setSelectedSubCategory(index)); 
    }

      
    // 세팅 터치
    const [settingTouch, setSettingTouch] = useState(0);
    const [isStartCounting, setIsStartCounting] = useState(true);
    let settingCount=null;
    let countTime = 5;
    const countDown = () =>{
        if(isStartCounting) {
            setIsStartCounting(false);
            settingCount = setInterval(() => {
                if(countTime>0) {
                    countTime = countTime-1;
                }else {
                    countTime = 5
                    clearInterval(settingCount);
                    settingCount=null;
                    setIsStartCounting(true);
                }
            }, 1000);
        }
    }
    const onSettingPress = () => {
        if(settingTouch<5) {
            setSettingTouch(settingTouch+1);
            if(countTime>0) {
                if(settingTouch>=4) {
                    clearInterval(settingCount);
                    settingCount=null;
                    setIsStartCounting(true);
                    setSettingTouch(0);
                    openFullSizePopup(dispatch,{innerFullView:"Setting", isFullPopupVisible:true});
                }
            }
        }else {
            setSettingTouch(0);
        }
    }
 
    return(
        <>
            <TopMenuWrapper isShow={subCategories?.length>0} >
                <SafeAreaView>
                    <CategoryScrollView ref={scrollViewRef} horizontal={true} showsHorizontalScrollIndicator={false} >
                        <CategoryWrapper>
                            {subCategories &&
                                <SubMenuList
                                    data={subCategories}
                                    onSelectItem={(index)=>{onPressItem(index); }}
                                    initSelect={0}
                                />
                            }
                       </CategoryWrapper>
                    </CategoryScrollView>
                    {((bulletinCode == selectedMainCategory)&&(isBulletinShow)) &&
                        <AutoScroll duration={10000}  style={{width:600}}>
                            <BulletinText>{bulletinText}</BulletinText>
                        </AutoScroll>
                    }
                </SafeAreaView>
    

            
            </TopMenuWrapper>
        </>
    )
}/* 
const styles = StyleSheet.create({
    safeView: {
     flex: 1,
     backgroundColor: '#1C1C1E',
    },
    container: {
     flex: 1,
     width: '600px',
     backgroundColor: '#1C1C1E',
     // paddingTop: '15%',
     paddingBottom: '15%',
    },
    img: scrollA => ({
        width: windowWidth * 2,
        height: MAINIMG,
        resizeMode: 'center',
        transform: [
          {
            translateX: scrollA.interpolate({
                inputRange: [-MAINIMG, 0, MAINIMG, MAINIMG + 1],
                outputRange: [-MAINIMG / 2, 0, MAINIMG * 0.75, MAINIMG * 0.75],
            }) ,
          },
          {
            scale:0.5,
          },
        ],
       })
});
 */
export default SubMenu