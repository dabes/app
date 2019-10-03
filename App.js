import React, { Component } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";
import { ActivityIndicator } from "react-native";
import * as Font from "expo-font";
import { initDB, getconfigs } from "./database.js";
// Telas
import BuscarBem from "./pages/BuscarBem";
import CarregarBens from "./pages/CarregarBens";
import DescarregarBens from "./pages/DescarregarBens";
import Configurations from "./pages/Configurations";
import Decider from "./pages/Decider";

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

const Decider_StackNavigator = createStackNavigator({
  //All the screen from the BuscarBem will be indexed here
  Decider: {
    screen: Decider,
    navigationOptions: ({ navigation }) => ({
      title: "Decider",
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: "#89c396"
      },
      headerTintColor: "#fff"
    })
  }
});

const Configurations_StackNavigator = createStackNavigator({
  //All the screen from the BuscarBem will be indexed here
  Configurations: {
    screen: Configurations,
    navigationOptions: ({ navigation }) => ({
      title: "Configurações",
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
  },
  Configurations: {
    //Title
    screen: Configurations_StackNavigator,
    navigationOptions: {
      drawerLabel: "Configurações"
    }
  }
});

const MenuNavigatorConfigurations = createDrawerNavigator({
  Configurations: {
    //Title
    screen: Configurations_StackNavigator,
    navigationOptions: {
      drawerLabel: "Configurações"
    }
  },
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

const MenuNavigatorDecider = createDrawerNavigator({
  Decider: {
    //Title
    screen: Decider_StackNavigator,
    navigationOptions: {
      drawerLabel: "Decider"
    }
  }
});

const Apps = createSwitchNavigator(
  {
    Applic: MenuNavigator,
    Configurations: MenuNavigatorConfigurations,
    Decider: MenuNavigatorDecider
  },
  {
    initialRouteName: "Decider"
  }
);

const AppContainer = createAppContainer(Apps);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.navigationOptions = {
      header: null
    };

    this.state = {
      isReady: false,
      selected_mat: false
    };
    getconfigs().then(configuracoes => {
      console.log(configuracoes);
      global.ip = configuracoes.ip;
      global.mat_centro_custo = configuracoes.mat_centro_custo;
    });
  }

  componentWillMount = async () => {
    initDB();
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ isReady: true });
  };

  render() {
    if (!this.state.isReady) {
      return <ActivityIndicator />;
    } else return <AppContainer vars={global} />;
  }
}
