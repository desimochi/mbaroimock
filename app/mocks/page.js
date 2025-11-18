import BackButton from "@/components/BackButton";
import MockTests from "@/components/MockTests";


export default function Mockpage(){
    return (
        <div className="h-fit">
        <div className="max-w-7xl mx-auto mt-4">
                <BackButton />
        </div>
            
        <MockTests />
        </div>
    )
}