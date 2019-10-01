import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image
} from "react-native";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { ActivityIndicator } from "react-native";
import { Camera } from "expo-camera";

export default class PhotoCamera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      close: false,
      type: Camera.Constants.Type.back,
      phototaken: false,
      photohash: null
    };
  }
  async componentDidMount() {
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  };

  render() {
    const { hasCameraPermission, close } = this.state;

    if (hasCameraPermission === null) {
      return <ActivityIndicator size="large" />;
    }
    if (hasCameraPermission === false) {
      return <Text>Acesso a camera bloqueado</Text>;
    }
    if (this.state.phototaken !== false) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end"
          }}
        >
          <View>
            <Image
              source={{ uri: this.state.uri }}
              resizeMode={"cover"}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "49%", marginRight: 10 }}>
              <Button
                title={"Aceitar"}
                onPress={() =>
                  this.props.returnCode(this.state.uri, this.state.photohash)
                }
              />
            </View>
            <View style={{ width: "49%" }}>
              <Button
                title={"Cancelar"}
                onPress={() => this.setState({ phototaken: false })}
              />
            </View>
          </View>
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-end"
        }}
      >
        <Camera
          style={StyleSheet.absoluteFillObject}
          type={this.state.type}
          ref={ref => {
            this.camera = ref;
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "row"
            }}
          >
            <View
              style={{
                width: "100%",
                height: 50,
                // backgroundColor: "#FF9800",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                bottom: 50
              }}
            >
              <TouchableOpacity
                onPress={this.retornophoto}
                style={{
                  flex: 0,
                  backgroundColor: "#fff",
                  borderRadius: 5,
                  padding: 15,
                  paddingHorizontal: 20,
                  alignSelf: "center",
                  margin: 20
                }}
              >
                <Text style={{ fontSize: 14 }}> SNAP </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
        <Button title={"Fechar"} onPress={() => this.props.returnCode("")} />
      </View>
    );
  }

  retornophoto = async ({ type, data }) => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const photo = await this.camera.takePictureAsync(options);
      this.props.navigation.setParams({ photo: false, image: data });
      this.setState({
        phototaken: true,
        uri: photo.uri,
        photohash: photo.base64
      });
      // this.props.returnCode(photo.uri);
    }

    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };
}
