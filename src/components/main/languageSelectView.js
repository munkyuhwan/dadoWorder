import { TouchableWithoutFeedback } from "react-native"
import { LanguageInnerWrapper, LanguageSelectIcon, LanguageSelectTitle, NewLanguageDimWrapper, NewLanguageSelectWrapper, NewLanguageWrapper } from "../../styles/main/languageStyle"
import { MenuSelectBg } from "../../styles/main/mainStyle"
import { MenuListWrapper } from "../../styles/main/menuListStyle"
import { LanguageSelectWrapper, LanguageSelectedText, LanguageWrapper } from "../../styles/popup/languageSelectPopupStyle"
import { setLanguage } from "../../store/languages"
import { useDispatch } from "react-redux"
import { setSelectedMainCategory } from "../../store/categories"
import { setCommon } from "../../store/common"


const LanguageSelectView = () => {
    const dispatch = useDispatch();
    return(
        <>
            <MenuListWrapper>
                <MenuSelectBg source={require("../../assets/icons/daedo_bg.png")} resizeMode={"cover"} />
                <NewLanguageSelectWrapper>
                    <TouchableWithoutFeedback onPress={()=>{dispatch(setLanguage("korean")); 
                                                        dispatch(setSelectedMainCategory("")); 
                                                        dispatch(setCommon({"tab":"menu"}));  }} >
                        <NewLanguageWrapper>
                            <NewLanguageDimWrapper/>
                            <LanguageInnerWrapper style={{flex:1, paddingTop:70}} >
                                <LanguageSelectIcon source={require("../../assets/icons/korean.png")} resizeMode={"contain"} />
                            </LanguageInnerWrapper>
                            <LanguageInnerWrapper  style={{flex:1, paddingBottom:20}}>
                                <LanguageSelectTitle>한국어</LanguageSelectTitle>
                            </LanguageInnerWrapper>
                        </NewLanguageWrapper>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{dispatch(setLanguage("english")); 
                                                        dispatch(setSelectedMainCategory("")); 
                                                        dispatch(setCommon({"tab":"menu"})); }} >
                        <NewLanguageWrapper>
                            <NewLanguageDimWrapper/>
                            <LanguageInnerWrapper style={{flex:1, paddingTop:70}} >
                                <LanguageSelectIcon source={require("../../assets/icons/english.png")}  resizeMode={"contain"} />
                            </LanguageInnerWrapper>
                            <LanguageInnerWrapper  style={{flex:1, paddingBottom:20}}>
                                <LanguageSelectTitle>ENGLISH</LanguageSelectTitle>
                            </LanguageInnerWrapper>
                        </NewLanguageWrapper>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{dispatch(setLanguage("japanese")); 
                                                        dispatch(setSelectedMainCategory("")); 
                                                        dispatch(setCommon({"tab":"menu"})); }} >
                        <NewLanguageWrapper>
                            <NewLanguageDimWrapper/>        
                            <LanguageInnerWrapper style={{flex:1, paddingTop:70}} >
                                <LanguageSelectIcon source={require("../../assets/icons/japanese.png")} resizeMode={"contain"} />
                            </LanguageInnerWrapper>
                            <LanguageInnerWrapper  style={{flex:1, paddingBottom:20}}>
                                <LanguageSelectTitle>日本語</LanguageSelectTitle>
                            </LanguageInnerWrapper>
                        </NewLanguageWrapper>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>{ dispatch(setLanguage("chinese")); 
                                                        dispatch(setSelectedMainCategory("")); 
                                                        dispatch(setCommon({"tab":"menu"})); }} >
                        <NewLanguageWrapper>
                            <NewLanguageDimWrapper/>
                            <LanguageInnerWrapper style={{flex:1, paddingTop:70}} >
                                <LanguageSelectIcon source={require("../../assets/icons/chinese.png")} resizeMode={"contain"} />
                                </LanguageInnerWrapper>
                            <LanguageInnerWrapper  style={{flex:1, paddingBottom:20}}>
                                <LanguageSelectTitle>中國語</LanguageSelectTitle>
                            </LanguageInnerWrapper>
                        </NewLanguageWrapper>
                    </TouchableWithoutFeedback>
                </NewLanguageSelectWrapper>
            </MenuListWrapper>

        </>
    )
}
export default LanguageSelectView