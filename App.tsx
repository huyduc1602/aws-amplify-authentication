import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
import { withAuthenticator } from '@aws-amplify/ui-react-native';
import { generateClient } from 'aws-amplify/api';
import Home from './src/screens/Home';

Amplify.configure(amplifyconfig);

const initialState = { name: '', description: '' };
const client = generateClient();

function App() {

  return (
    <View style={styles.container}>
      <Home />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withAuthenticator(App);