//This is an example code for NavigationDrawer//
import React, { Component } from "react";
//import react in our code.
import { StyleSheet, View, Switch, Image } from "react-native";
import {
  Input,
  Button,
  Text,
  Item,
  Icon,
  Textarea,
  Picker,
  Card,
  CardItem,
  Right,
  Thumbnail,
  Accordion
} from "native-base";
import { ScrollView } from "react-native-gesture-handler";
import { SQLite } from "expo-sqlite";
import BarcodeScanner from "./BarcodeScanner";
import PhotoCamera from "./PhotoCamera";
import config from "../config";
import {
  getcentrocusto,
  setmatcentrocusto,
  getcentrocustofiltrado
} from "../database";
// import Icon from "react-native-vector-icons/dist/FontAwesome";
// import all basic components

export default class BuscarBem extends Component {
  constructor(props) {
    super(props);
    photo = Image.resolveAssetSource(require("../images/foto.png"));
    this.state = {
      dados: {
        id: null,
        codigo: null,
        descricao: null,
        produto_descricao: null,
        sigla: null,
        switchValue: false,
        ccusto: null
      },
      filter: null,
      display_bem: { display: "none" },
      barcode: false,
      bemnaoencontrado: false,
      observacao: null,
      fakephoto: photo.uri,
      uri: photo.uri,
      photo: false
    };
    this.db = SQLite.openDatabase(
      config.database.name,
      config.database.version,
      config.database.description,
      config.database.size
    );
  }

  retbarcode = e => {
    this.setState({ filter: e, barcode: false });
    this.getbens();
    this.trocarccusto(global.mat_centro_custo);
  };

  gravarobs = () => {
    this.db.transaction(
      txn => {
        txn.executeSql(
          "INSERT INTO ptr_bem (codigo,obs,mat_centro_custo,encontado) values (cast(? as int),?,?,true);",
          [this.state.filter, this.state.observacao, global.mat_centro_custo],
          (tx, results) => {}
        );
      },
      e => {
        console.log(e);
      }
    );
  };

  // async componentDidMount() {}
  toggleSwitch = value => {
    that = this;
    this.db.transaction(txn => {
      txn.executeSql(
        "update ptr_bem set encontrado = ? where id = ?",
        [value ? "true" : "false", that.state.dados.id],
        (tx, results) => {}
      );
    });
    this.setState({
      dados: {
        id: this.state.dados.id,
        codigo: this.state.dados.codigo,
        descricao: this.state.dados.descricao,
        produto_descricao: this.state.dados.produto_descricao,
        sigla: this.state.dados.sigla,
        switchValue: value,
        ccusto: this.state.dados.ccusto
      }
    });
  };

  trocarccusto = value => {
    console.log(value);
    this.db.transaction(
      txn => {
        txn.executeSql(
          "update ptr_bem set encontrado = ?, mat_centro_custo = ? where id = ?",
          ["true", value, this.state.dados.id],
          (tx, results) => {}
        );
      },
      e => {
        console.log(e);
      }
    );
    this.setState({
      dados: {
        id: this.state.dados.id,
        codigo: this.state.dados.codigo,
        descricao: this.state.dados.descricao,
        produto_descricao: this.state.dados.produto_descricao,
        sigla: this.state.dados.sigla,
        switchValue: true,
        ccusto: value
      },
      uri: this.state.uri
    });
  };

