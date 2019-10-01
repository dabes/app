import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";
import { ActivityIndicator } from "react-native";
import * as Font from "expo-font";
// Telas
import BuscarBem from "./pages/BuscarBem";
import CarregarBens from "./pages/CarregarBens";
import DescarregarBens from "./pages/DescarregarBens";
import { initDB, getconfigs } from "./database.js";
//Estrutura do construtor do menu
class NavigationDrawerStructure extends Component {
  //Structure for the navigatin Drawer
  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          {/*Donute Button Image */}
          <Image
            source={require("./images/menu.png")}
            style={{ width: 25, height: 25, marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const BuscaBem_StackNavigator = createStackNavigator({
  //All the screen from the BuscarBem will be indexed here
  Bem: {
    screen: BuscarBem,
    navigationOptions: ({ navigation }) => ({
      title: "Buscar Bem",
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: "#89c396"
      },
      headerTintColor: "#fff"
    })
  }
});

const CarregarBens_StackNavigator = createStackNavigator({
  //All the screen from the CarregarBens will be indexed here
  Second: {
    screen: CarregarBens,
    navigationOptions: ({ navigation }) => ({
      title: "Carregar Bens",
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: "#89c396"
      },
      headerTintColor: "#fff"
    })
  }
});

const DescarregarBens_StackNavigator = createStackNavigator({
  //All the screen from the DescarregarBens will be indexed here
  Third: {
    screen: DescarregarBens,
    navigationOptions: ({ navigation }) => ({
      title: "Descarregar Bens",
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: "#89c396"
      },
      headerTintColor: "#fff"
    })
  }
});

const MenuNavigator = createDrawerNavigator({
  //Drawer Optons and indexing
  BuscaBem: {
    //Title
    screen: BuscaBem_StackNavigator,
    navigationOptions: {
      drawerLabel: "Buscar Bem"
    }
  },
  CarregarBens: {
    //Title
    screen: CarregarBens_StackNavigator,
    navigationOptions: {
      drawerLabel: "Carregar Bens"
    }
  },
  DescarregarBens: {
    //Title
    screen: DescarregarBens_StackNavigator,
    navigationOptions: {
      drawerLabel: "Descarregar Bens"
    }
  }
});

const Apps = createSwitchNavigator({
  Loading: {
    screen: MenuNavigator
  }
});

const AppContainer = createAppContainer(Apps);

export default class App extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    isReady: false
  };

  componentWillMount = async () => {
    initDB();

    configuracoes = await getconfigs();
    // ip = configuracoes.ip;
    console.log("b");
    console.log(configuracoes);
    configuracoes.forEach((key, val) => {
      console.log(key, val);
    });
    console.log("b");
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ isReady: true });
  };

  render() {
    if (!this.state.isReady) {
      return <ActivityIndicator />;
    }
    return <AppContainer />;
  }
}
