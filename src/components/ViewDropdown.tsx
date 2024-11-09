import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Blend, ChevronDown, ChevronRight } from "lucide-react";
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
          <DropdownMenuItem onClick={() => setValue("transparent")}>
            <Blend className="h-4 w-4 mr-2" />
            Transparent
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setValue("normal")}>
            <Blend className="h-4 w-4 mr-2" />
            Normal
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
};

export default ViewDropdown;
