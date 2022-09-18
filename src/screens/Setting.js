import React, { useState, useEffect } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { DatabaseConnection } from '../database/database-connection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Profile from '../components/Profile';

const db = DatabaseConnection.getConnection();

const Setting = ({ navigation }) => {
  const [userId, setUserId] = useState("")
  const [oldPass, setOldpass] = useState('');
  const [enteredOldpass, setEnteredoldpass] = useState('');
  const [newPass, setNewpass] = useState('');

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (userId.length > 0) {
      getData()
    }
  }, [userId])

  // METHOD TO SHOW ALERT
  const showAlert = (title, message) =>
    Alert.alert(title, message, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);

  const getUser = async () => {
    try {
      const value = await AsyncStorage.getItem('@userId')
      console.log("userId = " + value)
      if (value !== null) {
        setUserId(value)
      }
    } catch (e) {
      // error reading value
    }
  }

  const getData = () => {
    let query = 'SELECT * FROM Users WHERE ID = ' + userId;
    console.log(query);
    try {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM Users WHERE ID = ' + userId,
          [],
          (tx, results) => {
            var len = results.rows.length;
            console.log('Result Length = ' + len);
            if (len > 0) {
              let userPass = results.rows.item(0).Password;
              setOldpass(userPass);
            } else {
              Alert.alert('Data tidak ditemukan!');
            }
          }
        );
      });
    } catch (error) {
      Alert.alert('Terjadi kesalahan saat mendapatkan data!');
      console.log(error);
    }
  };

  const updatePassword = async () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE Users SET Password = ? WHERE ID = ?',
          [newPass, userId],
          () => {
            showAlert('Sukses!', 'Password berhasil diubah.');
          },
          (error) => {
            console.log(error);
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  function submitTapped() {
    if (enteredOldpass.length > 0 && newPass.length > 0) {
      if (enteredOldpass == oldPass) {
        if (newPass.length >= 4) {
          updatePassword();
        } else {
          Alert.alert('Password baru harus terdiri dari minimal 4 karakter');
        }
      } else {
        Alert.alert('Password lama salah!');
      }
    } else {
      Alert.alert('Mohon isi seluruh field!');
    }
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Pengaturan</Text>
      <Text style={styles.formText}>Ganti Password</Text>
      <View
        style={{
          alignSelf: 'flex-start',
          marginTop: 10,
          margin: 10,
          width: '95%',
        }}>
        <Text style={styles.labelText}>Password Saat Ini</Text>
        <TextInput
          mode="outlined"
          label="Password Saat Ini"
          placeholder="Password Saat Ini"
          returnKeyType="next"
          blurOnSubmit={false}
          secureTextEntry={true}
          style={styles.inputStyles}
          value={enteredOldpass}
          onChangeText={(enteredOldpass) => setEnteredoldpass(enteredOldpass)}
        />
      </View>
      <View
        style={{
          alignSelf: 'flex-start',
          marginTop: 10,
          margin: 10,
          width: '95%',
        }}>
        <Text style={styles.labelText}>Password Baru</Text>
        <TextInput
          mode="outlined"
          label="Password Baru"
          placeholder="Password Baru"
          returnKeyType="next"
          blurOnSubmit={false}
          secureTextEntry={true}
          style={styles.inputStyles}
          value={newPass}
          onChangeText={(newPass) => setNewpass(newPass)}
        />
      </View>
      <TouchableOpacity style={styles.btnSuccess} onPress={submitTapped}>
        <Text style={styles.btnLabel}>Simpan</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.btnDanger}>
        <Text style={styles.btnLabel}>&lt;&lt; Kembali</Text>
      </TouchableOpacity>
      <View
        style={{
          marginBottom: 20,
          padding: 10,
          flexDirection: 'row',
          position: 'absolute',
          bottom: 0,
        }}>
        <Profile />
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.headerText}>About this App</Text>
          <Text style={styles.captionText}>Aplikasi ini dibuat oleh:</Text>
          <Text style={styles.captionText}>Nama: Vivi Agustina Ratnasari</Text>
          <Text style={styles.captionText}>NIM: 1841720152</Text>
          <Text style={styles.captionText}>Tanggal: 17 Oktober 2022</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Setting;

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
  formText: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
  labelText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputStyles: {
    paddingLeft: 10,
    height: 40,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  captionText: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  btnSuccess: {
    width: '95%',
    height: 40,
    backgroundColor: '#5cb85c',
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDanger: {
    width: '95%',
    height: 40,
    backgroundColor: '#d9534f',
    margin: 10,
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
