import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import MapView from 'react-native-maps';


var { width } = Dimensions.get('window');

const MyMapView = (props) => {
    const [mapReady, setMapReady] = useState(false);

    const handleMapReady = () => {
        setMapReady(true)
    }

    return (
        <MapView
            style={{ flex: 1}}
            region={props.region}
            showsUserLocation={true}
            onMapReady={handleMapReady}
            onRegionChange={(reg) => props.onRegionChange(reg)}>
            {mapReady &&
                <MapView.Marker
                    coordinate={props.region} />
            }

        </MapView>
    )
}
export default MyMapView;