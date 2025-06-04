import { handpoint } from "@/app/lib/components/icons/HandPoint";
import { locationIcon } from "@/app/lib/components/icons/Location";
import { pinLocationIcon } from "@/app/lib/components/icons/PinLocation";
import { ReportType } from "@/app/lib/enum/ReportType";
import { updateFormData } from "@/app/lib/redux/formReducer";
import { RootState } from "@/app/lib/redux/store";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export const ReportypeButton = () => {

  const dispatch = useDispatch();
  const formReducer = useSelector((state: RootState) => state.form);

  const isGps = formReducer.reportType === ReportType.DEVICELOCATION;

  const handleReportType = () => {

    const type = isGps ? ReportType.PROVIDEDLOCATION : ReportType.DEVICELOCATION;

    dispatch(updateFormData({ key: "reportType", data: type }));

  }

  return <div className="flex w-full justify-between items-center ">
    <span>Use my device location</span>
    {/** TOGGLE BUTTON */}
    <div className="relative w-[2.5rem] h-[1.5rem]">
      <motion.div className={`absolute inset-0 h-1 ${isGps ? "bg-orange-300" : "bg-gray-500"} rounded-4xl top-1/2 -translate-y-1/2`} />
      <motion.div className="absolute w-[1.5rem] h-[1.5rem] bg-orange-300 rounded-full top-1/2 -translate-y-[50%]
        border border-orange-400
      "
        animate={{
          translateX: isGps ? "100%" : "0%",
        }}

        transition={{
          duration: .3,
          bounce: .4,
          type: "spring",
          damping: 9,
        }}

        onClick={handleReportType}
      />
    </div>
  </div>
}