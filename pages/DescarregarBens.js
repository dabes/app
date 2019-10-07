import React, { Component } from "react";
import { SQLite } from "expo-sqlite";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "native-base";
import { ScrollView } from "react-native-gesture-handler";
import config from "../config";

export default class DescarregarBens extends Component {
  constructor(props) {
    super(props);
    this.db = SQLite.openDatabase(
      config.database.name,
      config.database.version,
      config.database.description,
      config.database.size
    );
    this.state = {
      carregar: null
    };
  }

  enviarfotos = a => {
    let body = new FormData();
    body.append("photo", {
      uri: a.photo,
      name: a.codigo + ".png",
      filename: a.codigo + ".png",
      type: "image/png"
    });
    // body.append("Content-Type", "image/png");
    fetch("http://" + global.ip + "/api/fotos", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      body: body
    })
      .then(res => console.log(res))
      .catch(e => console.log(e))
      .done();
  };

  postbens = async () => {
    that = this;
    let row = [];
    await this.db.transaction(
      txn => {
        txn.executeSql(
          "select * from ptr_bem  where encontrado is not null or obs is not null",
          [],
          (tx, res) => {
            var len = res.rows.length;
            if (len == 0) {
              that.setState({ carregar: "Sem dados a serem Enviados" });
            } else {
              that.setState({
                carregar: "Enviando " + len + " bens para o servidor"
              });
              for (let i = 0; i < len; i++) {
                row.push(res.rows.item(i));
              }
              rows = JSON.stringify(row);
              fetch("http://" + global.ip + "/api/bens", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: rows
              })
                .then(response => {
                  that.setState({ carregar: "Bens enviados" });
                  row.forEach(a => {
                    this.enviarfotos(a);
                  });
                })
                .catch(error => {
                  console.error(error);
                });
            }
            // console.log(res.rows);
          }
        );
      },
      e => {
        console.log(e);
      }
    );
  };
  render() {
    return (
      <View style={styles.MainContainer}>
        <ScrollView>
          <Text>{this.state.carregar}</Text>
        </ScrollView>
        <Button style={styles.CargaButton} onPress={this.postbens}>
          <Text style={styles.CarregarButtonText}>Descarregar Bens</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: 2,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  CargaButton: {
    // paddingTop: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  CarregarButtonText: {
    color: "#ffffff"
  }
});
