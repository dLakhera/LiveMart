import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

class MapInput extends React.Component {

    render() {

        return (

            <GooglePlacesAutocomplete

                placeholder='Search'

                minLength={3}

                autoFocus={true}

                returnkeyType={'search'}
                listViewDisplayed={'auto'}

                fetchDetails={true}
                styles={{
                    textInputContainer: {
                        backgroundColor: 'grey',
                    },
                    textInput: {
                        height: 38,
                        color: '#5d5d5d',
                        fontSize: 16,
                    },
                    predefinedPlacesDescription: {
                        color: '#1faadb',
                    },
                }}

                autoFillOnNotFound={true}
                
                onPress={(data, details = null) => {
                    console.log(data, details);
                    this.props.notifyChange(details.geometry.location);
                }}
                query={{
                    key: 'AIzaSyCSJg197HNnhk43JQCdkan-AXbtojffOnU',
                    language: 'en',
                    components: 'country:in',
                }}
                onFail={error => console.error("Googleplace API ERROR", error)}

                nearbyPlacesAPI='GooglePlacesSearch'

                debounce={200}
                currentLocation={true}
                currentLocationLabel='Current location'

            />
        );
    }
}

export default MapInput;