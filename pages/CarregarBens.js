//This is an example code for NavigationDrawer//
import React, { Component } from "react";
//import react in our code.
import { StyleSheet, View, Text } from "react-native";
import { Button } from "native-base";
// import all basic components
import { SQLite } from "expo-sqlite";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native";
import config from "../config";
// SQLite.DEBUG(true);

function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("timeout"));
    }, ms);
    promise.then(resolve, reject);
  });
}

export default class CarregarBens extends Component {
  state = {
    carregar: (
      <View>
        <Text> </Text>
      </View>
    )
  };
  db = SQLite.openDatabase(
    config.database.name,
    config.database.version,
    config.database.description,
    config.database.size
  );

  getbens = async () => {
    that = this;
    this.setState({
      counter: 0,
      carregar: (
        <View>
          <ActivityIndicator size="large" />
        </View>
      )
    });
    this.db.transaction(txn => {
      txn.executeSql("delete from ptr_bem");
    });
    await timeout(10000, fetch("http://" + global.ip + "/api/bens"))
      .then(response => {
        response.json().then(a => {
          let dados = "";
          let counter = 0;
          let counter_end = a.length;
          a.forEach(obj => {
            this.db.transaction(
              txn => {
                // txn.executeSql("delete from ptr_bem");
                txn.executeSql(
                  "insert into ptr_bem(id,codigo,descricao,mat_centro_custo,grl_entidade,produto_descricao,data_hora)" +
                    "values (?,?,?,?,?,?,?);",
                  [
                    obj.id,
                    obj.codigo,
                    obj.descricao,
                    obj.mat_centro_custo,
                    obj.grl_entidade,
                    obj.produto_descricao,
                    obj.data_hora
                  ],
                  (tx, res) => {
                    counter += 1;
                    this.setState({
                      carregar: (
                        <View>
                          <Text>
                            {counter} de {counter_end} Carregadas
                          </Text>
                        </View>
                      )
                    });
                    // console.log(counter);
                  }
                );
              },
              e => {
                console.log(e);
              }
            );
          });
          this.setState({
            carregar: (
              <View>
                <Text>{this.state.dados} Carregadas</Text>
              </View>
            )
          });
        });
      })
      .catch(event => {
        this.setState({
          carregar: (
            <View>
              <Text>Não foi possivel conectar ao servidor</Text>
            </View>
          )
        });
      });

    await timeout(10000, fetch("http://" + global.ip + "/api/mat"))
      .then(response => {
        response.json().then(a => {
          let dados = "";
          a.forEach(obj => {
            // console.log(obj);
            this.db.transaction(txn => {
              txn.executeSql(
                "insert into mat_centro_custo(id,sigla,descricao,unidade)" +
                  "values (?,?,?,?);",
                [obj.id, obj.sigla, obj.descricao, obj.codigo],
                (tx, res) => {}
              );
            });
          });
          this.setState({
            carregar: (
              <View>
                <Text>{dados}</Text>
              </View>
            )
          });
        });
      })
      .catch(event => {
        this.setState({
          carregar: (
            <View>
              <Text>Não foi possivel conectar ao servidor</Text>
            </View>
          )
        });
      });
  };

  render = () => {
    return (
      <View style={styles.MainContainer}>
        <ScrollView>{this.state.carregar}</ScrollView>
        <Button style={styles.CargaButton} onPress={this.getbens}>
          <Text style={styles.CarregarButtonText}>Carregar Bens</Text>
        </Button>
      </View>
    );
  };
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
