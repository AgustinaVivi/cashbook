import React, { Component, useState, useEffect } from 'react';
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
  StyleSheet,
} from 'react-native';
import Logo from '../components/Logo';
import { DatabaseConnection } from '../database/database-connection';
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = DatabaseConnection.getConnection();

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    createTable();
    firstTime();
    checkLoginStatus();
    setUsername('');
    setPassword('');
  }, []);

  //METHOD TO CREATE TABLE
  const createTable = () => {
    db.transaction((txn) => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Users'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS Users', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS ' +
          'Users ' +
          '(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Username TEXT, Email TEXT, Password TEXT);',
              []
            );
            console.log('Table Users Created');
          }
        }
      );
    });
  };

  const addData = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO Users (Name, Username, Email, Password) VALUES ('User','user','user@mail.com','user')",
          [],
          (tx, results) => {
            console.log('Data added');
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const firstTime = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Users",
          [],
          (tx, results) => {
            var len = results.rows.length;
            if (len == 0) {
              console.log("User default ditambahkan");
              addData();
            } else {
              console.log("User sudah ada");
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };
  //METHOD TO CHECK IF THE USER ID ALREADY EXISTS
  const getData = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Users WHERE Username = '" +
            username +
            "' AND Password = '" +
            password +
            "'",
          [],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              console.log(results.rows.item(0));
              storeLogin('true');
              storeId(results.rows.item(0).ID);
              navigation.navigate('Home');
            } else {
              Alert.alert('User atau Password salah!');
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const storeLogin = async (value) => {
    try {
      await AsyncStorage.setItem('@login', value);
    } catch (e) {
      // saving error
    }
  };

  const storeId = async (userId) => {
    try {
      await AsyncStorage.setItem('@userId', userId.toString());
    } catch (e) {
      // saving error
    }
  };

  const checkLoginStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('@login');
      if (value !== null) {
        // value previously stored
        if (value == 'true') {
          navigation.navigate('Home');
        }
      }
    } catch (e) {
      // error reading value
    }
  };

  function loginTapped() {
    console.log('Login tapped');
    console.log('username =>' + username);
    console.log('Password =>' + password);
    getData();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.container}>
        <Logo />
        <Text style={styles.titleText}>CashBook</Text>
        <TextInput
          value={username}
          onChangeText={(username) => setUsername(username)}
          placeholder={'Username'}
          style={styles.input}
          keyboardType="default"
          onSubmitEditing={Keyboard.dismiss}
          returnKeyType="next"
        />
        <TextInput
          value={password}
          onChangeText={(password) => setPassword(password)}
          placeholder={'Password'}
          secureTextEntry={true}
          style={styles.input}
          keyboardType="default"
          onSubmitEditing={Keyboard.dismiss}
          returnKeyType="next"
        />
        <Button title={'Login'} style={styles.input} onPress={loginTapped} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  titleText: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'black',
    marginBottom: 20,
  },
});
