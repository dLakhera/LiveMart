import React, { useContext, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-community/async-storage";
const FeedbackAPP = () => {
  const [feedback, setFeedback] = useState("");
  return (
    <FormContainer title={"Feedback"}>
      <Input
        placeholder={"Feedback for Developer"}
        onChangeText={text => { setFeedback(text) }}
      />
      <View style={styles.buttonGroup}>
        <EasyButton primary large style={{ innerHeight: 5 }} onPress={()=>{

        }}>
          <Text style={{ color: "black" }}>Submit</Text>
        </EasyButton>
      </View>
    </FormContainer>
  );
};



const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    alignItems: "center",
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
  },
});

export default FeedbackAPP;
