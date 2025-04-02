import { Box, Images, Shirt } from "lucide-react";

export default function Credits() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center mr-2">
        <Box size={18} className="mr-1" color="#af40e2" />
        <p className="text-md font-semibold">1</p>
      </div>
      <div className="flex items-center mr-2">
        <Shirt size={18} className="mr-1" color="#af40e2" />
        <p className="text-md font-semibold">100</p>
      </div>
      <div className="flex items-center">
        <Images size={18} className="mr-1" color="#af40e2" />
        <p className="text-md font-semibold">100</p>
      </div>
    </div>
  );
}
