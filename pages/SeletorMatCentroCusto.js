import React, { Component } from "react";
import config from "../config";
import { Text, Picker, CardItem, Card, Button } from "native-base";
import { SQLite } from "expo-sqlite";
import { View } from "react-native";
import { config as configuration } from "react-global-configuration";
import { setmatcentrocusto } from "../database";

class SeletorMatCentroCusto extends Component {
  constructor(props) {
    super(props);
    this.state = { ccusto: null, ccustoselecionado: null };
    this.db = SQLite.openDatabase(
      config.database.name,
      config.database.version,
      config.database.description,
      config.database.size
    );
    this._populate();
  }

  componentDidMount = () => {};

  _populate = async () => {
    await this.db.transaction(
      txn => {
        txn.executeSql("select * from mat_centro_custo", [], (tx, res) => {
          var len = res.rows.length;
          let dados = [];
          for (let i = 0; i < len; i++) {
            let row = res.rows.item(i);
            dados.push({ value: row.id, label: row.sigla });
          }
          this.setState({ ccusto: dados });
        });
      },
      e => {
        console.log(e);
      }
    );
  };

  loadccusto = item => {
    try {
      return item.map(user => (
        <Picker.Item label={user.label} value={user.value} key={user.value} />
      ));
    } catch {
      return <Picker.Item label="" value="" key="0" />;
    }
  };

  trocarccusto = value => {
    this.setState({ ccustoselecionado: value });
    setmatcentrocusto(value);
    global.mat_centro_custo = value;
  };

  _ok = () => {
    this.props.navigation.navigate("Loading");
  };

  render() {
    return (
      <Card>
        <CardItem
          style={{
            paddingBottom: 1
          }}
        >
          <Text>Centro de Custo:</Text>
        </CardItem>
        <CardItem
          style={{
            paddingTop: 1
          }}
        >
          <Picker
            selectedValue={this.state.ccustoselecionado}
            onValueChange={this.trocarccusto}
          >
            <Picker.Item label="" value="" key="0" />
            {this.loadccusto(this.state.ccusto)}
          </Picker>
        </CardItem>
        <CardItem>
          <Button onPress={this._ok}>
            <Text>Selecionar</Text>
          </Button>
        </CardItem>
      </Card>
    );
  }
}

export default SeletorMatCentroCusto;
