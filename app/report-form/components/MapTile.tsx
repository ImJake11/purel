import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api"


const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    backgroundColor: "red",
};


interface mapProps {
    lat: number,
    lng: number,
}
export default function MapTile({ data }: { data: mapProps }) {


    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyCrMfOvySRqZHimAJPnjzFvNkD5CnKOR_c", // Replace with your API key
    });



    if (loadError)
        return (
            <div className="text-sm text-red-500 text-center">Failed to load map</div>
        );

    if (!isLoaded)
        return (
            <div className="text-sm text-gray-500 text-center">Loading map...</div>
        );

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={data}
            zoom={15}
            options={{ disableDefaultUI: true }}
        >
            <Marker position={data} />
        </GoogleMap>
    );
}