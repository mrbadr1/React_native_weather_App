// styles.js
import { StyleSheet } from 'react-native';

const HomeScreenStyles = StyleSheet.create({
  inputContainer: {
    width: '80%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Exo-Bold',
    textAlign: 'center',
    
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFB0D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#1E1E1E',
    fontFamily: 'Exo-Bold',
  },
});

export default HomeScreenStyles;
