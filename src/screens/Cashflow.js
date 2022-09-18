import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { DatabaseConnection } from '../database/database-connection';
import IncomeIcon from '../components/IncomeIcon';
import OutcomeIcon from '../components/OutcomeIcon';

const db = DatabaseConnection.getConnection();

const Cashflow = ({ navigation }) => {
  let [flatListItems, setFlatListItems] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM finance ORDER BY created_at DESC',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
        }
      );
    });
  }, []);

  let listItemView = (item) => {
    return (
      <View
        key={item.id}
        style={{
          backgroundColor: '#EEE',
          marginTop: 8,
          padding: 20,
          borderRadius: 10,
          flexDirection: 'row',
        }}>
        <View style={{ flexDirection: 'column' }}>
          {item.type == 'income' ? (
            <Text style={styles.headerText}>(+) Rp. {item.nominal}</Text>
          ) : (
            <Text style={styles.headerText}>(-) Rp. {item.nominal}</Text>
          )}
          <Text style={styles.labelText}>{item.desc}</Text>
          <Text style={styles.captionText}>{item.created_at}</Text>
        </View>
        {item.type == 'income' ? <IncomeIcon /> : <OutcomeIcon />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Detail Cash Flow</Text>
      <View style={{ flex: 1, backgroundColor: 'white', width: '100%' }}>
        <View style={{ flex: 1 }}>
          <FlatList
            style={{ marginTop: 10 }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            data={flatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.btnDanger}>
        <Text style={styles.btnLabel}>&lt;&lt; Kembali</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Cashflow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
  },
  labelText: {
    color: '#111',
    fontSize: 14,
    fontWeight: '500',
  },
  captionText: {
    color: '#808080',
    fontSize: 12,
    fontWeight: '700',
  },
  headerText: {
    marginRight: 'auto',
    marginBottom: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  btnDanger: {
    width: '85%',
    height: 40,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#d9534f',
    marginBottom: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
