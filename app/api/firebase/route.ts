import { storage } from "@/app/lib/firebase/initialize";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

    try {

        const body = await request.json();

        const { image, reportid } = body;


        const filename = `purel-images/${reportid}/${Date.now()}`;
        const imageRef = ref(storage, filename);


        if (!image || !reportid) {
            return NextResponse.json({ success: false, message: "Missing image or report ID" }, { status: 400 });

        }

        const snapshot = await uploadString(imageRef, image, "data_url");

        const url = await getDownloadURL(snapshot.ref);

        return NextResponse.json({ url: url });

    } catch (e) {
        console.log("Error uploading image");
        return NextResponse.json({ success: false, message: "Upload failed" }, { status: 400 });

    }
}