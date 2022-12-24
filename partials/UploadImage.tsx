import React, { useState } from 'react'
import { Image, View, TouchableOpacity, StyleSheet } from 'react-native'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'
import { cloudinaryUrl } from '../utils'
import Loader from './Loader'

export default function UploadImage({
  receiveImage,
  squared,
  image,
  addMore,
  edit,
}: {
  receiveImage: (data: string) => void
  squared?: boolean
  image?: string
  addMore?: boolean
  edit?: boolean
}) {
  const [loading, setLoading] = useState(false)
  const addImage = async () => {
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
    })
    if (result.cancelled) {
      return
    }

    if (!result.cancelled) {
      setLoading(true)
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
        }).finally(() => {
          setLoading(false)
        })
    }
  }

  return (
    <View
      style={[
        imageUploaderStyles.container,
        imageUploaderStyles.border,
        squared ? null : imageUploaderStyles.circular,
      ]}
    >
      {!!image ? (
        <TouchableOpacity
          onPress={() => {
            if (edit) addImage()
          }}
        >
          <AntDesign
            name='camera'
            size={20}
            color='#FF7083'
            style={imageUploaderStyles.editIcon}
          />
          {loading ? <Loader /> :
            <Image
              source={{ uri: cloudinaryUrl(image) }}
              style={{
                width: 90,
                height: 90,
                borderRadius: !squared ? 50 : 0,
                opacity: edit ? 0.2 : 1,
                marginBottom: 20,
              }}

            />}
        </TouchableOpacity>
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
              {/* <Text>Add More</Text> */}
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
    alignSelf: 'center',
    marginTop: 16,
    marginLeft: -51,
  },
  circular: {
    borderRadius: 999,
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF7083',
    borderRadius: 8,
  },
  editIcon: {
    display: 'flex',
    alignSelf: 'center',
    top: '43%',
  },
})
