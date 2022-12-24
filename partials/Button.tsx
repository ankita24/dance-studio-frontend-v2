import React from 'react'
import {
    Text,
    TouchableHighlight,
    Button as IosButton,
    Platform,
    GestureResponderEvent,
} from 'react-native'

export default function Button({ onPress, touchOpacityStyles, androidButtonStyled, color, title, disabled }: {
    onPress: (event: GestureResponderEvent) => void, touchOpacityStyles?: object, androidButtonStyled?: object, color: string, title: string, disabled?: boolean
}) {
    return (
        <TouchableHighlight style={touchOpacityStyles}>
            {Platform.OS === 'android' ? (
                <Text
                    style={androidButtonStyled}
                    onPress={onPress}
                >
                    {title}
                </Text>
            ) : (
                <IosButton
                    title={title}
                    color={color}
                    onPress={onPress}
                    disabled={disabled}
                />
            )}
        </TouchableHighlight>

    )
}

