"use client";

import Dropdown from "@/app/report-form/components/Dropdown";
import MapComponent from "@/app/report-form/components/MapComponent.";
import { AnimatePresence, motion } from "framer-motion";
import SelectedPhotos from "@/app/report-form/components/SelectedPhotos";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addImage, resetData, updateFormData } from "@/app/lib/redux/formReducer";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import { ReportType } from "@/app/lib/enum/ReportType";
import Navbar from "@/app/lib/components/NavBar";
import ReportingServices from "@/app/lib/services/ReportingServices";
import "remixicon/fonts/remixicon.css";
import Sidebar from "@/app/lib/components/Sidebar";
import { toggleOff } from "@/app/lib/redux/loadingReducer";
import { photoIcon } from "@/app/lib/components/icons/PhotoIcon";
import { ReportypeButton } from "./components/ReportTypeButton";
import { ReportProgress } from "./components/ReportProgress";
import LandmarkTf from "./components/LandmarkTf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faExclamation } from "@fortawesome/free-solid-svg-icons";



export default function Page() {

  const dispatch = useDispatch();

  const [isDataValid, setDataValidation] = useState(false);

  const formReducer = useSelector((state: RootState) => state.form);
  const reportProgressReducer = useSelector((state: RootState) => state.progress);

  const isPinLoc = formReducer.reportType === ReportType.DEVICELOCATION;

  const reportServices = new ReportingServices(dispatch, formReducer, reportProgressReducer.error.length);

  const handleImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files).slice(0, 3); // Limit to 3 images
      let imageUrls = [] as string[];



      for (const file of fileArray) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });


        imageUrls.push(base64);

      }

      for (let url of imageUrls) {
        dispatch(addImage(url));
      }

      imageUrls = [];

    }
  };

  const handleText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    dispatch(updateFormData({ key: name, data: value }))
  }

  const handleSubmit = async () => {

    const isSuccess = await reportServices.submitReport();


    if (isSuccess) {
      setDataValidation(false);
      dispatch(resetData());
    }
  }


  useEffect(() => {
    dispatch(toggleOff());
  }, []);


  ////// MONITOR VALIDATION
  useEffect(() => {

    let isValid = false;

    const { reportType, animalType, status, images, landmark } = formReducer;

    if (reportType === ReportType.PROVIDEDLOCATION) {
      if (landmark && animalType != -1 && status != -1 && images.length > 0) {
        isValid = true;
      }
    } else {
      if (animalType != -1 && status != -1 && images.length > 0) {
        isValid = true;
      }
    }
    setDataValidation(isValid);
  }, [formReducer]);
  /////// COMPONENTS ////

  const statusTypeDropdown = (
    <Dropdown
      key={"dropdown-status"}
      data={
        {
          options: statusType,
          label: "Animal Status",
          selectedData: formReducer.status,
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
          label: "Animal Type",
          selectedData: formReducer.animalType,
          name: "animalType"
        }
      }
    />
  );

  const uploadCom = <div className="w-full relative">
    <button className="bg-red-400 flex justify-between mb-[1rem] w-full h-fit p-[15px_20px]
       rounded-[10px] text-white text-[14px] "
      style={{
        boxShadow: "1px 1px 15px rgba(74, 85, 101, .5)",
        backgroundImage: "linear-gradient(135deg, #fb923c 40%,  #f97316 60%)"
      }}
    >
      <span>Select 1 to 3 photos </span>{photoIcon}
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



  const descriptionCon = (
    <motion.div className="w-full flex flex-col gap-[5px] text-[16px] ">
      <label htmlFor="description" className="text-gray-600 text-[.7rem] ml-[.8rem]">
        Provide short description
      </label>
      <textarea
        value={formReducer.description}
        name="description"
        id="description"
        style={{
          boxShadow: "1px 1px 15px rgba(74, 85, 101, .5)"
        }}
        className="border-[2px] border-solid border-[var(--primary)] rounded-[5px] p-[5px]"
        rows={5}
        onChange={(e) => handleText(e)}
      ></textarea>
    </motion.div>
  );

  const contactInformation = (
    <motion.div className="w-full flex flex-col gap-[5px] text-[16px] ">
      <label htmlFor="description" className="text-gray-600 text-[.7rem] ml-[.8rem]">
        Phone Number
      </label>
      <input
        value={formReducer.contact}
        type="tel"
        inputMode="numeric"
        maxLength={11}
        name="contact"
        id="contact"
        style={{
          boxShadow: "1px 1px 15px rgba(74, 85, 101, .5)"
        }}
        className="border-[2px] border-solid border-[var(--primary)] rounded-[5px] p-[15px]"
        onChange={(e) => {
          const name = e.target.name;
          const value = e.target.value.replace(/\D/g, '');

          if (e.target.value.length < 3) {
            dispatch(updateFormData({ key: name, data: "09" }))
          } else {
            dispatch(updateFormData({ key: name, data: value }));
          }
        }
        }
      />
    </motion.div>
  );



  const Guides = () => {

    const errorItemStyles = "w-full flex items-center gap-2 mt-[.3rem]";

    return !isDataValid && <div className="w-full h-fit p-6 flex flex-col gap-5px text-[1rem]
       text-red-500 bg-gray-100 rounded-[12px]"
      style={{
        boxShadow: "1px 1px 15px rgba(74, 85, 101, .6)"
      }}
    >
      {/** TITLE */}
      <span className="text-gray-600 font-semibold flex gap-1.5 items-center"> <FontAwesomeIcon icon={faCircleExclamation} color="red" />
        Complete these steps to submit your report.
      </span>
      <div className="h-[1rem]" ></div>
      {formReducer.animalType === -1 && <div className={errorItemStyles}><FontAwesomeIcon icon={faExclamation} color="rgb(255, 77, 79)rgb(255, 77, 79)" /> <p>Select Animal Type</p></div>}
      {formReducer.status === -1 && <div className={errorItemStyles}><FontAwesomeIcon icon={faExclamation} color="rgb(255, 77, 79)rgb(255, 77, 79)" /> <p>Select Animal Status</p></div>}
      {formReducer.images.length === 0 && <div className={errorItemStyles}><FontAwesomeIcon icon={faExclamation} color="rgb(255, 77, 79)rgb(255, 77, 79)" /><p>Select at least 1 photo</p></div>}
      {!isPinLoc && formReducer.landmark === "" && <div className={errorItemStyles}><FontAwesomeIcon icon={faExclamation} color="rgb(255, 77, 79)rgb(255, 77, 79)" /><p>Provide a landmark</p></div>}
    </div>
  }


  return (
    <div className="w-screen h-screen overflow-x-hidden relative flex flex-col">
      <div className="w-full h-fit p-3.5">
        <Navbar />
      </div>

      {/** BODY */}

      <div
        className="form-body w-full flex flex-col flex-[1]
        text-[18px] gap-2.5 overflow-auto p-4
        "
      >
        <span className="text-3xl font-semibold mb-[.5rem]">
          Report an Animal in{" "}
          <span className="text-[var(--primary)]">need.</span>
        </span>
        <ReportypeButton />
        <LandmarkTf />
        <MapComponent />
        {animalTypeDropdownCon}
        {statusTypeDropdown}
        {descriptionCon}
        <SelectedPhotos />
        {uploadCom}
        {contactInformation}
        <div className="min-h-[20px]"></div>
        <Guides />
        <div className="min-h-[20px]"></div>
        {/** SUBMIT BUTTON */}
        <button className="w-[200px] min-h-[60px] rounded-[10px] p-[10px] text-white text-[16px] self-end"
          style={{
            boxShadow: "1px 1px 4px rgba(74, 85, 101, .6), -1px -1px 4px rgba(74, 85, 101, .6) ",
            backgroundImage: isDataValid ? "linear-gradient(135deg, #fb923c 40%,  #f97316 60%)" : "linear-gradient(to left, #e5e7eb,  #e5e7eb)",
          }}
          onClick={handleSubmit}
        >
          Submit
        </button>
        <div className="h-[20px]"></div>
      </div>
      <Sidebar />
      <ReportProgress />
    </div>
  );
}

const animalList = ["Dog", "Cat", "Other"];
const statusType = ["Stray", "Injured", "Abused"];
