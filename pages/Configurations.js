import React, { Component } from "react";
import config from "../config";
import { ScrollView } from "react-navigation";
import { Text, CardItem, Card, Button, Input, Item, Icon } from "native-base";
import { SQLite } from "expo-sqlite";

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

  componentDidMount = () => {};

  render() {
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
            <Button onPress={this._ok}>
              <Text>Confirmar</Text>
            </Button>
          </CardItem>
        </ScrollView>
      </Card>
    );
  }
}
