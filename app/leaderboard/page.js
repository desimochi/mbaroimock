import { Suspense } from "react";
import Temp from "./Temp";

export default function Page (){
  return(
    <Suspense fallback={<p>Loading....</p>}>
      <Temp/>
    </Suspense>
  )
}