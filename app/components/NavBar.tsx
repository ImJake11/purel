import Link from "next/link";
import Logo from "./Logo";

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
    return <div style={styles}>
        <Logo />
        <div className="flex gap-1.5">
            <button>Home</button>
            <Link href="/pages/pets-lists"><button>Adopt</button></Link>
        </div>


    </div>
}