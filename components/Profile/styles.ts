import { StyleSheet, Platform } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignContent: 'center',
  },
  innerContainer: {
    marginLeft: 50,
    marginBottom: 10,
  },
  marginBottom6: {
    marginBottom: 6,
  },
  textStyle: {
    fontSize: 14,
    color: '#030169',
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  flexShrink: {
    flexShrink: 1,
  },
  fontWeight: {
    fontWeight: 'bold',
    marginRight: 6,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  justifyContent: {
    justifyContent: 'space-between',
  },
  containerStyle: {
    alignSelf: 'center',
    marginTop: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF7083',
    borderRadius: 999,
    shadowColor: '#FF7083',
    shadowOpacity: 0.7,
    elevation: 12,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    width: 100,
    height: 100,
    marginRight: 35,
  },
  inputStyle: { height: 20, width: 100 },
  section: {
    width: 320,
    minHeight: 50,
    borderColor: '#FF7083',
    borderRadius: 8,
    alignSelf: 'center',
    shadowColor: '#FF7083',
    shadowOpacity: 0.7,
    backgroundColor: '#fff',
    elevation: 12,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    borderWidth: 1,
    padding: 20,
  },
  marginTop26: {
    marginTop: 25,
  },
  marginLeft28: {
    marginLeft: 28,
  },
  tag: {
    width: 110,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    textAlign: 'center',
  },
  red: {
    backgroundColor: '#FF6F91',
  },
  green: {
    backgroundColor: '#A8A8A8',
  },
  yellow: {
    backgroundColor: '#FFD700',
  },
  marginBottom10: {
    marginBottom: 10,
  },
  listStyle: {
    alignSelf: 'center',
    marginTop: -20,
  },
  marginTop40: {
    marginTop: 40,
  },
  profileText: {
    display: 'flex',
    alignSelf: 'center',
    top: '30%',
    fontSize: 30,
    color: '#030169',
  },
  noImagesText: {
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
  statusText: {
    color: '#fff',
    textAlign: 'center',
  },
  logoutStyle: {
    marginTop: 20,
    paddingBottom: 40,
  },
  imageStyle: {
    marginLeft: 55,
    flexWrap: 'wrap',
    width: 360,
  },
  androidButtonStyles: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    marginLeft: 8,
    color: '#FF7083',
  },
  androidTextInput: {
    marginTop: Platform.OS === 'android' ? -4 : 0,
  },
})