  getbens = () => {
    that = this;
    this.db.transaction(
      txn => {
        txn.executeSql(
          "select b.id,b.codigo,b.descricao,b.produto_descricao,m.sigla," +
            "b.mat_centro_custo,encontrado,b.obs,b.photo " +
            " from ptr_bem b " +
            " left join mat_centro_custo m on m.id = b.mat_centro_custo " +
            " where b.codigo != 'SBM' and cast(b.codigo as int) = cast(? as int)",
          [this.state.filter],
          function(tx, res) {
            var len = res.rows.length;
            if (len == 0) {
              that.setState({ bemnaoencontrado: true });
            } else {
              that.setState({ bemnaoencontrado: false });
            }
            for (let i = 0; i < len; i++) {
              let row = res.rows.item(i);
              if (row.obs !== null) {
                that.setState({ bemnaoencontrado: true, observacao: row.obs });
              } else {
                uri = row.photo ? row.photo : that.state.fakephoto;
                that.setState({
                  dados: {
                    id: row.id,
                    codigo: row.codigo,
                    descricao: row.descricao,
                    produto_descricao: row.produto_descricao,
                    sigla: row.sigla,
                    switchValue: row.encontrado == "true" ? true : false,
                    ccusto: row.mat_centro_custo
                  },
                  uri: uri,
                  display_bem: null,
                  photo: false
                });
              }
            }
          }
        );
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

  getbarcode = () => {
    this.setState({
      dados: {
        id: null,
        codigo: null,
        descricao: null,
        produto_descricao: null,
        sigla: null,
        switchValue: false,
        ccusto: null
      },
      barcode: true,
      photo: false
    });
  };

  retphoto = (photo, base64) => {
    if (photo == "" && this.state.fakephoto === this.state.uri) {
      photo = this.state.fakephoto;
    } else if (photo == "" && this.state.fakephoto !== this.state.uri) {
      photo = this.state.uri;
    }
    this.db.transaction(
      txn => {
        txn.executeSql("update ptr_bem set photo = ? where id = ?", [
          photo,
          this.state.dados.id
        ]);
      },
      e => {
        console.log(e);
      }
    );
    this.setState({
      dados: {
        id: this.state.dados.id,
        codigo: this.state.dados.codigo,
        descricao: this.state.dados.descricao,
        produto_descricao: this.state.dados.produto_descricao,
        sigla: this.state.dados.sigla,
        switchValue: this.state.dados.switchValue,
        ccusto: this.state.dados.ccusto
      },
      photo: false,
      uri: photo,
      ccustoglobal: null,
      ccustoglobalsigla: "a Trabalhar"
    });
    // this.getbens();
  };

  getphoto = () => {
    this.setState({
      photo: true
    });
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

  _trocarccustotrabalho = valor => {
    global.mat_centro_custo = valor;
    setmatcentrocusto(valor);
  };

  _getglobalcusto = () => {
    let acorditem;
    getcentrocusto()
      .then(dados => {
        acorditem = (
          <View>
            <Picker
              selectedValue={parseInt(global.mat_centro_custo)}
              onValueChange={this._trocarccustotrabalho}
            >
              <Picker.Item
                label="Selecione um centro de custo"
                value="0"
                key="0"
              />
              {this.loadccusto(dados)}
            </Picker>
          </View>
        );
        this.setState({ cardccusto: acorditem });
      })
      .catch(e => {
        console.log(e);
      });
    return this.state.cardccusto;
  };

  _seletormatcentrocustoform = () => {
    getcentrocustofiltrado(parseInt(global.mat_centro_custo))
      .then(linha => {
        this.setState({ ccustoglobalsigla: linha.sigla });
      })
      .catch(e => {});
    return (
      <Accordion
        dataArray={[
          {
            title: "Centro de Custo " + this.state.ccustoglobalsigla,
            content: " um treco"
          }
        ]}
        expanded={global.mat_centro_custo ? null : 0}
        renderContent={this._getglobalcusto}
      />
    );
  };

  _topview = () => {
    return (
      <Card>
        <CardItem header bordered>
          {this._seletormatcentrocustoform()}
        </CardItem>
        <CardItem style={{ paddingBottom: 0 }}>
          <Item>
            <Icon name="ios-search" />
            <Input
              placeholder="Buscar Bem"
              keyboardType="numeric"
              onChangeText={text => this.setState({ filter: text })}
              value={this.state.filter}
            />
            <Button onPress={this.getbarcode} transparent>
              <Icon name="md-barcode" />
            </Button>
          </Item>
        </CardItem>
        <CardItem style={{ paddingTop: 0 }}>
          <Button transparent onPress={this.getbens}>
            <Text>Buscar</Text>
          </Button>
        </CardItem>
      </Card>
    );
  };

  _casdastrobemform = () => {
    return (
      <View style={styles.MainContainer}>
        {this._topview()}
        <Card>
          <CardItem bordered>
            <ScrollView>
              <Text>Tombamento desconhecido</Text>
              <Text>
                Registre caracteristicas para posterior{"\n"}Incorporação:
              </Text>
              <Item>
                <Icon name="ios-information-circle-outline" />
                <Textarea
                  rowSpan={5}
                  placeholder="Observação"
                  onChangeText={text => this.setState({ observacao: text })}
                  value={this.state.observacao}
                />
              </Item>
              <Button transparent onPress={this.gravarobs}>
                <Text>OK</Text>
              </Button>
            </ScrollView>
          </CardItem>
        </Card>
      </View>
    );
  };

  _exibebemform = () => {
    return (
      <View style={styles.MainContainer}>
        <ScrollView>
          {this._topview()}
          <Card key={this.state.dados.id} style={this.state.display_bem}>
            <CardItem bordered>
              <Button onPress={this.getphoto} transparent>
                <Thumbnail source={{ uri: this.state.uri }} bordered />
              </Button>
              <Text>
                {"   "}Tombamento: {this.state.dados.codigo}
              </Text>
            </CardItem>
            <CardItem>
              <Text>
                Descrição do Bem:{"\n  "}
                {this.state.dados.descricao}
              </Text>
            </CardItem>
            <CardItem>
              <Text>
                Descrição do Produto:{"\n  "}
                {this.state.dados.produto_descricao}
              </Text>
            </CardItem>
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
                selectedValue={this.state.dados.ccusto}
                onValueChange={this.trocarccusto}
              >
                {this.loadccusto(this.state.ccusto)}
              </Picker>
            </CardItem>
            <CardItem>
              <Text>
                {this.state.dados.switchValue ? "Encontrado" : "Não Encontrado"}
              </Text>
              <Right>
                <Switch
                  value={this.state.dados.switchValue}
                  onValueChange={this.toggleSwitch}
                />
              </Right>
            </CardItem>
          </Card>
        </ScrollView>
      </View>
    );
  };

  //Screen1 Component
  render() {
    if (this.state.barcode !== false) {
      return (
        <BarcodeScanner
          navigation={this.props.navigation}
          returnCode={this.retbarcode}
        />
      );
    } else if (this.state.photo !== false) {
      return (
        <PhotoCamera
          navigation={this.props.navigation}
          states={this.state}
          returnCode={this.retphoto}
        />
      );
    } else if (this.state.bemnaoencontrado !== false) {
      return this._casdastrobemform();
    } else {
      return this._exibebemform();
    }
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: 2,
    marginLeft: 10,
    marginRight: 10
  },
  Labels: {
    color: "#c6c6c6"
  }
});
