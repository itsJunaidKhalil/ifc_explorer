import React from 'react'
import { TableCell, TableRow } from '../ui/table'
import { Checkbox } from '@radix-ui/react-checkbox'
import { ChevronDown, ChevronRight, Minus, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { ConnComp } from '@/interfaces'
import { AppAction } from '@/App'

interface Props {
    config: { id: number } & ConnComp;
    appDispatch?: React.Dispatch<AppAction>; 
}

const toggleRowExpanded = (rowId: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

const SingleConfig = ({ config }: Props) => {
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function updateCount(id: number, operation: string) {
    
  }


  function toggleConfig(id: number) {
    if (appDispatch)
      appDispatch({
        type: "remove_component",
        id: id,
      });
  }
  return (
    <div>
      <>
            <TableRow key={config.id}>
              <TableCell>
                <Checkbox
                  checked={true}
                  onCheckedChange={() => toggleConfig(config.id)}
                />
              </TableCell>
              <TableCell>
                <span
                  className="cursor-pointer"
                  onClick={() => toggleRowExpanded(config.id)}
                >
                    {expandedRows[config.id] ? (
                      <ChevronDown className="h-4 w-4 inline mr-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4 inline mr-4" />
                    )}
                  {config.name} 
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateCount(config.id, "add")}
                    // disabled={config.count === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{config.count}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateCount(config.id, "add")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            {expandedRows[config.id] && (
              <TableRow>
                <TableCell colSpan={4}>
                  {config.components.map((comp) => (
                    <li key={comp.id}>{comp.name}</li>
                  ))}
                </TableCell>
              </TableRow>
            )}
          </>
    </div>
  )
}

export default SingleConfig
