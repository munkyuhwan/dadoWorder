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
    const {selectedMainCategory,subCategories,selectedSubCategory, allCategories} = useSelector(state => state.categories);
    const [tableNoText, setTableNoText] = useState("");
    const [tableInfoText, setTableInfoText] = useState("");
    const {tableInfo,cctv,tableStatus} = useSelector(state => state.tableInfo);
    
    const {bulletin} = useSelector(state=>state.menuExtra);

    const [currentVersion, setCurrentVersion ] = useState("version");
    const [bulletinText, setBulletinText] = useState("");
    const [bulletinCode, setBulletinCode] = useState("");
    const [isBulletinShow, setBulletinShow] = useState();

    const [selectedSubCat, setSelectedSubCat] = useState("");

    useEffect(()=>{
        console.log("props.tmpSubCat: ",props.tmpSubCat);
        setSelectedSubCat(props.tmpSubCat);
    },[props.tmpSubCat])
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
        console.log("index: ",index);
        setSelectedSubCat(index);
        props.onPressSubCat(index);
        //dispatch(setSelectedSubCategory(index)); 
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
                                    onSelectItem={(index)=>{ onPressItem(index); }}
                                    initSelect={0}
                                    selectedSubCat={selectedSubCat}
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
} 
export default SubMenu