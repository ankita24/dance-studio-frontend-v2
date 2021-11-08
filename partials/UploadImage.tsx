import React, { useState, useEffect } from 'react'
import {
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'

export default function UploadImage({receiveImage}:{receiveImage:(data:string)=>void}) {
  const [image, setImage] = useState<string>('')
  
  const addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    if (result.cancelled) {
      return;
    }

    if (!result.cancelled) {
      let localUri = result.uri;
      let filename = localUri.split('/').pop();
    
      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename ?? '');
      let type = match ? `image/${match[1]}` : `image`;
    
      // Upload the image using the fetch and FormData APIs
      let formData = new FormData();
      // Assume "photo" is the name of the form field the server expects
      formData.append('photo', { uri: localUri, name: filename, type });
      setImage(result.uri)
      axios
      .post(
        'http://192.168.29.91:9999/api/imageUpload',
        formData
      )
      .then((res) => {
        if (res?.data?.status === 'error') {
          Alert.alert(res?.data?.error)
        }
        receiveImage(res.data.data)
      })
      .catch(e => console.log(e))
    }
  }

  return (
    <View style={imageUploaderStyles.container}>
      {!!image && (
        <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
      )}

      <View style={imageUploaderStyles.uploadBtnContainer}>
        <TouchableOpacity
          onPress={addImage}
          style={imageUploaderStyles.uploadBtn}
        >
          <AntDesign name='camera' size={20} color='black' />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const imageUploaderStyles = StyleSheet.create({
  container: {
    elevation: 2,
    height: 100,
    width: 100,
    backgroundColor: '#efefef',
    position: 'relative',
    borderRadius: 999,
    overflow: 'hidden',
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'lightgrey',
    width: '100%',
    height: '25%',
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
