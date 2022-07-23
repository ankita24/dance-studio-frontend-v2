import React from 'react'
import { Image, View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'
import { cloudinaryUrl } from '../utils'

export default function UploadImage({
  receiveImage,
  squared,
  image,
  addMore,
}: {
  receiveImage: (data: string) => void
  squared?: boolean
  image?: string
  addMore?: boolean
}) {
  const addImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: !!squared,
    })
    if (result.cancelled) {
      return
    }

    if (!result.cancelled) {
      let localUri = result.uri
      let filename = localUri.split('/').pop()
      let formData = new FormData()
      const uri = result.uri
      const type = result.type
      const name = filename
      const size = result.height
      const source = {
        uri,
        type,
        name,
        size,
      }
      formData.append('file', source as any)
      formData.append('upload_preset', 'tavlkdbq')
      axios
        .post<{ public_id: string }>(
          'https://api.cloudinary.com/v1_1/ankitadancestudio/upload',
          formData,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        .then(res => {
          receiveImage(res.data.public_id)
        })
        .catch(e => {
          console.error(e.message)
        })
    }
  }

  return (
    <View
      style={[
        imageUploaderStyles.container,imageUploaderStyles.border,
        squared ? null : imageUploaderStyles.circular,
      ]}
    >
      {!!image ? (
        <Image
          source={{ uri: cloudinaryUrl(image) }}
          style={{ width: 100, height: 100, borderRadius: !squared ? 50 : 0 }}
        />
      ) : (
        <TouchableOpacity
          onPress={addImage}
          style={imageUploaderStyles.uploadBtn}
        >
          {!addMore ? (
            <AntDesign name='camera' size={20} color='#FF7083' />
          ) : (
            <View>
              <MaterialIcons name='add-to-photos' size={30} color='#FF7083' />
              <Text>Add More</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  )
}

const imageUploaderStyles = StyleSheet.create({
  container: {
    elevation: 2,
    height: 90,
    width: 90,
    display: 'flex',
    justifyContent: 'center',
    alignSelf:'center',
    marginTop:16,
    marginLeft:-51
  },
  circular: {
    borderRadius: 999,
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border:{
    backgroundColor:'#fff',
    borderWidth:1,
    borderColor:'#FF7083',
    borderRadius:8,
  }
})
