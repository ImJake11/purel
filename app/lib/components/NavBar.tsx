import Link from "next/link";
import Logo from "./Logo";
import UserAvatar from "./UserAvatar";

const styles: React.CSSProperties = {
    width: "100vw",
    height: "100%",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 15px 0px 15px",
    fontSize: "14px",
}

export default function Navbar() {
    return <div className="w-full flex justify-between items-center">
        <Logo />
        <UserAvatar />
    </div>
}