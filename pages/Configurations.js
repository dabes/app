import React, { Component } from "react";
import config from "../config";
import { ScrollView } from "react-navigation";
import { Text, CardItem, Card, Button, Input, Item, Icon } from "native-base";
import { SQLite } from "expo-sqlite";
import { setaipconfig } from "../database";

export default class Configurations extends Component {
  constructor(props) {
    super(props);
    this.state = { ccusto: null, ccustoselecionado: null };
    this.db = SQLite.openDatabase(
      config.database.name,
      config.database.version,
      config.database.description,
      config.database.size
    );
    // this._populate();
  }

  componentDidMount = () => {
    this.setState({ ip: global.ip });
  };

  _okip = () => {
    console.log(this.state.ip);
    setaipconfig(this.state.ip).then(() => {
      this.props.navigation.navigate("Applic");
    });
  };

  ipconfig = () => {
    return (
      <Card>
        <ScrollView>
          <CardItem
            style={{
              paddingBottom: 1
            }}
          >
            <Text>IP:</Text>
          </CardItem>
          <CardItem
            style={{
              paddingTop: 1
            }}
          >
            <Item>
              <Icon name="ios-navigate" />
              <Input
                placeholder="Endereço IP"
                onChangeText={text => this.setState({ ip: text })}
                value={this.state.ip}
              />
            </Item>
          </CardItem>
          <CardItem>
            <Button onPress={this._okip}>
              <Text>Confirmar</Text>
            </Button>
          </CardItem>
          <CardItem>
            <Text>Preencher com ex:</Text>
            <Text>servidor.com.br ou 127.0.0.1</Text>
            <Text> ou caso tenha porta</Text>
            <Text>servidor.com.br:porta ou 127.0.0.1:porta</Text>
          </CardItem>
        </ScrollView>
      </Card>
    );
  };

  render() {
    return this.ipconfig();
  }
}
