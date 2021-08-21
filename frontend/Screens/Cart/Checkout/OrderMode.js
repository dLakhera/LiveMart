import React, { useState } from 'react'
import {
    View, Button,
    Container,
    Header,
    Content,
    ListItem,
    Text,
    Radio,
    Right,
    Left,
    Body,
    Title
} from 'native-base';
import EasyButton from '../../../Shared/StyledComponents/EasyButton';
const methods = [
    { name: 'Online', value: 'Online' },
    { name: 'Offline', value: 'Offline' },
]

const Payment = (props) => {

    const order = props.route.params;

    const [selected, setSelected] = useState();
    return (
        <Container>
            <Header>
                <Body>
                    <Title>Choose your Order Mode</Title>
                </Body>
            </Header>
            <Content>
                {methods.map((item, index) => {
                    return (
                        <ListItem key={item.name} onPress={() => setSelected(item.value)}>
                            <Left>
                                <Text>{item.name}</Text>
                            </Left>
                            <Right>
                                <Radio selected={selected == item.value} />
                            </Right>
                        </ListItem>
                    )
                })}
                <View style={{ marginTop: 60, alignSelf: 'center' }}>
                    <EasyButton
                        primary large
                        onPress={() => {
                            order.order.orderType = selected;
                            props.navigation.navigate("Confirm", { order })
                        }} ><Text>Confirm</Text></EasyButton>
                </View>
            </Content>
        </Container>
    )
}

export default Payment;