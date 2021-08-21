import { ListItem } from 'native-base';
import React, { Component, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

const FilterButton = ({ callback, text, id, selectedIndex }) => {
	const clicked = selectedIndex === id;
	return (
		<ScrollView
			bounces={true}
			horizontal={true}
			// style={{ backgroundColor: "#f2f2f2" }}
			>
			<TouchableOpacity
				style={[
					{ borderRadius: 20, borderColor: 'black', borderWidth: 2, padding: 10, margin: 5 },
					{ backgroundColor: clicked ? 'black' : 'white' },
				]}
				onPress={() => {
					callback(id);
				}}>
				<Text style={{ color: clicked ? 'white' : 'black' }}>
					{text}
				</Text>
			</TouchableOpacity>
		</ScrollView>

	);
};

class Filter extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedIndex: Number
		};

	}

	render() {
		return (
			<View style={{ flexDirection: 'row' }}>
				{this.props.data.map((x, i) => (
					<ListItem key={i}>
						<FilterButton
							text={x.title}
							id={i}
							selectedIndex={this.state.selectedIndex}
							callback={(id) => {
								this.setState({ selectedIndex: id });
								if (this.props.onValueChange) {
									this.props.onValueChange(id);
								}
							}}
						/>
					</ListItem>
				))}
			</View>
		);
	}
};


export default Filter;
