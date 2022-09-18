import React, { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { DatabaseConnection } from '../database/database-connection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Income from '../components/Income';
import Outcome from '../components/Outcome';
import Cashflow from '../components/Cashflow';
import Setting from '../components/Setting';
import Linechart from '../components/Linechart';

const db = DatabaseConnection.getConnection();

const Home = ({ navigation }) => {
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [monthlyExpense, setMonthlyExpense] = useState([]);
  const [pemasukan, setPemasukan] = useState(null);
  const [pengeluaran, setPengeluaran] = useState(null);
  var month = new Date().getMonth() + 1; //To get the Current Month
  var year = new Date().getFullYear(); //To get the Current Year
  var now;
  if (month < 10) {
    now = year + '-0' + month;
  } else {
    now = year + '-' + month;
  }

  useEffect(() => {
    createTable();
    getIncome();
    getOutcome();
    getIncomeData();
    getExpenseData();
  });

  const createTable = () => {
    db.transaction((txn) => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Finance'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS Finance', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Finance(id INTEGER PRIMARY KEY AUTOINCREMENT, nominal INT(12), desc TEXT, type TEXT, created_at TEXT)',
              []
            );
            console.log('Table Transaction Created');
          }
        }
      );
    });
  };

  const showAlert = (title, message) =>
    Alert.alert(title, message, [
      { text: 'OK', onPress: () => navigation.popToTop() },
      { text: 'Cancel' },
    ]);

  const getData = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM Finance', [], (tx, results) => {
          var len = results.rows.length;
          console.log('Result Length = ' + len);
          if (len > 0) {
            console.log(results.rows.item(0));
          } else {
            console.log('No data');
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getIncome = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT SUM(nominal) AS jumlah, type FROM Finance WHERE created_at LIKE '" +
            now +
            "%' AND type = 'income' GROUP BY type",
          [],
          (tx, results) => {
            var len = results.rows.length;
            console.log('Result = ' + len);
            if (len > 0) {
              let sumIncome = results.rows.item(0).jumlah;
              setPemasukan(sumIncome);
              console.log(pemasukan);
            } else {
              console.log('Data tidak ditemukan!');
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getOutcome = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT SUM(nominal) As jumlah, type FROM Finance WHERE created_at LIKE '" +
            now +
            "%' AND type = 'outcome' GROUP BY type",
          [],
          (tx, results) => {
            var len = results.rows.length;
            console.log('Result = ' + len);
            if (len > 0) {
              let sumOutcome = results.rows.item(0).jumlah;
              setPengeluaran(sumOutcome);
            } else {
              console.log('Data tidak ditemukan!');
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  function logoutTapped() {
    storeLogin('false');
    showAlert('Alert', 'Apakah anda yakin untuk keluar ?');
  }

  const storeLogin = async (value) => {
    try {
      await AsyncStorage.setItem('@login', value);
    } catch (e) {
      // saving error
    }
  };

  const getIncomeData = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT nominal, created_at FROM Finance WHERE created_at LIKE '` +
            now +
            `%' AND type = 'income' ORDER BY created_at ASC`,
          [],
          (tx, results) => {
            var transactions = [];
            for (let index = 0; index < results.rows.length; index++) {
              const item = results.rows.item(index);
              transactions.push({
                value: item.nominal,
                label: item.created_at,
              });
              setMonthlyIncome(transactions);
            }
          }
        );
      });
    } catch (error) {
      console.error(error);
      throw Error('Failed to get Income data...');
    }
  };

  const getExpenseData = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT nominal, created_at FROM Finance WHERE created_at LIKE '` +
            now +
            `%' AND type = 'outcome' ORDER BY created_at ASC`,
          [],
          (tx, results) => {
            var transactions = [];
            for (let index = 0; index < results.rows.length; index++) {
              const item = results.rows.item(index);
              transactions.push({
                value: item.nominal,
                label: item.created_at,
              });
              setMonthlyExpense(transactions);
            }
          }
        );
      });
    } catch (error) {
      console.error(error);
      throw Error('Failed to get Income data...');
    }
  };

  const loadDataCallback = useCallback(async () => {
    try {
      
    } catch (error) {
      console.error('transaction list err: ', error);
    }
  });

  const hasIncomeExpense =
    monthlyIncome.length > 0 || monthlyExpense.length > 0;

  const lineChartLegends = [
    {
      name: 'Pemasukan',
      color: '#5cb85c',
    },
    {
      name: 'Pengeluaran',
      color: '#d9534f',
    },
  ];

  const datasets = [];
  if (monthlyIncome.length > 0) {
    datasets.push({
      data: monthlyIncome.map((item) => item.value),
      color: (opacity = 1) => '#5cb85c',
      strokeWidth: 2,
    });
  }

  if (monthlyExpense.length > 0) {
    datasets.push({
      data: monthlyExpense.map((item) => item.value),
      color: (opacity = 1) => '#d9534f',
      strokeWidth: 2,
    });
  }

  const chartData = {
    labels: monthlyIncome.map((item) => item.label),
    datasets,
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Rangkuman Bulan Ini</Text>
      <Text style={styles.outcomeText}>
        Pengeluaran Bulan Ini : Rp. {pengeluaran}
      </Text>
      <Text style={styles.incomeText}>
        Pemasukan Bulan Ini : Rp. {pemasukan}
      </Text>
      <ScrollView>
        {hasIncomeExpense && (
          <Linechart
            title="Grafik Pemasukan dan Pengeluaran"
            chartData={chartData}
            fillShadowGradient="#ccc"
            legend={lineChartLegends}
          />
        )}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Income')}>
            <Income />
            <Text style={styles.iconText}>Tambah Pemasukan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Outcome')}>
            <Outcome />
            <Text style={styles.iconText}>Tambah Pengeluaran</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Cashflow')}>
            <Cashflow />
            <Text style={styles.iconText}>Detail Cash Flow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Setting')}>
            <Setting />
            <Text style={styles.iconText}>Pengaturan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={logoutTapped} style={styles.btnDanger}>
        <Text style={styles.btnLabel}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;

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
  incomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5cb85c',
    marginTop: 10,
  },
  outcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d9534f',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#859a9b',
    borderRadius: 20,
    width: 140,
    height: 140,
    padding: 10,
    margin: 10,
    shadowColor: '#303838',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
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
