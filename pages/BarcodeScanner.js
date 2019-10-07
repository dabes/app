import * as React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { ActivityIndicator, Image } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

export default class BarcodeScanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      scanned: false,
      close: false
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
    const { hasCameraPermission, scanned, close } = this.state;

    if (hasCameraPermission === null) {
      return <ActivityIndicator size="large" />;
    }
    if (hasCameraPermission === false) {
      return <Text>Acesso a camera bloqueado</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-end"
        }}
      >
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0.2, 0.2, 0.2, 0.2)",
              alignItems: "center",
              justifyContent: "space-around"
            }}
          >
            <View
              style={{
                width: 300,
                height: 100,
                backgroundColor: "transparent",
                borderColor: "white",
                borderWidth: 2
              }}
            />
          </View>
        </BarCodeScanner>
        <Button title={"Fechar"} onPress={() => this.props.returnCode("")} />

        {scanned && (
          <Button
            title={"Clique aqui para scannear novamente."}
            onPress={() => this.setState({ scanned: false })}
          />
        )}
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.props.navigation.setParams({ barcode: false, leitura: data });
    this.props.returnCode(data);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };
}
