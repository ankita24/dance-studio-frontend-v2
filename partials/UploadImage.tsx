import React, { useState, useEffect } from 'react'
import {
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'
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
      formData.append('file', source)
      formData.append('upload_preset', 'tavlkdbq')
      axios
        .post<{public_id:string}>(
          'https://api.cloudinary.com/v1_1/ankitadancestudio/upload',
          formData
        )
        .then(res => {
          receiveImage(res.data.public_id)
        })
        .catch(e => console.error(e.message))
    }
  }

  return (
    <View
      style={[
        imageUploaderStyles.container,
        squared ? null : imageUploaderStyles.circular,
      ]}
    >
      {!!image && (
        <Image
          source={{ uri: cloudinaryUrl(image) }}
          style={{ width: 100, height: 100 }}
        />
      )}

      <View style={imageUploaderStyles.uploadBtnContainer}>
        <TouchableOpacity
          onPress={addImage}
          style={imageUploaderStyles.uploadBtn}
        >
          {!addMore ? (
            <AntDesign name='camera' size={20} color='black' />
          ) : (
            <View>
              <MaterialIcons name='add-to-photos' size={30} color='black' />
              <Text>Add More</Text>
            </View>
          )}
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
    overflow: 'hidden',
  },
  circular: {
    borderRadius: 999,
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
