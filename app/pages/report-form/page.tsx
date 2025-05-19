"use client";

import Dropdown from "@/app/components/Dropdown";
import "@/app/styles/form.css";
import MapComponent from "@/app/components/MapComponent.";
import { AnimatePresence, motion } from "framer-motion";
import SelectedPhotos from "@/app/components/SelectedPhotos";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { resetData, setImages } from "@/app/lib/redux/formReducer";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { ReportModel } from "@/app/lib/models/ReportModel";
import { ReportType } from "@/app/lib/enum/ReportType";
import Navbar from "@/app/components/NavBar";
import ReportingServices from "@/app/lib/services/ReportingServices";
import "remixicon/fonts/remixicon.css";


export default function Page() {
  const dispatch = useDispatch();

  const [isPinLoc, setPinLoc] = useState(true);

  const formReducer = useSelector((state: RootState) => state.form);
  const [isDataValid, setDataValidation] = useState(false);



  const [reportData, setReportData] = useState<ReportModel>({
    reportType: ReportType.NONE,
    animalType: -1,
    status: -1,
    description: "",
    lat: 0.0,
    lng: 0.0,
    landmark: "",
    images: [],
    contact: "09",
  });


  const reportServices = new ReportingServices(dispatch, reportData);



  const handleImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files).slice(0, 3); // Limit to 3 images
      const imageUrls = [] as string[];



      for (const file of fileArray) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });


        imageUrls.push(base64);

      }

      dispatch(setImages(imageUrls));

    }
  };

  const handleText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setReportData({ ...reportData, [event.target.name]: value })
  }


  useEffect(() => {
    setReportData({ ...reportData, ["images"]: formReducer.img });
  }, [formReducer.img]);


  useEffect(() => {
    setReportData({ ...reportData, ["reportType"]: isPinLoc ? ReportType.DEVICELOCATION : ReportType.PROVIDEDLOCATION });
  }, [isPinLoc]);

  useEffect(() => {
    setReportData(prev => ({
      ...prev, animalType: formReducer.animalType,
      status: formReducer.status,
    }));

  }, [formReducer]);

  useEffect(() => {
    setReportData(prev => ({
      ...prev, lat: formReducer.loc.lat,
      lng: formReducer.loc.lng,
    }))

    console.log(reportData.lat);
  }, [formReducer]);

  useEffect(() => {

    if (isPinLoc) {
      if (reportData.animalType != -1 && reportData.status != -1 && reportData.images.length != 0) {
        setDataValidation(true);
      }
    } else {
      if (reportData.animalType != -1 && reportData.status != -1 && reportData.images.length != 0 && reportData.landmark != "") {
        setDataValidation(true);
      }
    }
  }, [reportData]);

  const handleSubmit = async () => {

    const isSuccess = await reportServices.submitReport();


    if (isSuccess) {

      setReportData({
        reportType: ReportType.NONE,
        animalType: -1,
        status: -1,
        description: "",
        lat: 0.0,
        lng: 0.0,
        landmark: "",
        images: [],
        contact: "09",
      });
      setDataValidation(false);
      dispatch(resetData());
    }
  }
  /////// COMPONENTS ////

  const statusTypeDropdown = (
    <Dropdown
      key={"dropdown-status"}
      data={
        {
          options: statusType,
          label: "Select Animal Status",
          selectedData: reportData.status,
          name: "status"
        }

      }

    />
  );

  const animalTypeDropdownCon = (

    <Dropdown
      key={"dropdown-animal"}
      data={
        {
          options: animalList,
          label: "Select Animal status",
          selectedData: reportData.animalType,
          name: "type"
        }
      }
    />
  );

  const mapCon = (
    <MapComponent isShow={isPinLoc} />
  );

  const uploadCom = (
    <div className="w-full relative">
      <button className="flex justify-between m-[0px_0px_10px_0px] w-full h-fit p-[15px_20px] bg-[var(--primary)] rounded-[10px] text-white text-[14px]">
        {formReducer.img.length > 0 ? "Add more photo" : " Select 1 to 3 photos"} {photoIcon}
      </button>
      <input
        id="image-picker"
        type="file"
        accept="image/*"
        multiple
        className="absolute opacity-0 w-full h-full top-0"
        onChange={handleImages}
      />
    </div>
  );

  const descriptionCon = (
    <motion.div className="w-full flex flex-col gap-[5px] text-[16px] ">
      <label htmlFor="description" className="text-gray-600">
        Provide short description
      </label>
      <textarea
        value={reportData.description}
        name="description"
        id="description"
        className="border-[2px] border-solid border-[var(--primary)] rounded-[5px] p-[5px]"
        rows={5}
        onChange={(e) => handleText(e)}
      ></textarea>
    </motion.div>
  );

  const contactInformation = (
    <motion.div className="w-full flex flex-col gap-[5px] text-[16px] ">
      <label htmlFor="contact" className="text-gray-600">
        Contact Information (Optional)
      </label>
      <input
        value={reportData.contact}
        type="tel"
        inputMode="numeric"
        maxLength={11}
        name="contact"
        id="contact"
        className="border-[2px] border-solid border-[var(--primary)] rounded-[5px] p-[15px]"
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          if (e.target.value.length < 3) {
            setReportData({ ...reportData, [e.target.name]: "09" })
          } else {
            setReportData({ ...reportData, [e.target.name]: value })
          }
        }}
      />
    </motion.div>
  );

  const locationButton = (
    <div className="w-full flex flex-col justify-center gap-[20px] ">
      {btn(
        "This will use your phone or computer's GPS to pinpoint the location.",
        "Use my location",
        isPinLoc,
        () => setPinLoc(true)
      )}
      {btn(
        "If you know a landmark or address near the issue, tap here to type it in.",
        "Provide a location",
        !isPinLoc,
        () => setPinLoc(false)
      )}
    </div>
  );

  const landmarkTextField = (
    <AnimatePresence>
      {!isPinLoc && (
        <motion.div
          className="landmark w-full flex flex-col"
          animate={{
            opacity: [0, 1],
            transform: ["translateY(100px)", "translateY(0px)"],
          }}
          exit={{
            opacity: 0,
            transform: "translateY(100px)",
          }}
          transition={{
            duration: 0.25,
            bounce: 0.4,
            type: "spring",
          }}
        >
          <label htmlFor="landmark" className="text-[14px] text-gray-600">
            Provide Landmark
          </label>
          <textarea
            value={reportData.landmark}
            name="landmark"
            minLength={5}
            onChange={(e) => handleText(e)}
            className="border-[2px] border-solid border-[var(--primary)] rounded-[10px] p-[5px] text-[16px]"
          ></textarea>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const submitBtn = (
    <button className="w-[200px] min-h-[60px] rounded-[10px] p-[10px] text-white text-[16px] self-end"

      style={{
        backgroundColor: isDataValid ? "var(--primary)" : "gray",
      }}
      onClick={handleSubmit}
    >
      Submit
    </button>
  );


  const guides = <>
    {
      !isDataValid && <div className="guide-column flex flex-col gap-5px text-[1rem] text-red-500">
        <span className="text-gray-700 font-semibold">Do the remaining steps required to submit your report</span>
        <div className="h-[10px]" ></div>
        {reportData.animalType === -1 && <div><i className="ri-close-fill"></i> <p>Select Animal Type</p></div>}
        {reportData.status === -1 && <div><i className="ri-close-fill"></i> <p>Select Animal Status</p></div>}
        {reportData.images.length === 0 && <div><i className="ri-close-fill"></i><p>Select at least 1 photo</p></div>}
        {!isPinLoc && reportData.landmark === "" && <div><i className="ri-close-fill"></i><p>Provide a landmark</p></div>}
      </div>
    }
  </>

  return (
    <div className="form-main">
      <div className="nav">
        <Navbar />
      </div>
      {/** BODY */}

      <div
        className="form-body w-full flex flex-col flex-[1] text-[18px] gap-[15px] overflow-auto"

      >
        <span className="text-3xl font-semibold mb-[20px]">
          Report an Animal in{" "}
          <span className="text-[var(--primary)]">need.</span>
        </span>
        {locationButton}
        {landmarkTextField}
        {mapCon}
        {animalTypeDropdownCon}
        {statusTypeDropdown}
        {descriptionCon}
        <SelectedPhotos />
        {uploadCom}
        {contactInformation}
        <div className="min-h-[20px]"></div>
        {guides}
        <div className="min-h-[20px]"></div>
        {submitBtn}
        <div className="h-[20px]"></div>

      </div>
      <LoadingIndicator />
    </div>
  );
}

const btn = (
  info: string,
  label: string,
  isSelected: boolean,
  onClick: () => void
) => (
  <div className="flex flex-col gap-1.5 w-full text-[.8rem] text-gray-600  ">
    <span className="flex gap-1.5 items-center">
      <i className="ri-information-fill text-[var(--primary)] text-[1.3rem]"></i>
      {info}
    </span>
    <motion.div className="flex w-full gap-4 items-center" layout>
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{
              transform: "translateX(-50px)",
            }}
            animate={{
              transform: "translateX(0px)",
            }}
          >
            {handpoint}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        className="h-fit rounded-[10px] p-[10px_20px] border-[2px] border-solid border-[var(--primary)] text-[1rem] font-semibold"
        animate={{
          backgroundColor: isSelected ? "var(--primary)" : "#ffffff",
          color: isSelected ? "#ffffff" : "var(--primary)",
          width: isSelected ? "90%" : "100%",
          originX: 1,
        }}
        transition={{
          duration: 0.3, // Smooth transition duration
          ease: "easeInOut", // Easing for smoother animations
        }}
        aria-pressed={isSelected}
        onClick={onClick}
      >
        <span className="flex justify-between">
          {label}
          {label === "Use my location"
            ? pinLocationIcon(isSelected)
            : locationIcon(isSelected)}
        </span>
      </motion.button>
    </motion.div>
  </div>
);


const handpoint = (
  <svg
    height={30}
    fill="var(--primary)"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path d="M512 199.652c0 23.625-20.65 43.826-44.8 43.826h-99.851c16.34 17.048 18.346 49.766-6.299 70.944 14.288 22.829 2.147 53.017-16.45 62.315C353.574 425.878 322.654 448 272 448c-2.746 0-13.276-.203-16-.195-61.971.168-76.894-31.065-123.731-38.315C120.596 407.683 112 397.599 112 385.786V214.261l.002-.001c.011-18.366 10.607-35.889 28.464-43.845 28.886-12.994 95.413-49.038 107.534-77.323 7.797-18.194 21.384-29.084 40-29.092 34.222-.014 57.752 35.098 44.119 66.908-3.583 8.359-8.312 16.67-14.153 24.918H467.2c23.45 0 44.8 20.543 44.8 43.826zM96 200v192c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V200c0-13.255 10.745-24 24-24h48c13.255 0 24 10.745 24 24zM68 368c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z"></path>
    </g>
  </svg>
);

const locationIcon = (isSelected: boolean) => (
  <svg
    height={20}
    version="1.0"
    id="Layer_1"
    viewBox="0 0 64 64"
    enableBackground="new 0 0 64 64"
    fill="white"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <g>
        {" "}
        <path
          fill={isSelected ? "white" : "var(--primary)"}
          d="M32,0C18.745,0,8,10.745,8,24c0,5.678,2.502,10.671,5.271,15l17.097,24.156C30.743,63.686,31.352,64,32,64 s1.257-0.314,1.632-0.844L50.729,39C53.375,35.438,56,29.678,56,24C56,10.745,45.255,0,32,0z M32,38c-7.732,0-14-6.268-14-14 s6.268-14,14-14s14,6.268,14,14S39.732,38,32,38z"
        ></path>{" "}
        <path
          fill={isSelected ? "white" : "var(--primary)"}
          d="M32,12c-6.627,0-12,5.373-12,12s5.373,12,12,12s12-5.373,12-12S38.627,12,32,12z M32,34 c-5.523,0-10-4.478-10-10s4.477-10,10-10s10,4.478,10,10S37.523,34,32,34z"
        ></path>{" "}
      </g>{" "}
    </g>
  </svg>
);

const pinLocationIcon = (isSelected: boolean) => (
  <svg
    fill={isSelected ? "white" : "var(--primary)"}
    height={20}
    version="1.1"
    id="Capa_1"
    viewBox="0 0 296.999 296.999"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <g>
        {" "}
        <path d="M296.617,267.291L265.83,159.396c-1.222-4.281-5.133-7.232-9.583-7.232h-70.799c14.204-19.17,28.03-44.434,28.03-70.154 c0-35.842-29.148-65.002-64.977-65.002c-35.83,0-64.979,29.16-64.979,65.002c0,25.721,13.826,50.984,28.031,70.154h-70.8 c-4.45,0-8.361,2.951-9.583,7.232L0.383,267.291c-0.857,3.006-0.256,6.242,1.628,8.738c1.883,2.496,4.828,3.963,7.955,3.963 h277.068c3.127,0,6.072-1.467,7.955-3.963C296.873,273.533,297.474,270.297,296.617,267.291z M148.501,36.939 c24.838,0,45.046,20.219,45.046,45.07c0,33.348-31.124,68.463-45.046,82.502c-13.923-14.039-45.048-49.154-45.048-82.502 C103.453,57.158,123.662,36.939,148.501,36.939z M128.117,172.097c7.473,8.078,13.078,13.07,13.797,13.705 c1.883,1.656,4.234,2.486,6.587,2.486c2.353,0,4.705-0.83,6.587-2.486c0.719-0.635,6.324-5.627,13.796-13.705h79.843l2.77,9.707 l-38.549,32.125l-167.9-30.527l3.227-11.305H128.117z M76.247,260.06v-50.727l116.744,21.227l-35.401,29.5H76.247z M39.552,202.662 l16.763,3.047v54.352H23.174L39.552,202.662z M188.724,260.06l68.753-57.295l16.349,57.295H188.724z"></path>{" "}
        <path d="M175.311,82.01c0-14.861-12.027-26.951-26.811-26.951c-14.784,0-26.813,12.09-26.813,26.951 c0,14.859,12.028,26.951,26.813,26.951C163.284,108.961,175.311,96.869,175.311,82.01z M141.62,82.01 c0-3.871,3.087-7.02,6.881-7.02c3.793,0,6.879,3.148,6.879,7.02s-3.086,7.02-6.879,7.02C144.707,89.029,141.62,85.881,141.62,82.01 z"></path>{" "}
      </g>{" "}
    </g>
  </svg>
);

const photoIcon = (
  <svg
    height={20}
    viewBox="0 -0.5 18 18"
    xmlns="http://www.w3.org/2000/svg"
    fill="#000000"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        fill="white"
        fillRule="evenodd"
        d="M532,254.954383 L532,247.775909 L520,247.775909 L520,258.615121 L522.848655,255.813199 C523.24044,255.427841 523.87547,255.423851 524.271358,255.808487 L525.05481,256.569671 L528.568706,253.033719 C528.958829,252.641147 529.59365,252.630547 530.001301,253.024219 L532,254.954383 Z M533,259.406871 L533.960593,259.541874 C534.51207,259.619379 535.020377,259.235606 535.097766,258.684953 L536.765938,246.815293 C536.843443,246.263816 536.459671,245.75551 535.909017,245.678121 L524.039358,244.009949 C523.487881,243.932444 522.979574,244.316216 522.902185,244.86687 L522.633887,246.775909 L520.006845,246.775909 C519.449949,246.775909 519,247.226689 519,247.782754 L519,259.769063 C519,260.32596 519.45078,260.775909 520.006845,260.775909 L531.993155,260.775909 C532.550051,260.775909 533,260.325128 533,259.769063 L533,259.406871 Z M533,258.397037 L534.10657,258.552556 L535.776647,246.669339 L523.89343,244.999262 L523.643739,246.775909 L531.993155,246.775909 C532.54922,246.775909 533,247.225857 533,247.782754 L533,258.397037 Z"
        transform="translate(-519 -244)"
      ></path>{" "}
    </g>
  </svg>
);

const animalList = ["Dog", "Cat", "Other"];
const statusType = ["Stray", "Injured", "Abused"];
