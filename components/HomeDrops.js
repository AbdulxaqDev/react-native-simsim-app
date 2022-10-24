import {
 View,
 Text,
 TouchableOpacity,
 StyleSheet,
 Image,
 ScrollView,
 Button,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import dropIcon from "../src/assets/images/dropicon2.png";
import addIcon from "../src/assets/images/addCircleW.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeDrops({
 selectedItem = [],
 listOfHomes = [
  {
   id: 9,
   name: "Local Home 1",
   created_at: "2022-07-13T18:33:06.104834+05:00",
   updated_at: "2022-07-13T18:33:06.109107+05:00",
   owner: 3,
  },
  {
   id: 10,
   name: "Local Home 2",
   created_at: "2022-07-13T18:33:17.577234+05:00",
   updated_at: "2022-07-13T18:33:17.581685+05:00",
   owner: 3,
  },
 ],
 onSelect = () => {},
}) {
 const navigation = useNavigation();
 const [showOption, setShowOption] = useState(false);
 const onSelectItem = (val) => {
  setShowOption(false);
  onSelect(val);
 };

 return (
  <View style={style.main}>
   <TouchableOpacity
    style={[style.homeDrops, { width: 170 }]}
    activeOpacity={0.9}
    onPress={() => setShowOption(!showOption)}
   >
    <Text style={style.title}>
     {!!selectedItem ? selectedItem?.name : "Choose home"}
    </Text>
    <Image
     style={{
      transform: [{ rotate: showOption ? "270deg" : "90deg" }],
      width: 8,
      height: 8,
     }}
     source={dropIcon}
    />
   </TouchableOpacity>
   {showOption && (
    <View style={style.wrapper}>
     <ScrollView showsVerticalScrollIndicator={false}>
      {listOfHomes.map((home, i) => {
       return (
        <TouchableOpacity
         key={home.created_at}
         onPress={() => onSelectItem(home)}
         style={[
          style.homeDrops,
          {
           backgroundColor: selectedItem
            ? selectedItem.created_at
            : false == home.created_at
            ? "rgba(100, 24, 37, 0.7)"
            : "#3b4165",
          },
         ]}
         activeOpacity={0.8}
        >
         <Text style={style.title}>{home.name}</Text>
        </TouchableOpacity>
       );
      })}
      <TouchableOpacity
       style={{
        backgroundColor: "#3b4165",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        borderRadius: 5,
        padding: 5,
       }}
       activeOpacity={0.8}
       onPress={() => navigation.navigate("Add home")}
      >
       <Image style={{ width: 17, height: 17 }} source={addIcon} />
      </TouchableOpacity>
     </ScrollView>
    </View>
   )}
  </View>
 );
}

const style = StyleSheet.create({
 main: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
 },
 homeDrops: {
  backgroundColor: "rgb(100, 24, 37)",
  color: "white",
  borderRadius: 5,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexDirection: "row",
  paddingRight: 20,
  marginTop: 5,
 },
 title: {
  color: "white",
  padding: 10,
  textAlign: "left",
  fontSize: 15,
  fontWeight: "900",
  fontFamily: "Poppins-Medium",
 },
 wrapper: {
  position: "absolute",
  top: 37,
  backgroundColor: "#1d2031",
  padding: 7,
  borderRadius: 5,
  marginTop: 5,
  height: 140,
  width: 170,
  zIndex: 10,
 },
});
