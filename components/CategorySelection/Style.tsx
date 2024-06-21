import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 40,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 60,
    width: '100%',
  },
  icon: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 18,
    color: 'black',
  },
  categoryButton: {
    width: '100%',
  },
});

export default styles;