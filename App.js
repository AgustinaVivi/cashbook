import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Income from './src/screens/Income';
import Outcome from './src/screens/Outcome';
import Cashflow from './src/screens/Cashflow';
import Setting from './src/screens/Setting';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Income" component={Income} />
        <Stack.Screen name="Outcome" component={Outcome} />
        <Stack.Screen name="Cashflow" component={Cashflow} />
        <Stack.Screen name="Setting" component={Setting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
