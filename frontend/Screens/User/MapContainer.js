import React from 'react';
import { View } from "react-native";
import MapInput from './MapInput';
import MyMapView from './MyMapView';
import getLocation from '../../Shared/getLocation'
import Geocoder from 'react-native-geocoding'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

var reg = {
    latitude: 0,
    longitude: 0
}

class MapContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            region: {},
            location: null,
            geocode: null,
            errorMessage: "",
            address: {}
        };
    }

    componentDidMount() {
        this.getInitialState();
    }

    getInitialState() {
        getLocation().then(data => {
            this.updateState({
                latitude: data.latitude,
                longitude: data.longitude
            });
        });
    }
    updateState(location) {
        reg = this.state.region;
        this.setState({
            region: {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003
            },
        });
    }
    getCoordsFromName(loc) {
        this.updateState({
            latitude: loc.lat,
            longitude: loc.lng,
        });
        console.log(lac.lat, loc.lng);
    }

    /*  getLocationAsync = async () => {
         let { status } = await Permissions.askAsync(Permissions.LOCATION);
         if (status !== 'granted') {
             this.setState({
                 errorMessage: 'Permission to access location was denied',
             });
         }
 
         let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
         const { latitude, longitude } = location.coords
         this.getGeocodeAsync({ latitude, longitude })
         this.setState({ location: { latitude, longitude } });
 
     }; */
    onMapRegionChange(region) {
        this.updateState({
            latitude: region.latitude,
            longitude: region.longitude,
        });
        // const { latitude, longitude } = region;
        /*   Location.reverseGeocodeAsync({
              latitude,
              longitude
          }).then((response) => {
              console.log("region", latitude);
              console.log("region", longitude);
              console.log("response", response);
          }).catch((err) => {
              console.log(err)
          }); */
    }

    render() {

        return (

            <View style={{ flex: 1 }}>

                <View style={{ flex: 0.6 }}>

                    <MapInput notifyChange={(loc) => this.getCoordsFromName(loc)}
                    />
                </View>
                {this.state.region['latitude'] ?
                    <View style={{ flex: 1 }}>
                        <MyMapView
                            region={this.state.region}
                            onRegionChange={(reg) => this.onMapRegionChange(reg)}
                        />
                    </View>
                    :
                    null
                }
            </View>

        );
    }
}

function getRegionLatLong() {
    return reg;
}

export { getRegionLatLong, MapContainer };
