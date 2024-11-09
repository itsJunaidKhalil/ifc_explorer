import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { File, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ViewDropdown = ({value, setValue}: any) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <DropdownMenu onOpenChange={(v) => setIsOpen(v)}>
        <DropdownMenuTrigger asChild>
          <Button  className="gap-2 capitalize">
            {!isOpen ? <ChevronDown className="h-4 w-4 mr-2"/> : <ChevronDown className="h-4 w-4 mr-2"/>}
            {value}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setValue("DummyModel.ifc")}>
            <File className="h-4 w-4 mr-2" />
            DummyModel.ifc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setValue("SmallModel.ifc")}>
          <File className="h-4 w-4 mr-2" />
            SmallModel.ifc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setValue("WoodenOffice.ifc")}>
          <File className="h-4 w-4 mr-2" />
            WoodenOffice.ifc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
};

export default ViewDropdown;
