import PetModel from "@/app/lib/models/Pet";
import Image from "next/image";




const ItemTile = ({ data }: { data: PetModel }) => <div className="w-full h-[250px] flex items-center border rounded-[11px] border-gray-300 p-2.5"
>
    <div className="relative w-[50%] min-h-[235px] rounded-[12px] overflow-hidden">
        <Image
            alt="pet image"
            src={data.url}
            fill
            className="object-cover rounded-[12px]"
            
        />
    </div>
    <div className="w-[50%] h-full p-2 text-[.8rem] flex flex-col justify-start gap-2" >
        <div className="h-fit w-fit p-[5px_10px_5px_10px] bg-orange-300 text-white rounded-[24px]">{data.status}</div>
        <div className="flex-[1] w-full"><span>{data.notes}</span></div>
        <span className="font-bold text-[1rem] place-self-end">{data.name}

            {/** AGE */}
            <span className="text-gray-400">, Age: {data.age}</span>
        </span>
    </div>
</div>


export default ItemTile;